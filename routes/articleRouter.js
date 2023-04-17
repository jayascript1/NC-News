const articleRouter = require("express").Router();
const { getArticleById } = require("../controllers/article_id");
const { getArticles } = require("../controllers/articles");
const { patchArticleVotes } = require("../controllers/patchArticleVotes");
const commentRouter = require("./commentRouter");

articleRouter.use("/:article_id/comments", commentRouter);
articleRouter.get("/:article_id", getArticleById);
articleRouter.get("/", getArticles);
articleRouter.patch("/:article_id", patchArticleVotes);

module.exports = articleRouter;


