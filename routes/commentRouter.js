const commentRouter = require("express").Router();
const { getCommentsByArticleId } = require("../controllers/comments");
const { postComment } = require("../controllers/postComment");
const { deleteCommentById } = require("../controllers/deleteCommentById");

commentRouter.get("/", getCommentsByArticleId);
commentRouter.post("/", postComment);
commentRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentRouter;
