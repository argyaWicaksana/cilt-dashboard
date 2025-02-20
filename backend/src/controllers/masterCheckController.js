const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const { filterUserMapping } = require('../tools/filterUserMapping');

exports.createMasterCheck = async (req, res) => {
    try {
        const {
            locationId,
            activity,
            totalCycle,
            intervalTime,
            machineStatus,
            standard,
            upcomingTask
        } = req.body;

        const data = await db.sms.mst_check.create({
            id_location: locationId,
            activity,
            total_cycle: totalCycle,
            interval_time: intervalTime,
            machine_status: machineStatus,
            standard,
            current_week: totalCycle - upcomingTask
        });

        response(req, res, {
            status: 200,
            data,
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: error.name === 'SequelizeUniqueConstraintError' ? 409 : 500,
            data: error,
        });
    }
};

exports.getAllMasterCheck = async (req, res) => {
    try {
        const { area, section } = req.query;
        const page = req.query.page ?? 1;
        const search = req.query.search ?? '';
        const user = req.user;

        console.log('sss', user)

        const idSectionsFilter = await filterUserMapping(user.employeeCode);

        const data = await db.sms.mst_check.findAndCountAll({
            include: [
                {
                    model: db.sms.mst_lokasi,
                    attributes: ['id', ['lokasi', 'name']],
                    include: {
                        model: db.sms.mst_sub_section,
                        attributes: ['id', ['sub_section', 'name']],
                        include: {
                            model: db.sms.mst_section,
                            attributes: ['id', ['section', 'name']],
                            where: {
                                ...(area ? { id_area: area } : {}),
                                ...(section ? { id: section } : {}),
                            },
                            include: {
                                model: db.sms.mst_area,
                                attributes: ['id', ['area', 'name']],
                                as: 'area',
                            },
                            required: true
                        },
                        required: true
                    },
                    required: true
                },
            ],
            offset: 10 * (page - 1),
            limit: 10,
            order: [['id', 'desc']],
            where: {
                ...(search ? {
                    [sequelizeInstances.Op.or]: [
                        sequelizeInstances.literal(`LOWER(mst_lokasi.lokasi) LIKE '%${search}%'`),
                        sequelizeInstances.literal(`LOWER(\`mst_lokasi->mst_sub_section\`.\`sub_section\`) LIKE '%${search}%'`),
                        sequelizeInstances.literal(`LOWER(\`mst_lokasi->mst_sub_section->mst_section\`.\`section\`) LIKE '%${search}%'`),
                        sequelizeInstances.literal(`LOWER(\`mst_lokasi->mst_sub_section->mst_section->area\`.\`area\`) LIKE '%${search}%'`),
                        sequelizeInstances.literal(`LOWER(activity) LIKE '%${search}%'`),
                        sequelizeInstances.literal(`LOWER(standard) LIKE '%${search}%'`)
                    ]
                } : {}),
                ...(idSectionsFilter.length > 0 ? {
                    '$mst_lokasi.mst_sub_section.id_section$': idSectionsFilter
                } : {}),
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
};

exports.updateMasterCheck = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            locationId,
            activity,
            totalCycle,
            intervalTime,
            machineStatus,
            standard,
            upcomingTask
        } = req.body;

        const data = await db.sms.mst_check.findByPk(id);
        if (!data) {
            response(req, res, {
                status: 404,
                data: 'Data not found',
            });
        } else {
            await data.update({
                id_location: locationId,
                activity,
                total_cycle: totalCycle,
                interval_time: intervalTime,
                machine_status: machineStatus,
                standard,
                current_week: totalCycle - upcomingTask
            });

            response(req, res, {
                status: 200,
                data,
            });
        }
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: error.name === 'SequelizeUniqueConstraintError' ? 409 : 500,
            data: error,
        });
    }
};

exports.deleteMasterCheck = async (req, res) => {
    try {
        const data = await db.sms.mst_check.findByPk(req.params.id);
        if (!data) {
            response(req, res, {
                status: 404,
                message: 'Data not found',
            });
        } else {
            await data.destroy();

            response(req, res, {
                status: 200,
                data,
            });
        }
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
};

exports.getCurrentCycle = async (req, res) => {
    try {

        const { area } = req.params;
        const data = await db.sms.mst_cycle.findOne({
            where: {
                end_date: null,
                area_id: area
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
};
