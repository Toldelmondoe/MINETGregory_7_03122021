const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {}
    
    User.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "http://localhost:3000/images/default_user.jpg"
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, 
    {
        sequelize,
        modelName: "User"
    })
    return User
}