const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Post extends Model {}
    
    Post.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        content: {
            type: DataTypes.TEXT
        },
        postUrl: {
            type: DataTypes.STRING
        }
    }, 
    {
        sequelize,
        modelName: "Post"
    })
    return Post
}