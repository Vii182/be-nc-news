const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");
const toBeSortedBy = require("jest-sorted");



beforeEach(() => {
    return seed(data)
});

afterAll(() => {
    return db.end()
});

describe("/api", () => {
    test("GET: 200 responds with an object detailing all available endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body.endpoints).toEqual(endpoints)
        })
    })
})

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

describe("/api/articles", () => {
    test("GET: 200 responds with an array of all articles with correct properties, including 'comment_count'", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body.articles)).toBe(true);
            expect(response.body.articles).toHaveLength(13);
            response.body.articles.forEach((article) => {
                expect(article).toHaveProperty('author');
                expect(article).toHaveProperty('title');
                expect(article).toHaveProperty('article_id');
                expect(article).toHaveProperty('topic');
                expect(article).toHaveProperty('created_at');
                expect(article).toHaveProperty('votes');
                expect(article).toHaveProperty('article_img_url');
                expect(article).toHaveProperty('comment_count');
                expect(article).not.toHaveProperty('body');
            })
        })
    })
    test("GET: 200 responds with articles sorted by date in descending order by default", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
            expect(response.body.articles).toBeSortedBy('created_at', { descending: true })
        })
    })
})

describe("/api/articles/:article_id", () => {
    test("GET: 200 responds with the article object for a valid article_id", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toHaveProperty('title');
            expect(body.article).toHaveProperty('body');
            expect(body.article).toHaveProperty('topic');
            expect(body.article).toHaveProperty('author');
            expect(body.article).toHaveProperty('article_id');
            expect(body.article).toHaveProperty('created_at');
            expect(body.article).toHaveProperty('votes');
            expect(body.article).toHaveProperty('article_img_url');
            expect(typeof body.article.title).toBe('string');
            expect(typeof body.article.body).toBe('string');
            expect(typeof body.article.topic).toBe('string');
            expect(typeof body.article.author).toBe('string');
        });
    })
    test("GET: 400 responds with an error when the passed article_id is not a number", () => {
        return request(app)
        .get("/api/articles/not-a-number")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
        });
    })
    test("GET: 404 responds with an error when the passed article_id does not exist", () => {
        return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Article not found")
        });
    })
})

describe("/api/articles/:article_id/comments", () => {
    test("GET: 200 responds with an array of comments for the given article_id, sorted by most recent by default", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body.comments)).toBe(true);
            expect(response.body.comments).toHaveLength(11);
            expect(response.body.comments).toBeSortedBy('created_at', { descending: true });
            response.body.comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id');
                expect(comment).toHaveProperty('votes');
                expect(comment).toHaveProperty('created_at');
                expect(comment).toHaveProperty('author');
                expect(comment).toHaveProperty('body');
                expect(comment).toHaveProperty('article_id');
            })
        })
    })
    test("GET: 400 responds with an error when the passed article_id is not a number", () => {
        return request(app)
        .get("/api/articles/not-a-number/comments")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
        })
    })
    test("GET: 404 responds with an error when the passed article_id does not exist", () => {
        return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Article not found");
        });
    })
})