const { fetchArticleById, fetchArticles, fetchCommentsByArticleId, updateArticleVoteCount } = require("../models/articles.model");

const getArticles = (req, res, next) => {
    const { sort_by, order, topic } = req.query;
    fetchArticles(sort_by, order, topic).then((articles) => {
        res.status(200).send({ articles });
    }).catch((err) => {
        next(err);
    })
}

const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({ article });
    }).catch((err) => {
        next(err);
    });
};

const getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id).then(() => {
        return fetchCommentsByArticleId(article_id);
    })
    .then((comments) => {
        res.status(200).send({ comments });
    }).catch((err) => {
        next(err);
    })
}

const patchArticleVotes = (req,res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
  fetchArticleById(article_id).then(() => {
    return updateArticleVoteCount(article_id, inc_votes);
  })
  .then((updatedVotes) => {
    res.status(200).send({ updatedVotes });
  })
  .catch((err) => {
    next(err);
  })
}


module.exports = { getArticles, getArticleById, getCommentsByArticleId, patchArticleVotes };