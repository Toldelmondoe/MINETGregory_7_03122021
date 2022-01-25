const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {}
    
    Role.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING
        }
    }, 
    {
        sequelize,
        modelName: "Role"
    })
    return Role
}