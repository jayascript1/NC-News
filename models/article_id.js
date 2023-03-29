const db = require("../db/connection");

exports.fetchArticleById = (articleId) => {
  return db.query({
    text: "SELECT * FROM articles WHERE article_id = $1",
    values: [articleId],
  }).then((result) => {
    return result.rows[0];
  })
};
