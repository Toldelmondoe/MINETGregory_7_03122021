const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Message = require('../models/message');
const Comment = require('../models/comment');
// middleware qui protégera les routes sélectionnées et vérifier que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes
verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // récupération du token de la requête entrante dans le headers
        const decodedToken = jwt.verify(token, process.env.TKN_SECRET); // vérification du token
        const userId = decodedToken.userId; // récupération de l'id du token
        if (req.body.userId && req.body.userId !== userId) { // le userId de la requête et celui du token sont comparés
            throw 'User ID non valable !'; // si les userId sont différents alors User ID non valable
        } else { // si les userId sont identiques alors on peut passer à la suite
            console.log('authentification réussie !');
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    }
};

verifyHaveRight = (req, res, next) => {
    let token = req.headers[process.env.TKN_SECRET];
    if (!token) {
        return res.status(403).json({ message: "Le token ne correspond pas !" });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Non autorisé !" });
        }
        req.id = decoded.id;
        User.findByPk(req.id).then((user) => {
            user.getRoles().then((roles) => {
                for (let i = 0; i < roles.length; i++) {
                    console.log(roles[i].name);
                    if (roles[i].name === "admin") {
                        console.log("l'utilisateur est admin !");
                    return next ();
                    }
                }
                if (req.params.id && req.params.id == user.id) {
                    console.log("l'utilisateur est propiétaire !");
                return next ();
                }
                return res.status(401).json({ message: "non autorisé !" });
            });
        });
    });
};

verifyMessageRight = (req, res, next) => {
    let token = req.headers[process.env.TKN_SECRET];
    if (!token) {
        return res.status(403).json({ message: "Le token ne correspond pas !" });
    }
    jwt.verify(token, process.env.TKN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Non autorisé !" });
        }
        console.log(decoded);
        console.log(req.id);
        req.id = decoded.id;
        User.findByPk(decoded.id).then((user) => {
            user.get.roles().then((roles) => {
                for (let i = 0; i < roles.length; i++) {
                    console.log(roles[i].name);
                    if (roles[i].name === "admin") {
                        console.log("l'utilisateur est admin !");
                        return next ();
                    }
                    Message.findByPk(req.params.id).then((message) => {
                        console.log(req.params.id);
                        message.get.roles().then((roles) => {
                            if(user.id === decoded.id) {
                                console.log("l'utilisateur est propriétaire !");
                                return next();
                            }
                            return res.status(401).json({ message: "non autorisé !" });
                        });    
                    });
                }
            });
        });
    });
};

verifyCommentRight = (req, res, next) => {
    let token = req.headers[process.env.TKN_SECRET];
    if (!token) {
        return res.status(403).json({ message: "Le token ne correspond pas !" });
    }
    jwt.verify(token, process.env.TKN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Non autorisé !" });
        }
        console.log(decoded);
        console.log(req.id);
        req.id = decoded.id;
        User.findByPk(decoded.id).then((user) => {
            user.get.roles().then((roles) => {
                for (let i = 0; i < roles.length; i++) {
                    console.log(roles[i].name);
                    if (roles[i].name === "admin") {
                        console.log("l'utilisateur est admin !");
                        return next ();
                    }
                    Comment.findByPk(req.params.id).then((comment) => {
                        console.log(req.params.id);
                        comment.get.roles().then((roles) => {
                            if(user.id === decoded.id) {
                                console.log("l'utilisateur est propriétaire !");
                                return next();
                            }
                            return res.status(401).json({ message: "non autorisé !" });
                        });    
                    });
                }
            });
        });
    });
};

isAdmin = (req, res, next) => {
    let token = req.headers[process.env.TKN_SECRET];
    if (!token) {
        return res.status(403).json({ message: "Le token ne correspond pas !" });
    }
    jwt.verify(token, process.env.TKN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Non autorisé !" });
        }
        req.id = decoded.id;
        User.findByPk(req.id).then((user) => {
            user.getRoles().then((roles) => {
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                        next();
                        return;
                    }
                }
                res.status(403).json({ message: "Vous n'êtes pas administrateur !" });
                return;
            });
        });
    });    
};

const auth = {
    verifyToken: verifyToken,
    verifyHaveRight: verifyHaveRight,
    verifyMessageRight: verifyMessageRight,
    verifyCommentRight: verifyCommentRight,
    isAdmin: isAdmin,
};

module.exports = auth