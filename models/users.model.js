const fs = require("fs/promises");
const db = require("../db/connection")


const fetchUsers = () => {
    const query = `SELECT * FROM users;`
    return db.query(query).then((result) => {
          return result.rows;
        });
}

const fetchUserByUsername = (username) => {
  return db.query(`SELECT * FROM users WHERE username = $1;`, [username])
  .then((result) => {
    if (result.rows.length === 0){
      return Promise.reject({ status: 404, msg: 'No user found'})
    }
    return result.rows[0];
  })
}


module.exports = { fetchUsers, fetchUserByUsername };