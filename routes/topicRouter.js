const topicRouter = require("express").Router();
const { getTopics } = require("../controllers/topics");

topicRouter.get("/", getTopics);

module.exports = topicRouter;
