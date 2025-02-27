module.exports = function (sequelize, DataTypes) {
    const Model = sequelize.define(
        "cycle_note",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            reason_stop: {
                type: DataTypes.STRING,
            },
            start_date: {
                type: DataTypes.DATEONLY,
            },
            end_date: {
                type: DataTypes.DATEONLY,
            },
            area_id: {
                type: DataTypes.INTEGER,
            }
        },
        {
            tableName: "cycle_note",
            timestamps: false
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.mst_area, {
            foreignKey: 'area_id'
        });
    }

    return Model;
} 