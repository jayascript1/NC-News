const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics");
const { getArticleById } = require("./controllers/article_id");
const { getArticles } = require("./controllers/articles");
const { getCommentsByArticleId } = require("./controllers/comments");
const { postComment } = require("./controllers/postComment");
const { patchArticleVotes } = require("./controllers/patchArticleVotes");
const { deleteCommentById} = require("./controllers/deleteCommentById");
const { getUsers } = require("./controllers/users");
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.get('/api', (req, res) => {
  const endpoints = {
    "GET /api": {
      "description": "serves up a json representation of all the available endpoints of the api"
    },
    "GET /api/topics": {
      "description": "serves an array of all topics",
      "queries": [],
      "exampleResponse": {
        "topics": [{ "slug": "football", "description": "Footie!" }]
      }
    },
    "GET /api/articles": {
      "description": "serves an array of all articles",
      "queries": ["author", "topic", "sort_by", "order"],
      "exampleResponse": {
        "articles": [
          {
            "title": "Seafood substitutions are increasing",
            "topic": "cooking",
            "author": "weegembump",
            "body": "Text from the article..",
            "created_at": 1527695953341
          }
        ]
      }
    },
    "GET /api/articles/:article_id": {
      "description": "returns an article by article_id"
    },
    "GET /api/articles/:article_id/comments": {
      "description": "returns all comments for an article by article_id"
    },
    "GET /api/topics": {
      "description": "returns all topics"
    },
    "GET /api/topics/:topic/articles": {
      "description": "returns all articles for a specific topic"
    },
    "GET /api/users": {
      "description": "returns all users"
    },
    "GET /api/users/:username": {
      "description": "returns a user by username"
    },
    "DELETE /api/comments/:comment_id": {
      "description": "deletes a comment by comment_id"
    }
  };

  res.json(endpoints);
});


app.all("/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Number not received when expected" });
  } else if (err.status === 400) {
    res.status(400).send({ message: "Bad request" });
  } else if (err.status === 404) {
    res.status(404).send({ message: "Not found" });
  } else if (err.code === "23502" && err.column === "author") {g
    res.status(400).send({ message: "Username not provided" });
  } else if (err.code === "23502" && err.column === "body") {
    res.status(400).send({ message: "Comment not provided" });
  } else if (err.constraint === "comments_author_fkey") {
    res.status(400).send({ message: "User not found" });
  } else if (err.constraint === "comments_article_id_fkey") {
    res.status(404).send({ message: "Article not found" });
  } else if (err.code === '23502' && err.column === 'votes') {
    res.status(400).send({ message: "Input is empty"})
  } else {
    console.log(err);
  }
});

module.exports = app;
