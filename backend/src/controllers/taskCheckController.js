const { Sequelize } = require('sequelize');
const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const { filterUserMapping } = require('../tools/filterUserMapping');

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

            await iot_prod.tr_check.update({
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
