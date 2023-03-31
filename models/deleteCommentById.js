const db = require('../db/connection');

exports.deleteCommentById = (commentId) => {
  return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [commentId])
    .then((result) => {
      return result.rows
    })
}