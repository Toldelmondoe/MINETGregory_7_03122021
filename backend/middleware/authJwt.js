const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;
const Post = db.posts;
const Comment = db.comments;

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
                        console.log("comment created by: "+ comment.userId);
                        if(comment.userId === user.id) {
                            console.log("Current is owner !");
                            next();
                            return;
                        }
                        res.status(401).json({ 
                            message: "Unauthorized" 
                        });
                        return;
                    });
                }
            });
        });
    });
};

const authJwt = {
    verifyPostRight: verifyPostRight,
    verifyCommentRight: verifyCommentRight
};

module.exports = authJwt;