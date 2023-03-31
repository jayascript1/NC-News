const db = require("../db/connection");
const { fetchTopics } = require("./topics");


exports.fetchArticles = ({ topic, sort_by = "created_at", order = "desc" } = {}) => {
  const allowedSortByColumns = ["created_at", "votes", "title", "author", "topic"];
  const allowedOrderValues = ["asc", "desc"];

  if (!allowedSortByColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Invalid sort_by query" });
  }

  if (!allowedOrderValues.includes(order)) {
    return Promise.reject({ status: 400, message: "Invalid order query" });
  }
  return fetchTopics()
    .then((topics) => {
      if (topic && !topics.some((existingTopic) => existingTopic.slug === topic)) {
        throw { status: 404, message: "Topic not found" };
      }
    })
    .then(() => {
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
})
};
