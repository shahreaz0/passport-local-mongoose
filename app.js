const express = require("express");
const path = require("path");
const expressSession = require("express-session");
const passport = require("passport");

//required files
const authRoutes = require("./routes/auth");

// connect db
require("./configs/db");

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

//passport config
require("./configs/passport");

app.use(passport.initialize());
app.use(passport.session());

//middleware
const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.redirect("/login");
};

//routes
app.get("/", (req, res) => {
	res.render("home", { user: req.user });
});

app.use(authRoutes);

app.get("/secret", isLoggedIn, (req, res) => {
	// console.log(req.user);
	res.send("/secret");
});

app.get("*", (req, res) => {
	res.send("not found");
});

//server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`http://localhost:${port}`));
