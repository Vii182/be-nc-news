const express = require("express");
const { deleteComment } = require("../controllers/comments.controller");


const commentsRouter = express.Router();


commentsRouter.route('/:comment_id')
.delete(deleteComment);

module.exports = commentsRouter;