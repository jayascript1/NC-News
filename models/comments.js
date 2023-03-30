const db = require('../db/connection');

exports.fetchCommentsByArticleId = (articleId) => {
  return db.query({
    text: `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
    values: [articleId]
  })
    .then((result) => {
      return result.rows;
    })
}

