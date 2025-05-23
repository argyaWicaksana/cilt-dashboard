module.exports = function (sequelize, DataTypes) {
    const Model = sequelize.define(
        "vw_login",
        {
            lg_nik: {
                primaryKey: true,
                type: DataTypes.STRING,
            },
            lg_name: {
                type: DataTypes.STRING,
            },
            user_level: {
                type: DataTypes.INTEGER,
            },
        },
        {
            tableName: "vw_login",
            timestamps: false
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.userlevels, {
            foreignKey: 'user_level'
        });
    }
    
    return Model;

}
