module.exports = function (sequelize, DataTypes) {
    const Model = sequelize.define(
        "userlevels",
        {
            userlevelid: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            userlevelname: {
                type: DataTypes.STRING,
            },
        },
        {
            tableName: "userlevels",
            timestamps: false
        }
    );

    return Model;
} 