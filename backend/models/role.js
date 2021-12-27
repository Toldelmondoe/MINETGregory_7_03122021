const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {}
    
    Role.init({
        roleId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, 
    {
        sequelize,
        modelName: "Role"
    })
    return Role
}