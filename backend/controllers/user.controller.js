const db = require("../models")
const User = db.users
const Role = db.roles
const Post = db.posts
const Comment = db.comments

exports.findOneUser = (req, res, next) => {
    const userInfo = {}
    User.findOne(
        {
            where: { id: req.params.id },
            include: [{
                model: Role,
                required: true
            }]
        })
    .then(user => {
        userInfo.username = user.username
        userInfo.email = user.email;
        for(i = 0; i< user.Roles.length; i++){
            userInfo.roles = user.Roles[i].name;
        }
        userInfo.createdAt = user.createdAt
        userInfo.avatar = user.avatar
    })
    .then(() => {
        Comment.count({ where: { userId: req.params.id }})
        .then(cmtcount => { 
            userInfo.commentsCount = cmtcount 
        })
    })
    .then(() => {
        Post.count({ where: { userId: req.params.id }})
        .then(pstcount => { 
            userInfo.postsCount = pstcount 
            res.status(200).json(userInfo)
        })
    })  
    .catch(error => res.status(404).json({ error }))
};

exports.modifyUser = (req, res, next) => {
    const userObject = req.file ?
        {
            ...req.body.userId,
            avatar: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : { ... req.body}
    User.update({ ...userObject, id:  req.params.id}, { where: { id: req.params.id }})
      .then(() => res.status(200).json({ ...userObject }))
      .catch(error => res.status(400).json({ error }))
};

exports.deleteUser = (req, res, next) => {
    User.destroy({ where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: "Utilisateur supprimé !" }))
        .catch(error => res.status(400).json({ error }))
};

exports.AllAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};

