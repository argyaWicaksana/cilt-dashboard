const { Sequelize } = require('sequelize');
const { col, Op, literal } = Sequelize;
const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");

exports.getAllMappingUserArea = async (req, res) => {
    try {
        const { page, search } = req.query;

        const data = await db.sms.mst_mapping_user_area.findAndCountAll({
            attributes: {
                include: [
                    [col('vw_login.lg_name'), 'lg_name'],
                    [col('vw_login.userlevel.userlevelname'), 'user_level_name'],
                ]
            },
            include: [
                {
                    model: db.sms.vw_login,
                    attributes: [],
                    include: {
                        model: db.sms.userlevels,
                        attributes: [],
                    }
                },
                {
                    model: db.sms.mst_area,
                    attributes: ['id', 'area']
                },
                {
                    model: db.sms.mst_section,
                    attributes: ['id', 'section']
                },
            ],
            where: {
                ...(search ? {
                    [Op.or]: [
                        literal(`LOWER(mst_mapping_user_area.lg_nik) LIKE '%${search}%'`),
                        literal(`LOWER(vw_login.lg_name) LIKE '%${search}%'`),
                        literal(`LOWER(\`vw_login->userlevel\`.\`userlevelname\`) LIKE '%${search}%'`),
                        literal(`LOWER(mst_area.area) LIKE '%${search}%'`),
                        literal(`LOWER(mst_section.section) LIKE '%${search}%'`),
                    ]
                } : {}),
            },
            offset: 10 * ((page ?? 1) - 1),
            limit: 10,
            order: [['id', 'desc']]
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
            message: error.message
        });
    }
}

exports.createMappingUserArea = async (req, res) => {
    try {
        const {
            lg_nik,
            id_area,
            id_section
        } = req.body;
        const user = req.user;

        const data = await db.sms.mst_mapping_user_area.create({
            lg_nik,
            id_area,
            id_section,
            is_active: 1,
            last_update: new Date(),
            update_by: user.employeeCode == '0000' ? 'Administrator' : user.employeeCode
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
}

exports.updateMappingUserArea = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            lg_nik,
            id_area,
            id_section
        } = req.body;
        const user = req.user;

        const data = await db.sms.mst_mapping_user_area.findByPk(id);
        if (!data) {
            response(req, res, {
                status: 404,
                data: 'Data not found',
            });
        } else {
            await data.update({
                lg_nik,
                id_area,
                id_section,
                last_update: new Date(),
                update_by: user.employeeCode == '0000' ? 'Administrator' : user.employeeCode
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

exports.deleteMappingUserArea = async (req, res) => {
    try {
        const data = await db.sms.mst_mapping_user_area.findByPk(req.params.id);
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