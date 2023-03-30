const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics");
const { getArticleById } = require("./controllers/article_id");
const { getArticles } = require("./controllers/articles");
const { getCommentsByArticleId } = require("./controllers/comments");
const { postComment } = require("./controllers/postComment");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ message: "Bad request" });
  } else if (err.status === 404) {
    res.status(404).send({ message: "Not found" });
  } else {next(err)}
  
  
//   app.use(())
//   else if ( err.constraint === 'comments_author_fkey') {
//     res.status(404).send({ message: 'User not found'})
//   } else {console.log(err)}
});

module.exports = app;
