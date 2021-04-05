require("dotenv").config();

require("./controller/rolitas");
const Server = require("./models/server");

const server = new Server();

server.listen();
