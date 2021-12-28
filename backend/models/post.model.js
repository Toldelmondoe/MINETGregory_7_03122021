module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("posts", {
        post: {
            type: Sequelize.TEXT,
        },
        postUrl: {
            type: Sequelize.STRING
        }

    });

    return Post;
};