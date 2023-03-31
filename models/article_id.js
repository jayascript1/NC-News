const db = require("../db/connection");

exports.fetchArticleById = (articleId) => {
  return db.query(`
    SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
  `, [articleId]).then((result) => {
    return result.rows[0];
  });
};
