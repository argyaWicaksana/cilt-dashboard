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
                    model: iot_prod.mst_section,
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
        const data = await iot_prod.mst_lokasi.findAll({
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
                [Op.and]: [
                    ...(month && year ? [
                        where(fn('month', col('start_date')), month),
                        where(fn('year', col('start_date')), year)
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
