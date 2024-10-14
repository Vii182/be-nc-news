const fs = require("fs/promises");
const db = require("../db/connection");

const fetchArticles = () => {
    return db.query(`
        SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, 
        articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
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

module.exports = { fetchArticles, fetchArticleById }