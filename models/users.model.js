const fs = require("fs/promises");
const db = require("../db/connection")


const fetchUsers = () => {
    const query = `SELECT * FROM users;`
    return db.query(query).then((result) => {
          return result.rows;
        });
}


module.exports = { fetchUsers };