const fs = require("fs/promises");
const db = require("../db/connection");

const fetchArticles = (sort_by = 'created_at', order = 'desc') => {
    const validSortBy = ['title', 'topic', 'author', 'created_at', 'votes', 'comment_count'];
    const validOrder = ['asc', 'desc'];

    if (!validSortBy.includes(sort_by)){
        return Promise.reject({ status: 400, msg: 'Invalid sort_by query'})
    };
    if (!validOrder.includes(order)){
        return Promise.reject({ status: 400, msg: 'Invalid order query'})
    }

    return db.query(`
        SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, 
        articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order};
        `)
        .then((result) => {
        return result.rows;
    });
}

const fetchArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
        if (result.rows.length === 0){
            return Promise.reject({ status: 404, msg: 'Article not found'})
        }
        return result.rows[0];
    })
}

const fetchCommentsByArticleId = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
    .then((result) => {
        return result.rows;
    })
}

const updateArticleVoteCount = (article_id, inc_votes) => {
    if (typeof inc_votes === 'number'){
        return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id])
        .then((result) => {
            return result.rows[0];
        })
    }else return Promise.reject({ status: 400, msg: 'Bad Request: inc_votes must be a number' });
}

module.exports = { fetchArticles, fetchArticleById, fetchCommentsByArticleId, updateArticleVoteCount }