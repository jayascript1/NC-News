const db = require('../db/connection')

exports.fetchArticleById = (articleId) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [articleId])
        .then((result) => {
            const article = result.rows[0]
            if (!article) {
                const error = new Error('Article not found')
                error.statusCode = 404
                throw error
            }
            return article
        })
        .catch((err) => {
            const error = new Error('Could not fetch article')
            error.statusCode = 500
            throw error
        })
}
