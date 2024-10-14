const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { handleCustomErrors, handle404Errors, handle500Errors } = require("./error-handling");
const endpoints = require("./endpoints.json");

app.get("/api", (request, response) => {
    response.status(200).send({ endpoints: endpoints})
})

app.get("/api/topics", getTopics);

app.use(handleCustomErrors);

app.use(handle404Errors);

app.use(handle500Errors);

module.exports = app;