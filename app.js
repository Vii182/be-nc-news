const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById } = require("./controllers/articles.controller");
const { getApiEndpoints } = require("./controllers/api.controller");
const { handleCustomErrors, handle400Errors, handle404Errors, handle500Errors } = require("./error-handling");
const endpoints = require("./endpoints.json");

app.get("/api", getApiEndpoints);

app.get("/api/topics", getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.use(handleCustomErrors);

app.use(handle400Errors);

app.use(handle404Errors);

app.use(handle500Errors);

module.exports = app;