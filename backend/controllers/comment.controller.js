const db = require("../models");
const Comment = db.comments;              
const User = db.users;

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
    Comment.findAll({ 
        where: { 
            PostId: req.params.Postid 
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
    Comment.findAll()
    .then(comments => { res.status(200).json(comments) })
    .catch(error => res.status(400).json({ error }))
};

deleteComment = (req, res, next) => {
    console.log("Processus de suppression des commentaires")
    console.log("Id commentaire : " + req.query.commentId)
    console.log("Id auteur du commentaire : " + req.query.commentUid)
    console.log("Id utilisateur qui demande la suppression du commentaire : " + req.query.currentUid)
    console.log("L'utilisateur qui demande la suppression du commentaire est-il l'auteur du message ou admin ?") + 
    console.log("Si il est l'auteur du commentaire ou admin => suppression du commentaire")
    console.log("S'il n'est ni l'auteur ni admin => suppression impossible")
    
  Comment.destroy({ where: { id: req.query.commentId }})
        .then(() => res.status(200).json({ message: "Commentaire supprimé !" }))
        .catch(error => res.status(400).json({ error }))
};

const commentController = {
    createComment: createComment,
    findOneComment: findOneComment,
    findAllComments: findAllComments,
    deleteComment: deleteComment
};

module.exports = commentController;