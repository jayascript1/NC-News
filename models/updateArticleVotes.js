const db = require("../db/connection");

exports.updateArticleVotes = (articleId, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, articleId]
    )
    .then((result) => {
      delete result.rows[0].article_id
      return result.rows[0];
    });
};
