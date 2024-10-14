const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller")
const { handleCustomErrors, handle404Errors, handle500Errors } = require("./error-handling")


app.get("/api/topics", getTopics);

app.use(handleCustomErrors);

app.use(handle404Errors);

app.use(handle500Errors);

module.exports = app;