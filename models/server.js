const express = require("express");
const cors = require("cors");

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		// Middlewares
		this.middlewares();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Parse and read body
		this.app.use(express.json());

		// Public directory
		this.app.use(express.static("public"));

		this.app.get("/home", function (req, res) {
			res.send("Naissss!");
		});
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log(`Listening at http://localhost:${this.port}`);
		});
	}
}

module.exports = Server;
