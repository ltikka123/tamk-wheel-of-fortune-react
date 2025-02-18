let players = [
    { name: "Alice", id: "8622291" },
    { name: "Bob", id: "1785684" },
];

const getAllPlayers = (req, res) => {
    res.json({ players });
};

const getPlayerById = (req, res) => {
    const player = players[req.params.userId];

    if (player) {
        res.json({player});
    } else {
        res.status(404).json({error: "Player not found"});
    }
};

const addPlayer = (req, res) => {

    const name = req.params.userName;

    if (name) {
        players.push({ name: req.params.userName, id: Math.random().toString().slice(2, 9)});
        res.send("Player added");
    } else {
        res.status(400).json({error: "Invalid parameter"});
    }

};

const removePlayer = (req, res) => {
    const playerId = req.params.userId;
    const initialLength = players.length;
    players = players.filter(player => player.id !== playerId);
    
    if (players.length < initialLength) {
        res.send(`Player with ID ${playerId} removed.`);
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
