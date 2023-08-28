const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// the purpose of these schema is to save the users
const solvedBySchema = new Schema({
    // not sure i even need the userID // username
    username: { type: String },
    trick: { type: Boolean },
});

const SolvedBy = mongoose.model("solvedBy", solvedBySchema);

module.exports = SolvedBy;
