const router = require("express").Router();
const User = require("../models/User");
const passport = require("passport");

// passport -local
router.get("/register", async (req, res) => {
	res.render("register");
});

router.post("/register", async (req, res) => {
	try {
		const existedUser = await User.find({ username: req.body.username });
		if (existedUser) throw new Error("User already exists.");

		const user = new User({ username: req.body.username });
		await user.setPassword(req.body.password);
		await user.save();
		passport.authenticate("local")(req, res, () => {
			res.redirect("/secret");
		});
	} catch (error) {
		console.log(error);
		res.redirect("/register");
	}
});

router.get("/login", (req, res) => {
	res.render("login");
});

router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/secret",
		failureRedirect: "/login",
		failureMessage: "Wrong username or password.",
	}),
	(req, res) => {},
);

//passport-google

router.get("/logout", (req, res) => {
	req.logOut();
	res.redirect("/");
});

module.exports = router;
