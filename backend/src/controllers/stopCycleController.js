const { Sequelize } = require('sequelize');
const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");

exports.getAllCycleNote = async (req, res) => {
    try {
        const page = req.query.page ?? 1;
        const areaId = req.query.area_id;

        const { rows, count } = await db.sms.cycle_note.findAndCountAll({
            attributes: [
                'id',
                [Sequelize.col('mst_area.area'), 'area'],
                'start_date',
                'end_date',
                'reason_stop'
            ],
            include: {
                model: db.sms.mst_area,
                attributes: [],
                where: {
                    ...(areaId ? { id: areaId } : {})
                }
            },
            offset: 10 * (page - 1),
            limit: 10,
            order: [['id', 'desc']]
        });

        response(req, res, {
            status: 200,
            data: {
                count,
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

exports.createCycleNote = async (req, res) => {
    try {
        const {
            start_date,
            end_date,
            reason_stop,
            area
        } = req.body;

        const data = await db.sms.cycle_note.create({
            start_date,
            end_date,
            reason_stop,
            area_id: area
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

exports.updateCycleNote = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            start_date,
            end_date,
            reason_stop,
            area
        } = req.body;

        const data = await db.sms.cycle_note.findByPk(id);
        if (!data) {
            response(req, res, {
                status: 404,
                data: 'Data not found',
            });
        } else {
            await data.update({
                start_date,
                end_date,
                reason_stop,
                area_id: area
            });
        }

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

exports.deleteCycleNote = async (req, res) => {
    try {
        const data = await db.sms.cycle_note.findByPk(req.params.id);
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
}