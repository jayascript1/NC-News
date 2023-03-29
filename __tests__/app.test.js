const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

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
        expect(res.body.message).toBe("Article not found");
      });
  });
  it("responds with a 400 error when article ID is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Invalid article ID");
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
          if (i > 0) {
            const prevArticle = articles[i - 1];
            const currentDate = new Date(article.created_at);
            const previousDate = new Date(prevArticle.created_at);
            expect(currentDate.getTime()).toBeLessThanOrEqual(
              previousDate.getTime()
            );
          }
        });
      })
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
