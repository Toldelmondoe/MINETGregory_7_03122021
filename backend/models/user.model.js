const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {}
    
    User.init({
        username: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        }
    }, 
    {
        sequelize,
        modelName: "users"
    })
    return User
}