const { addCommentByArticleId } = require("../models/comments.model");
const { fetchArticleById } = require("../models/articles.model");


const postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    fetchArticleById(article_id).then(() => {
        return addCommentByArticleId(article_id, username, body)
        .then((comment) => {
            res.status(201).send({ comment })
        }).catch((err) => {
            next(err)
        })
    })
}


module.exports = { postCommentByArticleId };