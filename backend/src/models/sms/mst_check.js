module.exports = function (sequelize, DataTypes) {
    const Model = sequelize.define(
        "mst_check",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            id_location: {
                type: DataTypes.INTEGER,
            },
            activity: {
                type: DataTypes.TEXT,
            },
            total_cycle: {
                type: DataTypes.INTEGER,
            },
            current_week: {
                type: DataTypes.INTEGER,
            },
            interval_time: {
                type: DataTypes.INTEGER,
            },
            machine_status: {
                type: DataTypes.BOOLEAN,
            },
            standard: {
                type: DataTypes.TEXT,
            }
        },
        {
            tableName: "mst_check",
            timestamps: false
        }
    );

    Model.associate = function(models) {
        Model.belongsTo(models.mst_lokasi, {
            foreignKey: 'id_location'
        });

        Model.hasMany(models.tr_check_postpone, {
            foreignKey: 'check_id',
            sourceKey: 'id'
        });
    };

    return Model;
} 
