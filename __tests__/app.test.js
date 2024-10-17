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


//--/API
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

//--/API/TOPICS
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

//--/API/ARTICLES
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
    test("GET: 200 responds with articles sorted by created_at in descending order by default", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
            expect(response.body.articles).toBeSortedBy('created_at', { descending: true });
        });
    })
    test("GET: 200 responds with articles when passed valid column and order queries in correct form", () => {
        return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then((response) => {
            expect(response.body.articles).toBeSortedBy('title');
        });
    })
    test("GET: 200 responds with all articles related to a specific topic when filtered with a topic query", () => {
        return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then((response) => {
            expect(response.body.articles).toHaveLength(1);
        })
    })
    test("GET: 200 responds with an empty array when no articles are found for a valid topic query", () => {
        return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then((response) => {
            expect(response.body.articles).toEqual([]);
        })
    })
    test("GET: 404 responds with an error when the given topic is invalid", () => {
        return request(app)
        .get("/api/articles?topic=farming")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Invalid topic filter")
        })
    })
    test("GET: 400 responds with an error when passed an invalid sort_by query", () => {
        return request(app)
        .get("/api/articles?sort_by=cheese")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid sort_by query');
        });
    })
    test("GET: 400 responds with an error when passed an invalid order query", () => {
        return request(app)
        .get("/api/articles?sort_by=title&order=sideways")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid order query');
        });
    })
})

//--/API/ARTICLES/:ARTICLE_ID
describe("/api/articles/:article_id", () => {
    describe("GET REQUESTS", () => {
        test("GET: 200 responds with the article object for a valid article_id, including comment_count property", () => {
            return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toHaveProperty('title', expect.any(String));
                expect(body.article).toHaveProperty('body', expect.any(String));
                expect(body.article).toHaveProperty('topic', expect.any(String));
                expect(body.article).toHaveProperty('author', expect.any(String));
                expect(body.article).toHaveProperty('article_id', expect.any(Number));
                expect(body.article).toHaveProperty('votes', expect.any(Number));
                expect(body.article).toHaveProperty('article_img_url', expect.any(String));
                expect(body.article).toHaveProperty('comment_count', expect.any(Number));
                expect(body.article).toHaveProperty('created_at');
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
    describe("PATCH REQUESTS", () => {
        test("PATCH: 200 responds with an updated vote count on the article when votes are incremented", () => {
            const voteUpdateTest = { inc_votes: 10 };
            return request(app)
                .patch("/api/articles/1")
                .send(voteUpdateTest)
                .expect(200)
                .then((response) => {
                    expect(response.body.updatedVotes).toMatchObject({
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        votes: 110,
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        topic: "mitch",
                        article_img_url: expect.any(String),
                        created_at: expect.any(String)
                    });
                });
        });
        test("PATCH: 200 responds with an updated vote count on the article when votes are decremented", () => {
            const voteUpdateTest = { inc_votes: -5 };
            return request(app)
                .patch("/api/articles/1")
                .send(voteUpdateTest)
                .expect(200)
                .then((response) => {
                    expect(response.body.updatedVotes).toMatchObject({
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        votes: 95,
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        topic: "mitch",
                        article_img_url: expect.any(String),
                        created_at: expect.any(String)
                    });
                });
        });
        test("PATCH: 400 responds with an error when the update variable is empty", () => {
            const voteUpdateTest = {};
            return request(app)
                .patch("/api/articles/1")
                .send(voteUpdateTest)
                .expect(400)
                .then((response) => {
                expect(response.body.msg).toBe('Bad Request: inc_votes must be a number')
                });
        });
        test("PATCH: 400 responds with an error when inc_votes is not a number", () => {
            const voteUpdateTest = { inc_votes: 'not-a-number' };
            return request(app)
                .patch("/api/articles/1")
                .send(voteUpdateTest)
                .expect(400)
                .then((response) => {
                    expect(response.body.msg).toBe('Bad Request: inc_votes must be a number');
                });
        });
        test("PATCH: 400 responds with an error when the passed article_id is not a number", () => {
            const voteUpdateTest = { inc_votes: 10 };
            return request(app)
                .patch("/api/articles/not-a-number")
                .send(voteUpdateTest)
                .expect(400)
                .then((response) => {
                    expect(response.body.msg).toBe('Bad Request')
                })
        })
        test("PATCH: 404 responds with an error when the passed article_id does not exist", () => {
            const voteUpdateTest = { inc_votes: 10 };
            return request(app)
            .patch("/api/articles/999")
            .send(voteUpdateTest)
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Article not found')
            })
        })
    })
})

//--/API/ARTICLES/:ARTICLE_ID/COMMENTS
describe("/api/articles/:article_id/comments", () => {
    describe("GET REQUESTS", () => {
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
        test("GET: 200 responds with an empty array when no comments are present for an article", () => {
            return request(app)
                .get("/api/articles/13/comments")
                .expect(200)
                .then((response) => {
                    expect(response.body.comments).toEqual([]);
                });
        });
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
    describe("POST REQUESTS", () => {
        test("POST: 201 responds with the posted comment with all neccessary properties", () => {
            const testComment = { username: "butter_bridge", body: "the war is finally over" };
            return request(app)
                .post("/api/articles/12/comments")
                .send(testComment)
                .expect(201)
                .then((response) => {
                    expect(response.body.comment).toMatchObject({
                        comment_id: expect.any(Number),
                        article_id: 12,
                        author: 'butter_bridge',
                        body: 'the war is finally over',
                        votes: 0,
                        created_at: expect.any(String),
                    });
                });
        });
        test("POST: 400 responds with an error when the request body is missing a username or body field", () => {
            const testComment = { body: "the war is finally over" };
            return request(app)
                .post("/api/articles/12/comments")
                .send(testComment)
                .expect(400)
                .then((response) => {
                    expect(response.body.msg).toBe("Bad Request");
                });
        });
        test("POST: 404 responds with an error when the article_id does not exist", () => {
            const testComment = { username: "masterChief", body: "the war is finally over" };
            return request(app)
                .post("/api/articles/999/comments")
                .send(testComment)
                .expect(404)
                .then((response) => {
                    expect(response.body.msg).toBe("Article not found");
                });
        });
    })
})

//--/API/COMMENTS/:COMMENT_ID
describe("/api/comments/:comment_id", () => {
    test("DELETE: 204 responds with no content when the comment has been successfully deleted", () => {
        return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then((response) => {
                expect(response.body).toEqual({});
            })
    })
    test("DELETE: 400 responds with an error when the passed comment_id is not a number", () => {
        return request(app)
            .delete("/api/comments/not-a-number")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request");
            });
    });
    test("DELETE: 404 responds with an error when the passed comment_id does not exist", () => {
        return request(app)
            .delete("/api/comments/999")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("Comment not found");
            })
    })
})

//--/API/USERS
describe("/api/users", () => {
    test("GET: 200 responds with an array of all users in correct formats", () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body.users)).toBe(true);
                expect(response.body.users).toHaveLength(4);
                response.body.users.forEach((user) => {
                    expect(user).toHaveProperty('username', expect.any(String));
                    expect(user).toHaveProperty('name', expect.any(String));
                    expect(user).toHaveProperty('avatar_url', expect.any(String));
                });
            })
    })
})