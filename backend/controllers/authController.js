// for hashing and protecting user passwords
const bcrypt = require('bcrypt');
// json web token to allow verification of being logged in
const jwt = require('jsonwebtoken');

// import the user model for our database functions
const User = require("../models/userModel");

// function so we can set the expire time in one place
function generateToken(user) {
    const payload = { id: user._id, username: user.username };
    // expires is in seconds
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 300 });
    return token
}

// status codes 200=good 400=bad

// register POST => create new user
module.exports.register = async (req, res) => {
    try {
        // step 1: does user already exist?
        const foundUser = await User.findOne({ username: req.body.username });
        // if they do, kick them out of the register process
        if (foundUser) {
            return res.status(400).json({ error: "This user aleady exists" });
        }
        // step 2: if they dont exist encrypt their password and add the salt so the hash is unique
        const encryptedPassword = await bcrypt.hash(
            req.body.password,
            Number(process.env.SALT_ROUNDS)
        );
        // step 3: now we can add them to the DB with the encrypted password
        const newUser = await User.create({
            ...req.body,
            password: encryptedPassword,
        });
        // step 4: generate a jwt token with our function above and send it off to the user
        const token = generateToken(newUser);

        res.status(200).json({ token });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
};

// login POST => verify credentials
module.exports.login = async (req, res) => {
    try {
        // step 1: does user already exist?
        const foundUser = await User.findOne({ username: req.body.username });
        // if they don't, kick them out of the login process
        if (!foundUser) {
            return res.status(404).json({ error: "This user does not exist" });
        }
        // step 2: compare the inputted password to the one in the database
        const validPassword = await bcrypt.compare(
            req.body.password,
            foundUser.password
        );
        // if the passwords dont match, stop the process
        if (!validPassword) {
            return res.status(400).json({ error: "Password does not match" });
        }
        // step 3: if the passwords are good then send them a token
        const token = generateToken(foundUser);

        res.status(200).json({ token });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
};
// delete DELETE => destroy user
