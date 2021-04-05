require("dotenv").config();

require("./rolitas");
const Server = require("./models/server");

const server = new Server();

server.listen();
