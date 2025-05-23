module.exports = function (sequelize, DataTypes) {
    const Model = sequelize.define(
        "table_user",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            lg_nik: {
                type: DataTypes.STRING,
            },
            user_level: {
                type: DataTypes.INTEGER,
            },
        },
        {
            tableName: "mst_sub_section",
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.mst_section, {
            foreignKey: 'id_section'
        });
    };

    return Model;
} 
