const express = require("express");
const app = express();
const { getApiEndpoints } = require("./controllers/api.controller");
const { handleCustomErrors, handle400Errors, handle404Errors, handle500Errors } = require("./error-handling");
const { articlesRouter, topicsRouter, usersRouter, commentsRouter } = require("./routers");

app.use(express.json());

//ROUTES
app.get("/api", getApiEndpoints);
app.use('/api/articles', articlesRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/users', usersRouter);
app.use('/api/comments', commentsRouter);


//ERROR HANDLING
app.use(handleCustomErrors);
app.use(handle400Errors);
app.use(handle500Errors);
app.use(handle404Errors);

module.exports = app;