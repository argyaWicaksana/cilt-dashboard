const { Sequelize } = require('sequelize');
const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const { filterUserMapping } = require('../tools/filterUserMapping');
const moment = require('moment');

exports.getAllTaskCheck = async (req, res) => {
    try {
        const page = req.query.page ?? 1;
        const { area, section, sub_section, activity } = req.query;
        const user = req.user;

        const idSectionsFilter = await filterUserMapping(user.employeeCode);

        const data = await db.sms.tr_check.findAndCountAll({
            attributes: ['id'],
            include: [
                {
                    model: db.sms.mst_check,
                    attributes: ['activity', 'standard'],
                    include: {
                        model: db.sms.mst_lokasi,
                        attributes: ['id', ['lokasi', 'name']],
                        include: {
                            model: db.sms.mst_sub_section,
                            attributes: ['id', ['sub_section', 'name']],
                            include: {
                                model: db.sms.mst_section,
                                attributes: ['id', ['section', 'name']],
                                include: {
                                    model: db.sms.mst_area,
                                    attributes: ['id', ['area', 'name']],
                                    as: 'area'
                                }
                            }
                        }
                    },
                },
                {
                    model: db.sms.mst_cycle,
                    attributes: ['cycle'],
                    where: {
                        end_date: null
                    }
                }
            ],
            where: {
                result: null,
                ...(idSectionsFilter.length > 0 ? {
                    '$mst_check.mst_lokasi.mst_sub_section.id_section$': idSectionsFilter
                } : {}),
                ...(area ? {
                    '$mst_check.mst_lokasi.id_area$': area
                } : {}),
                ...(section ? {
                    '$mst_check.mst_lokasi.mst_sub_section.id_section$': section
                } : {}),
                ...(sub_section ? {
                    '$mst_check.mst_lokasi.id_sub_section$': sub_section
                } : {}),
                ...(activity ? {
                    '$mst_check.activity$': {
                        [Sequelize.Op.substring]: activity
                    }
                } : {})
            },
            offset: 10 * (page - 1),
            limit: 10,
            subQuery: false,
            order: [['created_at', 'desc']]
        });

        response(req, res, {
            status: 200,
            data,
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}

exports.createReport = async (req, res) => {
    const { data } = req.body;
    const photos = req.files;
    const t = await sequelizeInstances.sms.transaction();

    try {
        for (let i = 0; i < data.length; i++) {
            let photo = photos.find(p => p.fieldname === `data[${i}][photo]`)?.filename ?? null;

            if (photo) {
                photo = 'uploads/tr_check/' + photo;
            }

            await db.sms.tr_check.update({
                result: data[i].result,
                pic: data[i].pic,
                date_check: data[i].date_check,
                note: data[i].note,
                photo,
                executor_2: data[i].executor_2
            }, {
                where: { id: data[i].id },
                transaction: t
            });
        }

        await t.commit();

        response(req, res, {
            status: 200,
            data: {
                message: 'Data created!'
            }
        });
    } catch (error) {
        t.rollback();
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}

exports.getProgressCiltBySection = async (req, res) => {
    try {
        const { areaId, yearMonth } = req.params;

        const [year, month] = yearMonth.split('-');

        const data = await db.sms.tr_check.findAll({
            attributes: [
                [Sequelize.literal('CAST(SUM(IF(result IS NULL, 0, 1)) AS UNSIGNED)'), 'finish'],
                [Sequelize.fn('count', Sequelize.col('*')), 'total'],
                [Sequelize.col('mst_check.mst_lokasi.mst_sub_section.sub_section'), 'sub_section'],
                [Sequelize.col('mst_cycle.cycle'), 'cycle'],
                [Sequelize.col('mst_cycle.reason_stop'), 'reason_stop'],
            ],
            include: [
                {
                    model: db.sms.mst_check,
                    attributes: [],
                    include: {
                        model: db.sms.mst_lokasi,
                        attributes: [],
                        include: {
                            model: db.sms.mst_sub_section,
                            attributes: [],
                            include: {
                                model: db.sms.mst_section,
                                attributes: []
                            }
                        }
                    }
                },
                {
                    model: db.sms.mst_cycle,
                    attributes: []
                }
            ],
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('month', Sequelize.col('mst_cycle.start_date')), month),
                    Sequelize.where(Sequelize.fn('year', Sequelize.col('mst_cycle.start_date')), year),
                ],
                '$mst_check.mst_lokasi.mst_sub_section.mst_section.id_area$': areaId
            },
            group: [
                'mst_check.mst_lokasi.id_sub_section',
                'id_cycle'
            ]
        });

        response(req, res, {
            status: 200,
            data,
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}

exports.getAllCycle = async (req, res) => {
    try {
        const { areaId, yearMonth } = req.params;
        const [year, month] = yearMonth.split('-');

        const data = await db.sms.mst_cycle.findAll({
            attributes: [
                'id',
                'cycle',
                'area_id',
                'reason_stop'
            ],
            where: {
                area_id: areaId,
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('month', Sequelize.col('start_date')), month),
                    Sequelize.where(Sequelize.fn('year', Sequelize.col('start_date')), year),
                ]
            },
            order: [['id', 'asc']]
        });

        response(req, res, {
            status: 200,
            data,
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}

exports.getCurrentCycle = async (req, res) => {
    try {
        const { areaId } = req.params;

        const data = await db.sms.mst_cycle.findOne({
            where: {
                area_id: areaId,
                end_date: null
            }
        });

        response(req, res, {
            status: 200,
            data,
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}
