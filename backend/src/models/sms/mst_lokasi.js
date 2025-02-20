module.exports = function (sequelize, DataTypes) {
    const Model = sequelize.define(
        "mst_lokasi",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            id_sub_section: {
                type: DataTypes.INTEGER,
            },
            lokasi: {
                type: DataTypes.STRING,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
            }
        },
        {
            tableName: "mst_lokasi",
            timestamps: false
        }
    );

    Model.associate = function(models) {
        Model.belongsTo(models.mst_sub_section, {
            foreignKey: 'id_sub_section'
        });
    };

    return Model;
} 
