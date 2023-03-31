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
        expect(res.body.message).toBe("Artice ID must be a number");
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
            comment_count: expect.any(Number),
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
        expect(res.body.message).toEqual("Article not found");
      });
  });
  it("handles 400 error when the article_id is not a number", () => {
    return request(app)
      .get("/api/articles/invalid-id/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.message).toEqual("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("returns the posted comment", () => {
    const newComment = { username: "butter_bridge", body: "test body" };
    const articleId = 1;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(newComment)
      .expect(201)
      .then((res) => {
        const postedComment = res.body.comment;
        expect(postedComment.author).toEqual(newComment.username);
        expect(postedComment.body).toEqual(newComment.body);
        expect(postedComment.article_id).toEqual(articleId);
        expect(postedComment).toHaveProperty("created_at");
        expect(postedComment).toHaveProperty("votes", 0);
      });
  });

  it("returns a 400 error when missing username", () => {
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

  it("returns a 400 error when missing body", () => {
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


describe('POST /api/articles/:article_id/comments', () => {
  describe('POST /api/articles/:article_id/comments', () => {
    it('returns the posted comment with the required properties', () => {
      const newComment = { username: 'butter_bridge', body: 'test body' };
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
            votes: 0
          });
          expect(postedComment).toHaveProperty('comment_id');
          expect(postedComment).toHaveProperty('created_at');
        });
    });
  });
  
  
   it('returns a 400 error when missing required properties', () => {
    const invalidComment = { body: 'test body' };
    const articleId = 1;
    
    return request(app)
    .post(`/api/articles/${articleId}/comments`)
    .send(invalidComment)
    .expect(400)
    .then((res) => {
      expect(res.body.message).toEqual('Username not provided');
    });
  });

  it('returns a 400 error when missing required properties', () => {
    const invalidComment = { username: 'butter_bridge' };
    const articleId = 1;
    
    return request(app)
    .post(`/api/articles/${articleId}/comments`)
    .send(invalidComment)
    .expect(400)
    .then((res) => {
      expect(res.body.message).toEqual('Comment not provided');
    });
  });

  
  it('returns a 404 error when article_id does not exist', () => {
    const newComment = { username: 'butter_bridge', body: 'test body' };
    const articleId = 999;
    
    return request(app)
    .post(`/api/articles/${articleId}/comments`)
    .send(newComment)
    .expect(404)
    .then((res) => {
      expect(res.body.message).toEqual('Article not found');
    });
  });
});
afterAll(() => db.end());