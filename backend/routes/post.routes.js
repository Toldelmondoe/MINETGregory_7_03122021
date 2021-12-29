const { postController } = require("../controllers/post.controller.js");
const { authJwt } = require("../middleware/authJwt.js");
const multer = require("../middleware/multer-config.js");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Acces-Control-Allow-Headers",
      "x-acces-token, Origin, Content-Type, Accept"
      );
      next();
  });
  app.get("/api/posts", postController.findAllPosts);
  app.get("/api/posts/:id", postController.findOnePost);     
  app.get("/api/posts/all/:id", postController.findAllPostsForOne);
  app.post(
    "/api/posts",
    [authJwt.verifyToken],
    [postController.createPost],
    multer
  );
  app.delete(
    "/api/posts/:id",
    [
      authJwt.verifyToken, 
      authJwt.verifyHaveRight, 
      authJwt.verifyPostRight,
      authJwt.isModerator,
      authJwt.isAdmin
    ],
    [postController.deletePost]
  );
};