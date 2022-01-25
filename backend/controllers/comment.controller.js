const db = require("../models");
const Comment = db.comment;              
const User = db.user;

createComment = (req, res, next) => {
    const comment = new Comment(
        {
            UserId: req.body.UserId,
            PostId: req.body.PostId,
            comment: req.body.comment
        }
    )
    comment.save()
    .then(() => res.status(201).json({ message: "Commentaire ajouté !" }))
    .catch(error => res.status(400).json({ error }))
};

findOneComment = (req, res, next) => {
    Comment.findOne({ 
        where: { 
            id: req.params.id 
        },
        include: {
            model: User,
            required: true,
            attributes: ["username"]
        }
    })
    .then(comment => { res.status(200).json(comment) })
    .catch(error => res.status(404).json({ error }))
};

findAllComments = (req, res, next) => {
    Comment.findAll({ 
        where: { 
            PostId: req.params.id 
        },
        include: {
            model: User,
            required: true,
            attributes: ["username", "avatar", "isActive"]
        }, 
        order: [["id", "DESC"]]
    })
    .then(comments => { res.status(200).json(comments) })
    .catch(error => res.status(400).json({ error }))
};

deleteComment = (req, res, next) => {
    Comment.destroy({ where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: "Commentaire supprimé !" }))
        .catch(error => res.status(400).json({ error }))
};

modifyComment = (req, res, next) => { 
    Comment.update({ ...req.body }, { where: { id: req.params.id }})
    .then(() => res.status(200).json({ message: "Commentaire modifié !" }))
    .catch(error => res.status(400).json({ error }))
};

const commentController = {
    createComment: createComment,
    findOneComment: findOneComment,
    findAllComments: findAllComments,
    deleteComment: deleteComment,
    modifyComment: modifyComment
};

module.exports = commentController;