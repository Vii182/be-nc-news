const fs = require("fs/promises");
const db = require("../db/connection");


const addCommentByArticleId = (article_id, username, body) => {
    return db.query(`
        INSERT INTO comments (article_id, author, body, votes, created_at)
        VALUES ($1, $2, $3, 0, NOW())
        RETURNING *;`, [ article_id, username, body ])
        .then((result) => {
            return result.rows[0];
        });
};

const deleteCommentByCommentId = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Comment not found" });
        }
    })
}

module.exports = { addCommentByArticleId, deleteCommentByCommentId };