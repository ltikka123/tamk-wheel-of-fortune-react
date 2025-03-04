const db = require('./db');

const getUsers = async () => {
    try {
        return (await db.pool.query('SELECT * FROM users')).rows;
    } catch {
        return null
    }
}

const getUser = async (username) => {

    try {
        return (await db.pool.query('SELECT * FROM users WHERE username = $1', [username])).rows;
    } catch {
        return null;
    }
}

const addUser = async (username, password) => {
    const response = await db.pool.query("INSERT INTO users (username, password_hash) VALUES ($1, $2)", [username, password])
    return response.rows;
}

module.exports = {
    getUsers,
    getUser,
    addUser
}