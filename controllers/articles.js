const { fetchArticles } = require('../models/articles')

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles })
    })
    .catch(next)
}
