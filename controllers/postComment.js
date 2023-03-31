const { insertComment } = require("../models/insertComment");

exports.postComment = (req, res, next) => {
  const { username, body, ...extra } = req.body;
  const { article_id } = req.params;
  insertComment({ username, body }, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
