module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("roles", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        post: {
            type: Sequelize.TEXT
        },
        comment: {
            type: Sequelize.TEXT
        }
    });

    return Role;
};