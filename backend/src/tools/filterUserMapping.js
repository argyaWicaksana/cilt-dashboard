const { db, sequelizeInstances } = require("../../config/sequelize");

exports.filterUserMapping = async (employeeCode, column = 'id_section') => {
    let userMapping = null;

    if (employeeCode != '0000') {
        userMapping = await db.sms.mst_mapping_user_area.findAll({
            attributes: [column],
            where: {
                lg_nik: employeeCode,
                is_active: 1
            }
        });
    } else {
        userMapping = 'all';
    }

    if (!userMapping) {
        throw Error('Cant find employee!');
    }

    return userMapping === 'all' ? [] : userMapping.map(um => um[column]);
}