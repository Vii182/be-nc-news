const fs = require("fs/promises");
const db = require("../db/connection")


const fetchUsers = () => {
    const query = `SELECT * FROM users;`
    return db.query(query).then((result) => {
        if (result.rows.length === 0){
          return Promise.reject({ status: 404, msg: 'No Users found'})
        }
          return result.rows;
        });
}


module.exports = { fetchUsers };