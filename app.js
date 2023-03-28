const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics");
const { getArticleById } = require("./controllers/article_id");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.message === "Topics not found") {
    res.status(404).send({ error: "Topics not found" });
  } else {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  }
});

module.exports = app;
