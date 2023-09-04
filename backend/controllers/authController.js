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
// make them go to a seperate page and input their password to delete the account
module.exports.delete = async (req, res) => {
    console.log('DELETE FUNCTION')
    console.log(req)
    try {
        // step 1: get user from params or from the req.body (because they will already be logged in)
        const foundUser = await User.findById(req.params.id)
        // if they dont exist throw an error because its a bad route
        if (!foundUser) {
            return res.status(404).json({ error: "No user with this ID" });
        }
        // step 2: compare their input password with the one in the database
        const validPassword = await bcrypt.compare(
            req.body.password,
            foundUser.password
        );
        // if the passwords dont match, stop the process
        if (!validPassword) {
            return res.status(400).json({ error: "Password does not match" });
        }
        // step 3: if the passwords match then execute order 66
        await User.deleteOne(foundUser._id)
        res.status(200).json({message: 'deleted user account'})
    } catch(error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
}

// Update user -> specifically from the profile page so full user information is provided in the body
module.exports.update = async (req, res) => {
    try {
        console.log(req.body)
        // step 1 encrypt new password
        const encryptedPassword = await bcrypt.hash(
            req.body.password,
            Number(process.env.SALT_ROUNDS)
        );
        // step 2 update the user in the database 
        const updatedUser = await User.findByIdAndUpdate(req.body._id, {
            ...req.body,
            password: encryptedPassword,
        }, { new: true });
        // step 3: generate a jwt token with our function above and send it off to the user
        const token = generateToken(updatedUser);
        res.status(200).json({ token })
    } catch(error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
}    

