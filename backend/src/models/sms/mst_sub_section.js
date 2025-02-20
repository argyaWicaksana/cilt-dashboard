module.exports = function (sequelize, DataTypes) {
    const Model = sequelize.define(
        "mst_sub_section",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            id_section: {
                type: DataTypes.INTEGER,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
            },
            last_update: {
                type: DataTypes.DATE,
            },
            update_by: {
                type: DataTypes.STRING,
            },
            sub_section: {
                type: DataTypes.STRING,
            }
        },
        {
            tableName: "mst_sub_section",
            timestamps: false
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.mst_section, {
            foreignKey: 'id_section'
        });
    };

    return Model;
} 