module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comments", {
        comment: {
            type: Sequelize.TEXT
        },
        commentUrl: {
            type: Sequelize.STRING
        }
    });

    return Comment;
};










