const { addCommentByArticleId, deleteCommentByCommentId } = require("../models/comments.model");
const { fetchArticleById } = require("../models/articles.model");


const postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    if (!username || !body) {
        return next({ status: 400, msg: 'Bad Request' });
    }
    fetchArticleById(article_id).then(() => {
        return addCommentByArticleId(article_id, username, body)
        .then((comment) => {
            res.status(201).send({ comment })
        })
    }).catch(next);
}

const deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    deleteCommentByCommentId(comment_id).then(() => {
        res.status(204).send();
    }).catch(next);
}


module.exports = { postCommentByArticleId, deleteComment };