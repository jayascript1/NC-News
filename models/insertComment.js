const db = require('../db/connection');

exports.insertComment = ({ username, body}, article_id ) => {
  if (!username || !body) {
    const err = new Error("Bad request");
    err.status = 400;
    throw err;
  }
  return db.query(
    'INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;',
     [username, body, article_id]
  )
    .then((result) => {
      return result.rows[0];
    });
};

