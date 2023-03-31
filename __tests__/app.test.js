const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const sorted = require("jest-sorted");

beforeEach(() => seed(testData));

describe("GET /api/topics", () => {
  it("responds with an array with 'slug' and 'description' properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const topics = res.body.topics;
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  it("responds with a 404 Not Found error for invalid paths", () => {
    return request(app)
      .get("/invalid-path")
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe("Not Found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("responds with a corresponding article object that has the following properties:\
    author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const article = res.body;
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  it("responds with a 404 error when article ID isn't in the database", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe("Not found");
      });
  });
  it("responds with a 400 error when article ID is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Number not received when expected");
      });
  });
});

describe("GET /api/articles", () => {
  it("responds with an array of article objects, each containing the required properties and a numeric comment_count, sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles;
        expect(articles.length).toBeGreaterThan(1);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article, i) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  it("responds with a 404 Not Found error for invalid paths", () => {
    return request(app)
      .get("/invalid-path")
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe("Not Found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("responds with an empty array for an article with no comments", () => {
    const articleId = 2;
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then((res) => {
        const comments = res.body.comments;
        expect(comments).toHaveLength(0);
      });
  });
  it("responds with an array of comments for the given article_id with the required properties", () => {
    const articleId = 1;
    const expectedCommentCount = 11;
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then((res) => {
        const comments = res.body.comments;
        expect(comments.length).toBe(expectedCommentCount);
      });
  });

  it("serves the most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const comments = res.body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("handles 404 error when the article_id does not exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.message).toEqual("Not found");
      });
  });
  it("handles 400 error when the article_id is not a number", () => {
    return request(app)
      .get("/api/articles/invalid-id/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.message).toEqual("Number not received when expected");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  describe("POST /api/articles/:article_id/comments", () => {
    it("returns the posted comment with the required properties", () => {
      const newComment = { username: "butter_bridge", body: "test body" };
      const articleId = 1;
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(newComment)
        .expect(201)
        .then((res) => {
          const postedComment = res.body.comment;
          expect(postedComment).toMatchObject({
            author: newComment.username,
            article_id: articleId,
            body: newComment.body,
            votes: 0,
          });
          expect(postedComment).toHaveProperty("comment_id");
          expect(postedComment).toHaveProperty("created_at");
        });
    });
  });
  it("returns the posted comment with the required properties and ignores extra properties", () => {
    const newComment = {
      username: "butter_bridge",
      body: "test body",
      ignoredProp: "something ignored",
    };
    const articleId = 1;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(newComment)
      .expect(201)
      .then((res) => {
        const postedComment = res.body.comment;
        expect(postedComment).toMatchObject({
          author: newComment.username,
          article_id: articleId,
          body: newComment.body,
          votes: 0,
        });
        expect(postedComment).toHaveProperty("comment_id");
        expect(postedComment).toHaveProperty("created_at");
        expect(postedComment).not.toHaveProperty("ignoredProp");
      });
  });
  it("returns a 400 error when missing 'username'", () => {
    const invalidComment = { body: "test body" };
    const articleId = 1;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(invalidComment)
      .expect(400)
      .then((res) => {
        expect(res.body.message).toEqual("Username not provided");
      });
  });
  it("returns a 400 error when missing 'body'", () => {
    const invalidComment = { username: "butter_bridge" };
    const articleId = 1;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(invalidComment)
      .expect(400)
      .then((res) => {
        expect(res.body.message).toEqual("Comment not provided");
      });
  });
  it("returns a 400 when passed an username that doesn't exist in the database", () => {
    const invalidComment = { username: "new_number", body: "test body" };
    const articleId = 1;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(invalidComment)
      .expect(400)
      .then((res) => {
        expect(res.body.message).toEqual("User not found");
      });
  });
  it("responds with a 400 error when article ID is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Number not received when expected");
      });
  });
  it("returns a 404 error when article_id does not exist", () => {
    const newComment = { username: "butter_bridge", body: "test body" };
    const articleId = 999;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.message).toEqual("Article not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("returns a 400 error when passed an empty object", () => {
    const patchVotes = {};
    const articleId = 1;
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(patchVotes)
      .expect(400)
      .then((res) => {
        expect(res.body.message).toEqual("Input is empty");
      });
  });
  it("updates the votes for a given article ID when number to increment by is positive", () => {
    patchedArticle = {
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 103,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    const patchVotes = { inc_votes: 3 };
    const articleId = 1;
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(patchVotes)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual(patchedArticle);
        expect(res.body.message).toEqual("Article votes updated");
      });
  });
  it("updates the votes for a given article ID when number to increment by is negative", () => {
    patchedArticle = {
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 97,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    const patchVotes = { inc_votes: -3 };
    const articleId = 1;
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(patchVotes)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual(patchedArticle);
        expect(res.body.message).toEqual("Article votes updated");
      });
  });
  it("returns a 400 error when inc_votes isn't a number'", () => {
    const patchVotes = { inc_votes: "NaN" };
    const articleId = 1;
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(patchVotes)
      .expect(400)
      .then((res) => {
        expect(res.body.message).toEqual("Number not received when expected");
      });
  });
  it("responds with a 400 error when article ID is not a number", () => {
    const patchVotes = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/not-a-number")
      .send(patchVotes)
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Number not received when expected");
      });
  });
  it("returns a 404 error when article_id does not exist", () => {
    const patchVotes = { inc_votes: 3 };
    const articleId = 999;
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(patchVotes)
      .expect(404)
      .then((res) => {
        expect(res.body.message).toEqual("Not found");
      });
  });
  it("returns a 400 error when inc_votes isn't a number'", () => {
    const patchVotes = { inc_votes: "NaN" };
    const articleId = 1;
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(patchVotes)
      .expect(400)
      .then((res) => {
        expect(res.body.message).toEqual("Number not received when expected");
      });
  });
  it("responds with a 400 error when article ID is not a number", () => {
    const patchVotes = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/not-a-number")
      .send(patchVotes)
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Number not received when expected");
      });
  });
  it("returns a 404 error when article_id does not exist", () => {
    const patchVotes = { inc_votes: 3 };
    const articleId = 999;
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(patchVotes)
      .expect(404)
      .then((res) => {
        expect(res.body.message).toEqual("Not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("deletes the given comment and returns undefined", () => {
    const commentId = 1;
    return request(app)
      .delete(`/api/comments/${commentId}`)
      .expect(204)
      .then((res) => {
        expect(res.rows).toBeUndefined();
      });
  });
  it("responds with a 400 error when comment_id is not a number", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Number not received when expected");
      });
  });
  it("returns a 404 error and undefined when comment_id does not exist", () => {
    const commentId = 999;
    return request(app).delete(`/api/comments/${commentId}`).expect(404);
  });
});

