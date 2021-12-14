const db = require("../models")
const Message = db.messages
const User = db.users
const Comment = db.comments

exports.createMessage = (req, res, next) => {

    console.log("req.body" + req.body.messageUrl);
    let imagePost = "";
    if (req.file) { 
        imagePost = `${req.protocol}://${req.get("host")}/images/${req.file.filename}` 
    }
    const message = new Message(
        {
            UserId: req.body.UserId,
            message: req.body.message,
            messageUrl: imagePost
        }
    )
    console.log(message)
    message.save()
        .then(() => res.status(201).json({ message: "Publication réussie" }))
        .catch(error => res.status(400).json({ error }))
};

exports.findAllMessages = (req, res, next) => {
    Message.findAll({
        include: { model: User, required: true, attributes: ["userName"]}, 
        order: [["id", "DESC"]],
    })    
    .then(messages => {
        const list = messages.map(message => {
            return Object.assign({},
                {
                    id: message.id,
                    createdAt: message.createdAt,
                    message: message.message,
                    messageUrl: message.messageUrl,
                    UserId: message.UserId,
                    userName: message.User.userName,
                    isActive: message.User.isActive
                }
            )
        })
        res.status(200).json({ list })
    })
    .catch(error => res.status(400).json({ error }))
}

exports.findOneMessage = (req, res, next) => {
    const oneMessage = {}
    Message.findOne({ 
        where: { id: req.params.id },
        include: {
            model: User,
            required: true,
            attributes: ["userName"] 
        },
        order: [["id", "DESC"]]
    })
    .then(message => {
        oneMessage.id = message.id
        oneMessage.userId = message.UserId
        oneMessage.userName = message.User.userName
        oneMessage.createdAt = message.createdAt
        oneMessage.message = message.message
        oneMessage.messageUrl = message.messageUrl
        res.status(200).json(oneMessage)
    })
    .catch(error => res.status(404).json({ error }))
};

exports.findAllMessagesForOne = (req, res, next) => {
    let list = ""
    Message.findAll({ 
        where: { UserId: req.params.id },
    })
    .then((res) => { 
        list = res;
        res.status(200).json( { list } )
    })
    .catch((error) => { res.status(404).json({ error })})
};

exports.deleteMessage = (req, res, next) => {
    console.log("Processus de suppression des messages")
    console.log("Id message : " + req.query.messageId)
    console.log("Id auteur du message : " + req.query.messageUid)
    console.log("Id utilisateur qui demande la suppression du message : " + req.query.uid)
    console.log("L'utilisateur qui demande la suppression du message est-il l'auteur du message ou admin ?") + 
    console.log("Si il est l'auteur du message ou admin => suppression du message")
    console.log("S'il n'est ni l'auteur ni admin => suppression impossible")
    console.log(req.query.messageUid == req.query.uid || req.query.uid == 1)
    if(req.query.messageUid == req.query.uid || req.query.uid == 1) {
        Comment.destroy({ where: { MessageId: req.query.messageId }})
        Message.destroy({ where: { id: req.query.messageId }})
        .then((res) => {
                res.status(200).json({ message: "Le message et ses commentaires ont été effacés !" })
        })
        .catch(error => res.status(400).json({ error }))
    } else {
        res.status(401).json({message : "Non autorisé !"})
    }
}