module.exports = function (sequelize, DataTypes) {
    const Model = sequelize.define(
        "mst_mapping_user_area",
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            lg_nik: {
                type: DataTypes.STRING,
            },
            id_area: {
                type: DataTypes.INTEGER,
            },
            id_section: {
                type: DataTypes.INTEGER,
            },
            is_active: {
                type: DataTypes.INTEGER,
            },
        },
        {
            tableName: "mst_mapping_user_area",
            timestamps: false
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.vw_login, {
            foreignKey: 'lg_nik',
        });
    }

    return Model;
}