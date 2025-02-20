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
            sub_section_id: {
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
            }
        },
        {
            tableName: "mst_cycle",
            timestamps: false
        }
    );

    return Model;
}