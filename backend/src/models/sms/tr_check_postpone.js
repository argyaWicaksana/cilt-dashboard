module.exports = function (sequelize, DataTypes) {
    const Model = sequelize.define(
        "tr_check_postpone",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            cycle: {
                type: DataTypes.INTEGER,
            },
            id_check: {
                type: DataTypes.INTEGER,
            },
            reason_postpone: {
                type: DataTypes.STRING,
            },
        },
        {
            tableName: "tr_check_postpone",
            timestamps: false
        }
    );

    return Model;
} 