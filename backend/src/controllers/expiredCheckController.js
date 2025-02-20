const { Sequelize } = require('sequelize');
const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const { filterUserMapping } = require('../tools/filterUserMapping');

exports.getAllExpiredCheck = async (req, res) => {
    try {
        const { area, section } = req.query;
        const page = req.query.page ?? 1;
        const user = req.user;

        const idSectionsFilter = await filterUserMapping(user.employeeCode);

        const data = await db.sms.tr_check.findAndCountAll({
            attributes: [
                'id',
                [Sequelize.col('mst_check.mst_lokasi.mst_sub_section.mst_section.area.area'), 'area'],
                [Sequelize.col('mst_check.mst_lokasi.mst_sub_section.sub_section'), 'subSection'],
                [Sequelize.col('mst_check.mst_lokasi.lokasi'), 'location'],
                [Sequelize.col('mst_cycle.cycle'), 'cycle'],
                [Sequelize.col('mst_check.activity'), 'activity']
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
                                attributes: [],
                                where: {
                                    ...(area ? { id_area: area } : {}),
                                    ...(section ? { id: section } : {}),
                                },
                                include: {
                                    model: db.sms.mst_area,
                                    attributes: [],
                                    as: 'area'
                                },
                                required: true
                            },
                            required: true
                        },
                        required: true
                    },
                    required: true
                },
                {
                    model: db.sms.mst_cycle,
                    attributes: [],
                    where: {
                        end_date: {
                            [Sequelize.Op.not]: null,
                        }
                    }
                }
            ],
            where: {
                result: null,
                ...(idSectionsFilter.length > 0 ? {
                    '$mst_check.mst_lokasi.mst_sub_section.id_section$': idSectionsFilter
                } : {}),
            },
            subQuery: false,
            offset: 10 * (page - 1),
            limit: 10,
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
};

exports.reactivateCheck = async (req, res) => {
    const t = await sequelizeInstances.sms.transaction();
    try {
        const { id_tr, cycle: postponeCycle, reason_postpone } = req.body;
        const currentYear = new Date().getFullYear();

        const trCheck = await db.sms.tr_check.findByPk(id_tr, {
            include: {
                model: db.sms.mst_check,
                attributes: ['total_cycle'],
                include: {
                    model: db.sms.mst_lokasi,
                    attributes: ['id_area']
                }
            },
            raw: true
        });

        const id_check = trCheck.id_check;
        const area = trCheck['mst_check.mst_lokasi.id_area'];
        const periodCheck = trCheck['mst_check.total_cycle'];

        console.log('cycle', postponeCycle)
        await db.sms.tr_check_postpone.create({
            check_id: id_check,
            cycle: postponeCycle,
            reason_postpone
        }, { transaction: t });


        const currentCycleData = await db.sms.mst_cycle.findOne({
            attributes: ['id', 'cycle'],
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(
                        Sequelize.fn('year', Sequelize.col('start_date')), currentYear),
                    {
                        end_date: null,
                        area_id: area
                    }
                ]
            }
        });

        const currentCycle = parseInt(currentCycleData.cycle.split(" ")[1]);
        console.log('curr cycle', currentCycle)

        if (postponeCycle === currentCycle) { // if postpone cycle is current cycle
            await db.sms.tr_check.update({
                id_cycle: currentCycleData.id
            }, {
                where: { id: id_tr },
                transaction: t
            });

            await db.sms.mst_check.update({
                current_week: Sequelize.col('total_cycle'),
            }, {
                where: {
                    id: id_check
                },
                transaction: t
            });

            t.commit();

            res.status(200).json({ message: 'data updated!' });
            return;
        }

        const diffCycle = postponeCycle - currentCycle;
        console.log(postponeCycle, currentCycle, diffCycle);

        console.log('update', periodCheck)
        await db.sms.mst_check.update({
            current_week: periodCheck - diffCycle,
        }, {
            where: {
                id: id_check
            },
            transaction: t
        });
        console.log('done update')

        await db.sms.tr_check.destroy({
            where: {
                id: id_tr
            },
            transaction: t
        });

        t.commit();
    } catch (error) {
        t.rollback();
        console.error(error);
        response(req, res, {
            status: error.name === 'SequelizeUniqueConstraintError' ? 409 : 500,
            data: error,
        });
    }
}
