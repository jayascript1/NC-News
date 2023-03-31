const { fetchCommentsByArticleId } = require("../models/comments");
const { fetchArticleById } = require("../models/article_id");

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  if (isNaN(articleId)) {
    const err = new Error("Bad request");
    err.status = 400;
    throw err;
  }
  fetchArticleById(articleId)
    .then((article) => {
      if (!article) {
        const err = new Error("Not found");
        err.status = 404;
        throw err;
      }
      fetchCommentsByArticleId(articleId).then((comments) => {
        return res.status(200).json({ comments: comments });
      });
    })
    .catch(next);
};
