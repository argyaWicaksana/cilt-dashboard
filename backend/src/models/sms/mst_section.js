module.exports = function (sequelize, DataTypes) {
    const Model = sequelize.define(
        "mst_section",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            section: {
                type: DataTypes.STRING,
            },
            section_sap: {
                type: DataTypes.STRING,
            },
            id_area: {
                type: DataTypes.INTEGER,
            },
            is_active: {
                type: DataTypes.INTEGER,
            },
            last_update: {
                type: DataTypes.STRING,
            },
            update_by: {
                type: DataTypes.STRING,
            }
        },
        {
            tableName: "mst_section",
            timestamps: false
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.mst_area, {
            as: 'area',
            foreignKey: 'id_area'
        });
    };

    return Model;
} 