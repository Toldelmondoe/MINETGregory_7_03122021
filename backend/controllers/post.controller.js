const db = require("../models");
const Post = db.posts;
const User = db.users;

createPost = (req, res, next) => {

    console.log("req.body" + req.body.postUrl);
    let varImage = "";
    if (req.file) { 
        varImage = `${req.protocol}://${req.get("host")}/images/${req.file.filename}` 
    }
    const post = new Post(
        {
            UserId: req.body.UserId,
            post: req.body.post,
            postUrl: varImage
        }
    )
    console.log(post)
    post.save()
        .then(() => res.status(201).json({ message: "Publication réussie" }))
        .catch(error => res.status(400).json({ error }))
};

findAllPosts = (req, res, next) => {
    Post.findAll({
        include: { model: User, required: true, attributes: ["username", "avatar", "isActive"]}, 
        order: [["id", "DESC"]],
    })    
    .then(posts => {
        const listPosts = posts.map(post => {
            return Object.assign({},
                {
                    id: post.id,
                    createdAt: post.createdAt,
                    post: post.post,
                    postUrl: post.postUrl,
                    UserId: post.UserId,
                    username: post.User.username,
                    avatar: post.User.avatar,
                    isActive: post.User.isActive
                }
            )
        })
        res.status(200).json({ listPosts })
    })
    .catch(error => res.status(400).json({ error }))
};

findOnePost = (req, res, next) => {
    const onePost = {}
    Post.findOne({ 
        where: { id: req.params.id },
        include: {
            model: User,
            required: true,
            attributes: ["username", "avatar", "isActive"] 
        },
        order: [["id", "DESC"]]
    })
    .then(post => {
        onePost.id = post.id,
        onePost.userId = post.UserId,
        onePost.avatar = post.User.avatar,
        onePost.username = post.User.username,
        onePost.isActive = post.User.isActive,
        onePost.createdAt = post.createdAt,
        onePost.post = post.post,
        onePost.postUrl = post.postUrl,
        res.status(200).json(onePost)
    })
    .catch(error => res.status(404).json({ error }))
};

findAllPostsForOne = (req, res, next) => {
    Post.findAll({ 
        where: { UserId: req.params.id },
        include: {
            model: User,
            required: true,
            attributes: ["username", "avatar", "isActive"] 
        },
        order: [["id", "DESC"]]
    })
    .then(posts => { 
        const ListPosts = posts.map(post => {
            return Object.assign({},
                {
                    id: post.id,
                    createdAt: post.createdAt,
                    post: post.post,
                    postUrl: post.postUrl,
                    UserId: post.UserId,
                    username: post.User.username,
                    avatar: post.User.avatar,
                    isActive: post.User.isActive
                }
            )
        })
        res.status(200).json({ ListPosts })
    })
    .catch(error => res.status(400).json({ error }))
};

deletePost = (req, res, next) => {
    Post.destroy({ where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: "Message supprimé !" }))
        .catch(error => res.status(400).json({ error }))
};

modifyPost = (req, res, next) => {
    const postObject = req.file ?
      {
        ...req.body.post,
        postUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      } : { ... req.body}

    Post.update({ ...postObject, id:  req.params.id}, { where: { id: req.params.id }})
    .then(() => res.status(200).json({ message: "Message modifié !" }))
    .catch(error => res.status(400).json({ error }))
};

const postController = {
    createPost: createPost,
    findAllPosts: findAllPosts,
    findOnePost: findOnePost,
    findAllPostsForOne: findAllPostsForOne,
    deletePost: deletePost,
    modifyPost: modifyPost
};

module.exports = postController;