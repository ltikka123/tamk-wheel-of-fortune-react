const playerModel = require('../models/players.model');


const getAllPlayers = async (req, res) => {
    const p = await playerModel.getAllPlayers();

    if (p === undefined || p.length === 0) {
        res.status(404).json({error: "No players to fetch"});
    } else {
        res.json({ players: p });
    }
};

const getPlayerById = async (req, res) => {

    const p = await playerModel.getPlayersById(req.params.userId);

    if (p === undefined || p.length === 0) {
        res.status(404).json({error: "Player not found"});
    } else {
        res.json({p});
    }
};

const addPlayer = async (req, res) => {

    const name = req.params.userName;
    const response = await playerModel.addPlayer(name);

    if (response) {
        res.send(response);
    } else {
        res.status(400).json({error: "Invalid parameter"});
    }

};

const removePlayer = async (req, res) => {
    const playerId = req.params.userId;
    const response = await playerModel.deletePlayer(playerId);
    
    if (response) {
        res.send(response);
    } else {
        res.status(404).json({ error: "Player not found" });
    }
};

module.exports = {
    getAllPlayers,
    getPlayerById,
    addPlayer,
    removePlayer,
};
