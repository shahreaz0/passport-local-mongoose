const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
	},
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
