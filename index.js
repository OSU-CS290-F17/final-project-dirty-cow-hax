const http   = require("http");
const config = require("./config");
const log    = require("./log");

const server = http.createServer((req, res) => {

    log.debug(`Requested Resource: ${req.url}`);

    res.statusCode = 200;
    res.write("Hah!");
    res.end();

});

server.listen(config.port || 12345, () => {
    log.info(`Server Started!`);
})
