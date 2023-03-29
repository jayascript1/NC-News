const { fetchArticleById } = require("../models/article_id");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  if (isNaN(articleId)) {
    return res.status(400).json({ message: "Invalid article ID" });
  }
  fetchArticleById(articleId)
    .then((article) => {
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      return res.status(200).json(article);
    })
    .catch((err) => {
      next(err);
    });
};
