const db = require('../db/connection');
const check = require('../db/data/test-data/index')

exports.insertComment = ({ username, body }, article_id) => {
  // if (!username || !body) {
  //   return Promise.reject(Object.assign(new Error('Bad request'), { status: 400 }));
  // }
  return db.query(
    'INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;',
    [username, body, article_id]
    )
    .then((result) => {
      return result.rows[0];
        });
    }
