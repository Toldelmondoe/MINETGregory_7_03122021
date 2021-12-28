const db = require("../middleware")
const Post = db.posts
const User = db.users
const Comment = db.comments

createPost = (req, res, next) => {

    console.log("req.body" + req.body.postUrl);
    let imagePost = "";
    if (req.file) { 
        imagePost = `${req.protocol}://${req.get("host")}/images/${req.file.filename}` 
    }
    const post = new Post(
        {
            UserId: req.body.UserId,
            post: req.body.post,
            postUrl: imagePost
        }
    )
    console.log(post)
    post.save()
        .then(() => res.status(201).json({ message: "Publication réussie" }))
        .catch(error => res.status(400).json({ error }))
};

findAllPosts = (req, res, next) => {
    Post.findAll({
        include: { model: User, required: true, attributes: ["username"]}, 
        order: [["id", "DESC"]],
    })    
    .then(posts => {
        const list = posts.map(post => {
            return Object.assign({},
                {
                    id: post.id,
                    createdAt: post.createdAt,
                    post: post.post,
                    postUrl: post.postUrl,
                    UserId: post.UserId,
                    username: post.User.username,
                    isActive: post.User.isActive
                }
            )
        })
        res.status(200).json({ list })
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
            attributes: ["username"] 
        },
        order: [["id", "DESC"]]
    })
    .then(post => {
        onePost.id = post.id,
        onePost.userId = post.UserId,
        onePost.username = post.User.username,
        onePost.createdAt = post.createdAt,
        onePost.post = post.post,
        onePost.postUrl = post.post,
        res.status(200).json(onePost)
    })
    .catch(error => res.status(404).json({ error }))
};

findAllPostsForOne = (req, res, next) => {
    let list = ""
    Post.findAll({ 
        where: { UserId: req.params.id },
    })
    .then((res) => { 
        list = res;
        res.status(200).json( { list } )
    })
    .catch((error) => { res.status(404).json({ error })})
};

deletePost = (req, res, next) => {
    console.log("Processus de suppression des messages")
    console.log("Id message : " + req.query.postId)
    console.log("Id auteur du message : " + req.query.postUid)
    console.log("Id utilisateur qui demande la suppression du message : " + req.query.uid)
    console.log("L'utilisateur qui demande la suppression du message est-il l'auteur du message ou admin ?") + 
    console.log("Si il est l'auteur du message ou admin => suppression du message")
    console.log("S'il n'est ni l'auteur ni admin => suppression impossible")
    console.log(req.query.postUid == req.query.uid || req.query.uid == 1)
    if(req.query.post == req.query.uid || req.query.uid == 1) {
        Comment.destroy({ where: { PostId: req.query.PostId }})
        Post.destroy({ where: { id: req.query.postId }})
        .then((res) => {
                res.status(200).json({ message: "Le message et ses commentaires ont été effacés !" })
        })
        .catch(error => res.status(400).json({ error }))
    } else {
        res.status(401).json({message : "Non autorisé !"})
    };
};

const postController = {
    createPost: createPost,
    findAllPosts: findAllPosts,
    findOnePost: findOnePost,
    findAllPostsForOne: findAllPostsForOne,
    deletePost: deletePost
};

module.exports = postController;