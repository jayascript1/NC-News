const { fetchCommentsByArticleId } = require('../models/comments');

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  if (isNaN(articleId)) {
    return res.status(400).json({ message: 'Invalid article ID' });
  }
  fetchCommentsByArticleId(articleId)
    .then((comment) => {
      if (comment.length === 0) {
        return res.status(404).send({ message: 'Article not found'})
      }
      return res.status(200).json(comment);
    })
    .catch(next)
}
