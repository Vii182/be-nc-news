const { addCommentByArticleId } = require("../models/comments.model");
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


module.exports = { postCommentByArticleId };