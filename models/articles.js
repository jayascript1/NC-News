const db = require("../db/connection");

exports.fetchArticles = ({ topic, sort_by = "created_at", order = "desc" } = {}) => {
  let query = `
    SELECT articles.article_id, articles.title, articles.body, articles.votes, articles.topic, articles.author, articles.created_at, articles.article_img_url
    FROM articles
    `;
  const params = [];

  if (topic) {
    query += `WHERE articles.topic = $1 `;
    params.push(topic);
  }

  query += `
    ORDER BY ${sort_by} ${order}
  `;

  return db.query(query, params).then((result) => {
    return result.rows;
  });
};
