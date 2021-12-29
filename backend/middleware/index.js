const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const commentController = require("../controllers/comment.controller.js");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.post = require("../models/post.model.js")(sequelize, Sequelize);
db.comment = require("../models/comment.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.post.belongsToMany(db.comment, {
    through: "user_posts",
    foreignKey: "postId",
    otherKey:"commentId"
});

db.user.belongsToMany(db.post, {
    through: "user_posts",
    foreignKey: "userId",
    otherKey: "postId"
});

db.user.belongsToMany(db.comment, {
    through: "user_comments",
    foreignKey: "userId",
    otherKey: "commentId"
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;