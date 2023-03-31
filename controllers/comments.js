const { fetchCommentsByArticleId } = require("../models/comments");
const { fetchArticleById } = require("../models/article_id");

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticleById(articleId)
    .then((article) => {
      if (!article) {
        return res.status(404).json({ message: "Not found" });
      }
      fetchCommentsByArticleId(articleId).then((comments) => {
        return res.status(200).json({ comments: comments });
      });
    })
    .catch(next);
};
