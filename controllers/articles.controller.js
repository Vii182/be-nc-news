const { fetchArticleById, fetchArticles } = require("../models/articles.model");

const getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({ articles });
    }).catch((err) => {
        console.log(err)
        next(err);
    })
}

const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({ article });
    }).catch((err) => {
        console.log(err)
        next(err);
    });
};


module.exports = { getArticles, getArticleById };