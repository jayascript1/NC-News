const db = require("../db/connection");

exports.fetchArticles = () => {
  return db
    .query(
      `
    SELECT articles.article_id, articles.title, articles.body, articles.votes, articles.topic, articles.author, articles.created_at, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
  `
    )
    .then((result) => {
      const articles = result.rows.map((article) => {
        return {
          ...article,
          comment_count: parseInt(article.comment_count),
        };
      });
      return articles;
    });
};
