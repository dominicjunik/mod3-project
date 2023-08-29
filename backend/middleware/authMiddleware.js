// import token stuff
const jwt = require("jsonwebtoken");

// we get a token back from logging in, we save this in local storage,
// this function checks if that token is valid and then sends them to the next part of the route

function authorize (req, res, next) {
    try {
        console.log("auth middleware starting...");
        // step 1: see if there is a token sent in the header
        let token = req.header("Authorization");
        // if the token doesnt exist, stop the process
        if (!token) {
            return res.status(403).json({ error: "No token attached to request" });
        }
        // the token comes in the format "Bearer <token>" so we must edit the string
        token = token.replace("Bearer ", "");
        console.log(token);
        // step 2: check if the token is valid and not expired
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // if there is an error in the verify stop the process
        if (payload.error) {
            return res.status(403).json({ error: payload.error });
        }
        // step 3: attach the payload to the request object for later use
        // not sure if these should be attached to the body or just the object
        req.id = payload.id;
        req.username = payload.username;
        // step 4: run the next function to move on to the route
        next();
    } catch (error) {
        console.log(error.message);
        res.status(403).json({ error: error.message });
    }
};


module.exports = {
    authorize
}