const { db, sequelizeInstances } = require("../../config/sequelize");

exports.filterUserMapping = async (employeeCode) => {
    let userMapping = null;

    if (employeeCode != '0000') {
        userMapping = await db.sms.mst_mapping_user_area.findAll({
            attributes: ['id_section'],
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

    return userMapping === 'all' ? [] : userMapping.map(um => um.id_section);
}