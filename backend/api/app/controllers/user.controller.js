const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

require('dotenv').config();

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
    
    try {
        const { password, username } = req.body;

        const userExists = await userModel.getUser(username);
        if (userExists !== null && userExists.length !== 0){
          res.status(400).json({error: "Invalid username"});
          console.log("[REGISTRATION]: User already exists: " + username);
          return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await userModel.addUser(username, passwordHash);


        // reply with JWT token
        const token = jwt.sign({ username: username }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: false, secure: true, // Ensure this is true if you're using HTTPS
            sameSite: 'None' // Needed for cross-origin cookies
        });
        res.status(201).send({token});

        console.log("[REGISTRATION]: Registered user " + username);
      } catch (error) {
        console.log("Registeration failed: " + error);
        res.status(400).json({error: "Registeration failed"});
      }
}

const login = async (req, res) => {

    const { password, username } = req.body;

    // Check that both username and password are provided
    if (username === undefined || password === undefined) {
        res.status(400).json({error: "Provide both username and password"});
        return;
    }

    // find user from users table
    const user = await userModel.getUser(username);
    if (!user || user.length === 0) {
        console.log(`[LOGIN]: User not found: ${username}`);
        res.status(400).json({error: "Invalid credentials"});
        return;
    }

    // Compare password to hash in db
    const passwordMatch = await bcrypt.compare(password, user[0].password_hash);
    if (!passwordMatch) {
        console.log(`[LOGIN]: Wrong password for user: ${username}`);
        res.status(400).json({error: "Invalid credentials"});
        return;
    }

    const token = jwt.sign({ username: username }, process.env.JWT_SECRET);

    res.cookie('token', token, { httpOnly: false, secure: true, // Ensure this is true if you're using HTTPS
        sameSite: 'None' // Needed for cross-origin cookies
    });
    res.status(200).send({token});


    console.log(`[LOGIN]: User logged in: ${username}`);

}


module.exports = {
    getUsers,
    register,
    login
}