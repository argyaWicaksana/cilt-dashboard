const { Sequelize } = require('sequelize');
const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const { filterUserMapping } = require('../tools/filterUserMapping');

exports.getAllSections = async (req, res) => {
    try {
        const { area_id: areaId } = req.query;
        const user = req.user;

        const idSectionsFilter = await filterUserMapping(user.employeeCode);

        const data = await db.sms.mst_section.findAll({
            attributes: ['id', ['section', 'name']],
            where: {
                ...(areaId ? { id_area: areaId } : {}),
                ...(idSectionsFilter.length > 0 ? {
                    id: idSectionsFilter
                } : {})
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

exports.getAllSubSections = async (req, res) => {
    try {
        const sectionId = req.query.section_id;
        const areaId = req.query.area_id;

        let order = [];

        order[0] = `
                case
	                when mst_sub_section.sub_section = 'Preparation' then 1
	                when mst_sub_section.sub_section = 'Injection' then 2
	                when mst_sub_section.sub_section = 'Blow' then 3
	                when mst_sub_section.sub_section = 'Filling' then 4
	                when mst_sub_section.sub_section = 'Label' then 5
	                when mst_sub_section.sub_section = 'Packer' then 6
	                when mst_sub_section.sub_section = 'Offline' then 7
                end
            `;

        order[2] = `
                case
	                when mst_sub_section.sub_section not in('Pillow Seal', 'Packaging') then 1
	                when mst_sub_section.sub_section = 'Pillow Seal' then 2
	                when mst_sub_section.sub_section = 'Packaging' then 3
                end
            `;

        const data = await db.sms.mst_sub_section.findAll({
            attributes: ['id', ['sub_section', 'name']],
            where: {
                ...(sectionId ? { id_section: sectionId } : {})
            },
            ...(areaId ? {
                include: {
                    model: db.sms.mst_section,
                    attributes: [],
                    where: {
                        id_area: areaId
                    }
                }
            } : {}),
            order: [
                ...(areaId && order[areaId - 1] ? [Sequelize.literal(order[areaId - 1])] : [])
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

exports.getAllLocations = async (req, res) => {
    try {
        const subSectionId = req.query.sub_section_id;
        const data = await db.sms.mst_lokasi.findAll({
            attributes: ['id', ['lokasi', 'name']],
            where: {
                ...(subSectionId ? { id_sub_section: subSectionId } : {})
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

exports.getAllCycles = async (req, res) => {
    try {
        const { month, year } = req.query;
        const user = req.user;

        const idAreasFilter = await filterUserMapping(user.employeeCode, 'id_area');

        const data = await db.sms.mst_cycle.findAll({
            attributes: [
                [Sequelize.fn('distinct', Sequelize.col('cycle')), 'cycle']
            ],
            where: {
                [Sequelize.Op.and]: [
                    ...(month && year ? [
                        Sequelize.where(Sequelize.fn('month', Sequelize.col('start_date')), month),
                        Sequelize.where(Sequelize.fn('year', Sequelize.col('start_date')), year)
                    ] : []),
                    ...(idAreasFilter.length > 0 ? [{ area_id: idAreasFilter }] : [])
                ]
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

exports.getAllEmployees = async (req, res) => {
    try {
        const { page, search, user_level } = req.query;

        const data = await db.sms.vw_login.findAll({
            attributes: [
                'lg_nik',
                'lg_name',
                [Sequelize.col('userlevel.userlevelname'), 'user_level_name']
            ],
            include: {
                model: db.sms.userlevels,
                attributes: []
            },
            where: {
                ...(search ? {
                    [Sequelize.Op.or]: [
                        {
                            lg_nik: {
                                [Sequelize.Op.substring]: search
                            }
                        },
                        {
                            lg_name: {
                                [Sequelize.Op.substring]: search
                            }
                        },
                        {
                            '$userlevel.userlevelname$': {
                                [Sequelize.Op.substring]: search
                            }
                        },
                    ],
                } : {}),
                ...(user_level ? { user_level } : {})
            },
            offset: 10 * ((page ?? 1) - 1),
            limit: 10,
        });

        response(req, res, {
            status: 200,
            data,
        });
    } catch (e) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}
