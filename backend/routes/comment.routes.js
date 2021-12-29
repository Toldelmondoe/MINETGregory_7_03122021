const { commentController } = require("../controllers/comment.controller.js");
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
  app.get("/api/comments", commentController.findAllComments);
  app.get("/api/comments/:id", commentController.findOneComment);
  app.post(
    "/api/comments",
    [authJwt.verifyToken],
    [commentController.createComment],
    multer
  );
  app.delete(
    "/api/comments/:id",
    [
      authJwt.verifyToken, 
      authJwt.verifyHaveRight, 
      authJwt.verifyCommentRight,
      authJwt.isModerator,
      authJwt.isAdmin
    ],
    [commentController.deleteComment]
  );
};