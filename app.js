const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics");
const { getArticleById } = require("./controllers/article_id");
const { getArticles } = require("./controllers/articles");
const { getCommentsByArticleId } = require("./controllers/comments");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ message: "Invalid article ID" });
  } else if (err.status === 404) {
    res.status(404).send({ message: "Article not found" });
  } else if (err.status === 404 && err.message === "Invalid article ID") {
    res.status(404).send({ message: "Invalid article ID" });
  } else {
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = app;