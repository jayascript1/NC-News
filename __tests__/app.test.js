const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
describe('GET /api/topics', () => {
    it("responds with an array with 'slug' and 'description' properties", () => {
      return request(app)
        .get('/api/topics')
        .then((res) => {
          expect(200)
          expect(Array.isArray(res.body.topics)).toEqual(true)
          res.body.topics.forEach((topic) => {
            expect(topic).toHaveProperty('slug');
            expect(topic).toHaveProperty('description');
          });
        });
    });
  });
  