const { fetchArticleById } = require("../models/article_id");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticleById(articleId)
    .then((article) => {
      if (!article) {
        return res.status(404).json({ message: "Not found" });
      }
      article.comment_count = parseInt(article.comment_count); // Parse comment_count as an integer
      return res.status(200).json(article);
    })
    .catch(next);
};
