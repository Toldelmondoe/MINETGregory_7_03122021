const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
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

db.users = require("../models/user.model.js")(sequelize, Sequelize);
db.roles = require("../models/role.model.js")(sequelize, Sequelize);
db.posts = require("../models/post.model.js")(sequelize, Sequelize);
db.comments = require("../models/comment.model.js")(sequelize, Sequelize);

db.roles.belongsToMany(db.users, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.users.belongsToMany(db.roles, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.posts.hasMany(db.comments);
db.comments.belongsTo(db.posts);

db.users.hasMany(db.posts);
db.posts.belongsTo(db.users);

db.users.hasMany(db.comments);
db.comments.belongsTo(db.users);

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;