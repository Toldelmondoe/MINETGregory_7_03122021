const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {}
    
    Comment.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        content: {
            type: DataTypes.TEXT,
            required: true
        },
        commentUrl: {
            type: DataTypes.STRING
        }
    }, 
    {
        sequelize,
        modelName: "Comment"
    })
    return Comment
}