describe("GET /api/users", () => {
  it("responds with an array of user objects, each containing the required properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        const users = res.body.users;
        expect(users.length).toBeGreaterThan(1);
        users.forEach((users) => {
          expect(users).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  it("responds with a 404 Not Found error for invalid paths", () => {
    return request(app)
      .get("/invalid-path")
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe("Not Found");
      });
  });
});
afterAll(() => db.end());

describe('GET /api/articles', () => {
  it("responds with an array of article objects, sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(12);
        expect(res.body.articles[0]).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          body: expect.any(String),
          votes: expect.any(Number),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
        });
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  it("responds with an array of articles filtered by the topic query, sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toHaveLength(11);
        expect(res.body.articles[0].topic).toBe("mitch");
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  it("responds with an array of articles sorted by a specified column and order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toHaveLength(12);
        expect(res.body.articles).toBeSortedBy("votes", {
          descending: false,
        });
      });
  });
  it("responds with status 400 for an invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=bananas")
      .expect(400)
      .then((res) => {
        expect(res.body.message).toEqual("Bad request");
      });
  });
  
  it("responds with status 400 for an invalid order query", () => {
    return request(app)
      .get("/api/articles?order=bananas")
      .expect(400)
      .then((res) => {
        expect(res.body.message).toEqual("Bad request");
      });
  });
  
  it("responds with status 404 for a non-existent topic query", () => {
    return request(app)
      .get("/api/articles?topic=bananas")
      .expect(404)
      .then((res) => {
        expect(res.body.message).toEqual("Not found");
      });
  });
});

describe("GET /api/article/:article_id", () => {
  it("responds with a corresponding article object that has the following properties:\
  author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const article = res.body;
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });
});
