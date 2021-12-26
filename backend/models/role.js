const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {}
    
    Role.init({
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roleUser: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roleAdmin: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, 
    {
        sequelize,
        modelName: "Role"
    })
    return Role
}