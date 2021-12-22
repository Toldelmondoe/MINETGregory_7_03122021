const jwt = require('jsonwebtoken');
// middleware qui protégera les routes sélectionnées et vérifier que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // récupération du token de la requête entrante dans le headers
        const decodedToken = jwt.verify(token, 'TKN_SECRET'); // vérification du token
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

module.exports = (req, res, next) => {
    const Message = db.messages
    const Comment = db.comments
    if(req.query.messageUid == req.query.uid || req.query.uid == 1) {
        Comment.destroy({ where: { MessageId: req.query.messageId }})
        Message.destroy({ where: { id: req.query.messageId }})
        .then((res) => {
            res.status(200).json({ message: "Le message et ses commentaires ont été effacés !" })
        })
        .catch(error => res.status(403).json({ error }))
    } else {
        res.status(401).json({ message : "Non autorisé !" })
    }
};

module.exports = (req, res, next) => {
    const Comment = db.comments
    if(req.query.commentUid == req.query.uid || req.query.uid == 1) {
        Comment.destroy({ where: { MessageId: req.query.messageId }})
        .then((res) => {
            res.status(200).json({ message: "Le commentaire a été effacé !" })
        })
        .catch(error => res.status(403).json({ error }))
    } else {
        res.status(401).json({ message : "Non autorisé !" })
    }
};

module.exports = (req, res, next) => {
    const User = db.users
    const Message = db.messages
    const Comment = db.comments
    if(req.query.UserId) {
        Comment.destroy({ where: { UserId: req.params.id }})
        Message.destroy({ where: { UserId: req.params.id }})
        User.destroy({ where: { id: req.params.id }}) 
        .then( () => res.status(200).json({ message: "Compte supprimé !" })
        )
        .catch(error => res.status(403).json({ error }))
    } else {
        res.status(401).json({ message : "Non autorisé !" })
    }
};

module.exports = (req, res, next) => {
    const User = db.users
    const Message = db.messages
    const Comment = db.comments
    if(req.query.isAdmin) {
        User.destroy({ where: { id: req.query.uid}})
        Message.destroy({ where: { UserId: req.query.uid }})
        Comment.destroy({ where: { UserId: req.query.uid }})
        .then((res) => {
            res.status(200).json({ message: "Compte supprimé !" })
        })
        .catch(error => res.status(403).json({ error }))
    } else {
        res.status(401).json({ message : "Non autorisé !" })
    }
};