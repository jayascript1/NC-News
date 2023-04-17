const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");

app.use(express.json());

app.use("/api, apiRouter");

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
  } else if (err.code === "23502" && err.column === "author") {
    g;
    res.status(400).send({ message: "Username not provided" });
  } else if (err.code === "23502" && err.column === "body") {
    res.status(400).send({ message: "Comment not provided" });
  } else if (err.constraint === "comments_author_fkey") {
    res.status(400).send({ message: "User not found" });
  } else if (err.constraint === "comments_article_id_fkey") {
    res.status(404).send({ message: "Article not found" });
  } else if (err.code === "23502" && err.column === "votes") {
    res.status(400).send({ message: "Input is empty" });
  } else {
    console.log(err);
  }
});

module.exports = app;
