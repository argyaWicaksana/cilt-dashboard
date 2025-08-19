const { Sequelize } = require('sequelize');
const { where, fn, col, literal, Op } = Sequelize;
const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const { filterUserMapping } = require('../tools/filterUserMapping');


exports.getAllFinishedCheck = async (req, res) => {
    try {
        const page = req.query.page ?? 1;
        const { area, section, activity, cycle, month_year } = req.query;
        const user = req.user;

        let conditions = [];
        let replacements = {};

        const idSectionsFilter = await filterUserMapping(user.employeeCode);

        if (idSectionsFilter.length > 0) {
            conditions.push('mss.id_section IN(:id_sections)');
            replacements.id_sections = idSectionsFilter;
        }

        if (cycle) {
            conditions.push("SUBSTRING_INDEX(mc2.\`cycle\`, ' ', -1) = :cycle");
            replacements.cycle = cycle;
        }

        if (area) {
            conditions.push("ma.id = :area");
            replacements.area = area;
        }

        if (section) {
            conditions.push("mss.id_section = :section");
            replacements.section = section;
        }

        if (activity) {
            conditions.push("mc.activity LIKE :activity");
            replacements.activity = `%${activity}%`;
        }

        if (month_year) {
            conditions.push("MONTH(mc2.start_date) = :month AND YEAR(mc2.start_date) = :year");
            replacements.month = month_year.split("-")[1];
            replacements.year = month_year.split("-")[0];
        }

        const joinQuery = `
                FROM tr_check tc
                JOIN mst_check mc ON mc.id = tc.id_check
                JOIN mst_lokasi ml ON ml.id = mc.id_location
                JOIN mst_area ma ON ma.id = ml.id_area
                JOIN mst_sub_section mss ON mss.id = ml.id_sub_section
                JOIN mst_cycle mc2 ON mc2.id = tc.id_cycle 
                LEFT JOIN vw_login v ON v.lg_nik = tc.pic
                LEFT JOIN tr_check_postpone tcp ON 
                	(tcp.check_id = tc.id_check AND SUBSTRING_INDEX(mc2.\`cycle\`, ' ', -1) = tcp.\`cycle\`) 
                WHERE tc.\`result\` IS NOT NULL ${(conditions.length > 0 ? "AND " : "") + conditions.join(" AND ")}
            `;

        const query = `
                select tc.id, ma.area, mss.sub_section, ml.lokasi as location,
	                mc.activity, mc.standard, mc2.\`cycle\`, tc.date_check,
	                tc.\`result\`, tc.photo,
	                if(tc.pic = '0000', 'Administrator', v.lg_name) as pic,
	                tc.note, tcp.reason_postpone
                ${joinQuery}
                order by tc.updated_at desc
                limit 10
                offset :offset
            `;

        const count = await sequelizeInstances.sms.query(`select count(*) as count ${joinQuery}`, {
            replacements,
            type: Sequelize.QueryTypes.SELECT
        });

        const rows = await sequelizeInstances.sms.query(query, {
            replacements: {
                ...replacements,
                offset: 10 * (page - 1)
            },
            type: Sequelize.QueryTypes.SELECT
        });

        response(req, res, {
            status: 200,
            data: {
                count: count[0].count,
                rows
            },
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}

exports.getProgressCheck = async (req, res) => {
    try {
        const { monthYear } = req.params;
        const [year, month] = monthYear.split('-');
        const user = req.user;

        const idSectionsFilter = await filterUserMapping(user.employeeCode);

        const data = await db.sms.tr_check.findAll({
            attributes: [
                [fn('count', col('*')), 'total_tasks'],
                [literal('CAST(SUM(IF(result IS NULL, 0, 1)) AS UNSIGNED)'), 'done_tasks'],
            ],
            include: {
                model: db.sms.mst_check,
                attributes: [],
                include: {
                    model: db.sms.mst_lokasi,
                    attributes: [],
                    include: {
                        model: db.sms.mst_sub_section,
                        attributes: []
                    }
                }
            },
            where: {
                [Op.and]: [
                    where(fn('month', col('created_at')), month),
                    where(fn('year', col('created_at')), year),
                    ...(idSectionsFilter.length > 0 ?
                        [where(col('mst_check.mst_lokasi.mst_sub_section.id_section'), { [Op.in]: idSectionsFilter })] : []),
                ]
            },
            raw: true
        });

        response(req, res, {
            status: 200,
            data: data[0],
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}