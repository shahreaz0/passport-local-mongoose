const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");

//required files
const User = require("./models/User");
const { send } = require("process");

// connect db
const startMongo = async () => {
	try {
		await mongoose.connect("mongodb://localhost:27017/auth", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("mongodb connected!");
	} catch (error) {
		console.log(error);
	}
};

startMongo();

//express config
const app = express();
app.set("views", path.join("views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join("public")));
app.use(
	expressSession({
		secret: "the world is full of secrets.",
		resave: false,
		saveUninitialized: false,
	}),
);
app.use(passport.initialize());
app.use(passport.session());

//passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware

const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.redirect("/login");
};

//routes
app.get("/", (req, res) => {
	res.render("home");
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.post("/register", async (req, res) => {
	try {
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

app.get("/login", (req, res) => {
	res.render("login");
});

app.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/secret",
		failureRedirect: "/login",
		failureMessage: "Wrong username or password.",
	}),
	(req, res) => {},
);

app.get("/secret", isLoggedIn, (req, res) => {
	console.log(req.user);
	res.send("/secret");
});

app.get("/logout", (req, res) => {
	req.logOut();
	res.redirect("/");
});

app.get("*", (req, res) => {
	res.send("not found");
});

//server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`http://localhost:${port}`));
