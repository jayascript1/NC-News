const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    const topics = result.rows;
    if (topics.length === 0) {
      const error = new Error("Topics not found");
      error.status = 404;
      throw error;
    }
    return topics;
  });
};
