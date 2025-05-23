module.exports = function (sequelize, DataTypes) {
    const Model = sequelize.define(
        "mst_cycle",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            cycle: {
                type: DataTypes.STRING,
            },
            area_id: {
                type: DataTypes.INTEGER,
            },
            prodidentity_id: {
                type: DataTypes.INTEGER,
            },
            start_date: {
                type: DataTypes.DATE,
            },
            end_date: {
                type: DataTypes.DATE,
            },
            reason_stop: {
                type: DataTypes.STRING,
            },
        },
        {
            tableName: "mst_cycle",
            timestamps: false
        }
    );

    Model.associate = function (models) {
        Model.hasMany(models.tr_check, {
            foreignKey: 'id_cycle'
        });

    };

    return Model;
}