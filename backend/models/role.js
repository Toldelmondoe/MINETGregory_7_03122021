const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {}
    
    Role.init({
        user: {
            type: DataTypes.STRING,
            allowNull: false
        },
        admin: {
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