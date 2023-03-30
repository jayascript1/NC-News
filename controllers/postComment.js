const { insertComment } = require("../models/insertComment");
const { fetchArticleById } = require("../models/article_id");

exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const article_id = req.params.article_id;
  fetchArticleById(article_id)
    .then((article) => {
      if (!article) {
        const err = new Error("Not found");
        err.status = 404;
        throw err;
      }
    })
    .then(() => {
      insertComment({ username, body }, article_id).then((comment) => {
        res.status(201).send({
          comment,
        });
      });
    })

    .catch(next);
};
