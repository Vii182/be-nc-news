const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById, getArticles, getCommentsByArticleId } = require("./controllers/articles.controller");
const { getApiEndpoints } = require("./controllers/api.controller");
const { handleCustomErrors, handle400Errors, handle404Errors, handle500Errors } = require("./error-handling");
const { postCommentByArticleId } = require("./controllers/comments.controller");

app.use(express.json());

app.get("/api", getApiEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.use(handleCustomErrors);

app.use(handle400Errors);

app.use(handle500Errors);

app.use(handle404Errors);
module.exports = app;