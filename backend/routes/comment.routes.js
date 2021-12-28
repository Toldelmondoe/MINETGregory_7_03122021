const { commentController } = require("../controllers/comment.controller");
const { authJwt } = require("../middleware");

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
    commentController.createComment
  );

  app.delete(
    "/api/comments/:id",
    [
      authJwt.verifyToken, 
      authJwt.verifyHaveRight, 
      authJwt.verifyCommentRight
    ],
    commentController.deleteComment
  );
};