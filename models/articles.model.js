const fs = require("fs/promises");
const db = require("../db/connection");

const fetchArticles = (sort_by = 'created_at', order = 'desc', topic) => {
    const validSortBy = ['title', 'topic', 'author', 'created_at', 'votes', 'comment_count'];
    const validOrder = ['asc', 'desc'];

    if (!validSortBy.includes(sort_by)){
        return Promise.reject({ status: 400, msg: 'Invalid sort_by query'})
    };
    if (!validOrder.includes(order)){
        return Promise.reject({ status: 400, msg: 'Invalid order query'})
    }

    const topicFilter = [];

    let queryString = `
        SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, 
        articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        `;

    if (topic) {
        return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic]).then((topicResult) => {
            if (topicResult.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Invalid topic filter' });
            }
            
            queryString += ` WHERE articles.topic = $1`;
            topicFilter.push(topic);
            queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

            return db.query(queryString, topicFilter)
            .then((result) => {
                return result.rows;
            });
        });
    }

    queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;
    return db.query(queryString, topicFilter)
            .then((result) => {
                return result.rows;
            });
}

const fetchArticleById = (article_id) => {
    return db.query(`
        SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles 
        LEFT JOIN comments ON comments.article_id = articles.article_id 
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
        `, [article_id])
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