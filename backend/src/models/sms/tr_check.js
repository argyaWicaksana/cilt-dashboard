module.exports = function (sequelize, DataTypes) {
    const Model = sequelize.define(
        "tr_check",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            id_check: {
                type: DataTypes.INTEGER,
            },
            id_cycle: {
                type: DataTypes.INTEGER,
            },
            result: {
                type: DataTypes.ENUM('ok', 'ng'),
            },
            photo: {
                type: DataTypes.STRING,
                allowNull: true
            },
            pic: {
                type: DataTypes.STRING,
            },
            note: {
                type: DataTypes.TEXT,
            },
            date_check: {
                type: DataTypes.DATEONLY,
            },
            executor_2: {
                type: DataTypes.STRING,
            },
            created_at: {
                type: DataTypes.DATE,
            },
            updated_at: {
                type: DataTypes.DATE,
            }
        },
        {
            tableName: "tr_check",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.mst_check, {
            foreignKey: 'id_check'
        });

        Model.belongsTo(models.mst_cycle, {
            foreignKey: 'id_cycle'
        });

        Model.belongsTo(models.vw_login, {
            foreignKey: 'pic'
        });
    };

    return Model;
}