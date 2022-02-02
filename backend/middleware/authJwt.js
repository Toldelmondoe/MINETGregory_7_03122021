const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;
const Post = db.posts;
const Comment = db.comments;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if(!token) {
        return res.status(403).send({
            message: "No token provided !"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized !"
            });
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Require Admin Role !"
            });
            return;
        });
    });
};

isModerator = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Require Moderator Role !"
            });
            return;
        });
    });
};

isModeratorOrAdmin = (res, req, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    next();
                    return;
                }

                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Require Moderator or Admin Role !"
            });
            return;
        });
    });
};

verifyHaveRight = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ 
            message: "No token provided !" 
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                message: "Unauthorized !" 
            });
        }
        req.id = decoded.id;
        User.findByPk(req.id).then((user) => {
            user.getRoles().then((roles) => {
                for (let i = 0; i < roles.length; i++) {
                    console.log(roles[i].name);
                    if (roles[i].name === "admin") {
                        console.log("Current is admin !");
                        next ();
                        return;
                    }
                    if (roles[i].name === "moderator") {
                        console.log("Current is moderator !");
                        next();
                        return;
                    }
                }
                if (req.params.id && req.params.id == user.id) {
                    console.log("Current is owner !");
                    next ();
                    return;
                }

                res.status(401).json({ 
                    message: "Unauthorized !" 
                });
                return;
            });
        });
    });
};

verifyPostRight = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json({ 
            message: "No token provided !" 
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                message: "Unauthorized !" 
            });
        }
        req.id = decoded.id;
        User.findByPk(decoded.id).then((user) => {
            user.getRoles().then((roles) => {
                for (let i = 0; i < roles.length; i++) {
                    console.log(roles[i].name);
                    if (roles[i].name === "admin") {
                        console.log("Current is admin !");
                        next ();
                        return;
                    }
                    if (roles[i].name === "moderator") {
                        console.log("Current is moderator !");
                        next ();
                        return;
                    }
                    Post.findByPk(req.params.id).then((post) => {
                    console.log("post created by: "+ post.userId);
                        if(post.userId === user.id) {
                            console.log("Current is owner !");
                            next();
                            return;
                        }
                        res.status(401).json({ 
                            message: "Unauthorized !" 
                        });
                        return;       
                    });
                }
            });
        });
    });
};

verifyCommentRight = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json({ message: "No token provided !" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized !" });
        }
        console.log(decoded);
        console.log(req.id);
        req.id = decoded.id;
        User.findByPk(decoded.id).then((user) => {
            user.getRoles().then((roles) => {
                for (let i = 0; i < roles.length; i++) {
                    console.log(roles[i].name);
                    if (roles[i].name === "admin") {
                        console.log("Current is admin !");
                        next ();
                        return;
                    }
                    if (roles[i].name === "moderator") {
                        console.log("Current is moderator !");
                        next ();
                        return;
                    }
                    Comment.findByPk(req.params.id).then((comment) => {
                        console.log(req.params.id);
                        comment.getRoles().then((roles) => {
                            if(user.id === decoded.id) {
                                console.log("Current is owner !");
                                next();
                                return;
                            }
                            res.status(401).json({ 
                                message: "Unauthorized" 
                            });
                            return;
                        });    
                    });
                }
            });
        });
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin,
    verifyHaveRight: verifyHaveRight,
    verifyPostRight: verifyPostRight,
    verifyCommentRight: verifyCommentRight
};

module.exports = authJwt;