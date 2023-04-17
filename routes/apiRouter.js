const apiRouter = require("express").Router();
const topicRouter = require("./topicRouter");
const articleRouter = require("./articleRouter");
const commentRouter = require("./commentRouter");
const userRouter = require("./userRouter");


apiRouter.get('/', (req, res) => {
    const endpoints = {
        "GET /api": {
          description:
            "serves up a json representation of all the available endpoints of the api",
        },
        "GET /api/topics": {
          description: "serves an array of all topics",
          queries: [],
          exampleResponse: {
            topics: [{ slug: "football", description: "Footie!" }],
          },
        },
        "GET /api/articles": {
          description: "serves an array of all articles",
          queries: ["author", "topic", "sort_by", "order"],
          exampleResponse: {
            articles: [
              {
                title: "Seafood substitutions are increasing",
                topic: "cooking",
                author: "weegembump",
                body: "Text from the article..",
                created_at: 1527695953341,
              },
            ],
          },
        },
        "GET /api/articles/:article_id": {
          description: "returns an article by article_id",
        },
        "GET /api/articles/:article_id/comments": {
          description: "returns all comments for an article by article_id",
        },
        "GET /api/topics": {
          description: "returns all topics",
        },
        "GET /api/topics/:topic/articles": {
          description: "returns all articles for a specific topic",
        },
        "GET /api/users": {
          description: "returns all users",
        },
        "GET /api/users/:username": {
          description: "returns a user by username",
        },
        "DELETE /api/comments/:comment_id": {
          description: "deletes a comment by comment_id",
        },
      };
    
      res.json(endpoints);
    })

apiRouter.use("/topics", topicRouter)
apiRouter.use("/articles", articleRouter)
apiRouter.use("/comments", commentRouter)
apiRouter.use("/users", userRouter);


module.exports = apiRouter;