const { deleteCommentById } = require("../models/deleteCommentById");

exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  deleteCommentById(commentId)
  .then((deletedComment) => {
      if (!deletedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.sendStatus(204)
    })
    .catch(next);
};
