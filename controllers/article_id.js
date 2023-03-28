const db = require('../db/connection')
const { fetchArticleById } = require('../models/article_id')

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleById(article_id)
        .then((article) => {
            res.status(200).send({
                author: article.author,
                title: article.title,
                article_id: article.article_id,
                body: article.body,
                topic: article.topic,
                created_at: article.created_at,
                votes: article.votes,
                article_img_url: article.article_img_url
            })
        })
        .catch((err) => {
            next(err)
        })
}
