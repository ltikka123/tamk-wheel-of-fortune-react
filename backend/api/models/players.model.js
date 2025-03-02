const db = require('./db');

const getAllPlayers = async () => {
    try {
        return (await db.pool.query('SELECT * FROM players')).rows;
    } catch {
        return []
    }
}

const getPlayersById = async (userId) => {
    try {
        return (await db.pool.query('SELECT * FROM players WHERE id = $1', [userId])).rows;
    } catch {
        return [];
    }
}   

const addPlayer = async (playerName) => {
    const response = await db.pool.query("INSERT INTO players (name) VALUES ($1)", [playerName])
    return response.rows;
}

const deletePlayer = async (playerId) => {
    const response = await db.pool.query("DELETE FROM players where id = $1", [playerId])
    return response.rows;
}

module.exports = {
    getAllPlayers,
    getPlayersById,
    addPlayer,
    deletePlayer
};