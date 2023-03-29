const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    const topics = result.rows;
    return topics;
  });
};
