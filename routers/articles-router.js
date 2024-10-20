const express = require("express");
const { getArticles, getArticleById, patchArticleVotes, getCommentsByArticleId } = require("../controllers/articles.controller");
const { postCommentByArticleId } = require("../controllers/comments.controller");

const articlesRouter = express.Router();


articlesRouter.route('/')
.get(getArticles);

articlesRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticleVotes);

articlesRouter.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postCommentByArticleId);

module.exports = articlesRouter;