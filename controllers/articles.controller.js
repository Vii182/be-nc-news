const { fetchArticleById } = require("../models/articles.model");



const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({ article });
    }).catch((err) => {
        console.log(err)
        next(err);
    });
};


module.exports = { getArticleById };