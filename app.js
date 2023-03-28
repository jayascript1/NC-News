const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics");

app.get("/api/topics", getTopics);

app.get('/*', (req, res) => {
  res.status(404).send({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  if (err.message === "Topics not found") {
    res.status(404).send({ message: "Topics not found" });
  } else {
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = app;
