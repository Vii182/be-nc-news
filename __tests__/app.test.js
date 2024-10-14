const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");



beforeEach(() => {
    return seed(data)
});

afterAll(() => {
    return db.end()
});


describe("/api/topics", () => {
    test("GET: 200 sends an array of all topics to the client in correct formats", () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body.topics)).toBe(true);
            expect(response.body.topics).toHaveLength(3);
            response.body.topics.forEach((topic) => {
                expect(topic).toHaveProperty('slug');
                expect(topic).toHaveProperty('description');
                expect(typeof topic.slug).toBe('string');
                expect(typeof topic.description).toBe('string');
              });
        })
    })
})