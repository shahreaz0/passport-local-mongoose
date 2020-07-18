const mongoose = require("mongoose");

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
