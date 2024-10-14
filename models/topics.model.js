const fs = require("fs/promises");
const db = require("../db/connection")


const selectTopics = () => {
    const query = `SELECT * FROM topics;`
    return db.query(query).then((result) => {
        if (result.rows.length === 0){
          return Promise.reject({ status: 404, msg: 'No topics found'})
        }
          return result.rows;
        });
}


module.exports = { selectTopics };