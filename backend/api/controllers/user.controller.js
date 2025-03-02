const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const userModel = require('../models/users.model.js');

const getUsers = async (req, res) => {
    const u = await userModel.getUsers();

    if (u === undefined || u.length === 0) {
        res.status(404).json({error: "No users to fetch"});
    } else {
        res.json({ users: u });
    }
}

const register = async (req, res) =>  {
    console.log("Registering new user");
    try {
        const { password, username } = req.body;

        const userExists = await userModel.getUser(username);
        if (userExists !== null && userExists.length !== 0){
          res.status(400).send("Invalid username");
          console.log("User already exists")
          return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await userModel.addUser(username, passwordHash);
        res.status(201).send("Registered user " + username);

      } catch (error) {
        console.log("Registeration failed")
        res.status(400).send(error);
      }
}

const login = async (req, res) => {
    console.log("Trying to login user");

    const { password, username } = req.body;

    // Check that both username and password are provided
    if (username === undefined || password === undefined) {
        res.status(400).send("Please provide both username and password");
        return;
    }

    // find user from users table
    const user = await userModel.getUser(username);
    if (!user || user.length === 0) {
        res.status(400).send("Invalid credentials");
        return;
    }

    // Compare password to hash in db
    const passwordMatch = await bcrypt.compare(password, user[0].password_hash);
    if (!passwordMatch) {
        res.status(400).send("Invalid credentials");
        return;
    }

    const token = jwt.sign({ username: username }, 'secret');

    res.status(200).send({token});

}


module.exports = {
    getUsers,
    register,
    login
}