const { fetchArticleById } = require("../models/article_id");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  if (isNaN(articleId)) {
    const err = new Error('Invalid article ID')
    err.status = 400
    throw err
    console.log('here')
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
