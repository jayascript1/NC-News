const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

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
