const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {}
    
    Comment.init({
        comment: {
            type: DataTypes.TEXT
        },
        commentUrl: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: "Comment"
    })
    return Comment
}