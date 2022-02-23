const db = require("../models");
const Comment = db.comments;              
const User = db.users;

createComment = (req, res, next) => {
    
    const comment = new Comment(
        {
            UserId: req.body.UserId,
            content: req.body.content,
            PostId: req.body.PostId
        }
    )
    comment.save()
        .then(() => res.status(201).json({ message: "Commentaire ajouté !" }))
        .catch(error => res.status(400).json({ error }))
};
findCommentsByPost = (req, res, next) => {
    Comment.findAll({
        where: {PostId: req.params.id},
        include: { model: User, required: true, attributes: ["username", "avatar", "isActive"]},
        order: [["id", "DESC"]]
    })
        .then(comments => {
            const ListComments = comments.map(comment => {
                return Object.assign({},
                    {
                        id: comment.id,
                        createdAt: comment.createdAt,
                        content: comment.content,
                        userId: comment.UserId,
                        username: comment.User.username,
                        avatar: comment.User.avatar,
                        isActive: comment.User.isActive
                    }
                )
            })
            res.status(200).json({ ListComments })
        })
        .catch(error => res.status(400).json({ error }))
};

findAllComments = (req, res, next) => {
    Comment.findAll({ 
        include: { model: User, required: true, attributes: ["username", "avatar", "isActive"]}, 
        order: [["id", "DESC"]]
    })
    .then(comments => { 
        const ListComments = comments.map(comment => {
            return Object.assign({},
                {
                    id: comment.id,
                    createdAt: comment.createdAt,
                    content: comment.content,
                    userId: comment.UserId,
                    username: comment.User.username,
                    avatar: comment.User.avatar,
                    isActive: comment.User.isActive
                }
            )
        })
        res.status(200).json({ ListComments }) 
    })
    .catch(error => res.status(400).json({ error }))
};

findOneComment = (req, res, next) => {
    const oneComment = {}
    Comment.findOne({ 
        where: { id: req.params.id },
        include: {
            model: User,
            required: true,
            attributes: ["username", "avatar", "isActive"]
        },
        order: [["id", "DESC"]]
    })
    .then(comment => { 
        oneComment.id = comment.id,
        oneComment.userId = comment.UserId,
        oneComment.avatar = comment.User.avatar,
        oneComment.username = comment.User.username,
        oneComment.isActive = comment.User.isActive,
        oneComment.createdAt = comment.createdAt,
        oneComment.content = comment.content,
        oneComment.postUrl = comment.postUrl,
        res.status(200).json(oneComment) 
    })
    .catch(error => res.status(404).json({ error }))
};

findAllCommentsForOne = (req, res, next) => {
    Comment.findAll({ 
        where: { userId: req.params.id },
        include: {
            model: User,
            required: true,
            attributes: ["username", "avatar", "isActive"] 
        },
        order: [["id", "DESC"]]
    })
    .then(comments => { 
        const ListComments = comments.map(comment => {
            return Object.assign({},
                {
                    id: comment.id,
                    createdAt: comment.createdAt,
                    content: comment.content,
                    userId: comment.UserId,
                    username: comment.User.username,
                    avatar: comment.User.avatar,
                    isActive: comment.User.isActive
                }
            )
        })
        res.status(200).json({ ListComments })
    })
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
    findAllComments: findAllComments,
    findOneComment: findOneComment,
    findAllCommentsForOne: findAllCommentsForOne,
    deleteComment: deleteComment,
    findCommentsByPost: findCommentsByPost,
    modifyComment: modifyComment
};

module.exports = commentController;