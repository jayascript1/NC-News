const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");

describe("GET /api/topics", () => {
  it("responds with an array with 'slug' and 'description' properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const topics = res.body.topics;
        expect(Array.isArray(topics)).toEqual(true);
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("Invalid Paths", () => {
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
        expect(typeof article).toBe("object");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });
});
