module.exports = function (sequelize, DataTypes) {
    const Model = sequelize.define(
        "mst_area",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            area: {
                type: DataTypes.STRING,
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
            tableName: "mst_area",
            timestamps: false
        }
    );
    return Model;
}