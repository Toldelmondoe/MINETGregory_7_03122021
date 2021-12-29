const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Post extends Model {}
    
    Post.init({
        postId: {
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
        modelName: "posts"
    })
    return Post
}