const { Sequelize } = require('sequelize');
const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");

exports.getAllTableUser = async (req, res) => {
    try {
        const { page, search } = req.params;

        const data = await db.sms.table_user.findAndCountAll({
            offset: 10 * (page - 1),
            limit: 10,
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

exports.createTableUser = async (req, res) => {
    try {
        const {
            lg_nik,
            user_level
        } = req.body;

        const data = await db.sms.table_user.create({
            lg_nik,
            user_level
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

exports.updateTableUser = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            lg_nik,
            user_level
        } = req.body;

        const data = await db.sms.table_user.findByPk(id);
        if (!data) {
            response(req, res, {
                status: 404,
                data: 'Data not found',
            });
        } else {
            await data.update({
                lg_nik,
                user_level
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

exports.deleteTableUser = async (req, res) => {
    try {
        const data = await db.sms.table_user.findByPk(req.params.id);
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