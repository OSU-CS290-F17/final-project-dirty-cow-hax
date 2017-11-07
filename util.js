const bluebird = require("bluebird");
const fs       = bluebird.promisifyAll(require("fs"));

const path     = require("path");

const public_path = path.join(__dirname, "client");


module.exports = {

    tryLoadFile: async (url) => {

        let data;
        try {
            data = await fs.readFileAsync(path.join(public_path, url));
        } catch (e) {
            log.error(`Error loading: ${url}`);
            return await tryAndFailLoadFile("404.html");
        }

        return data;
    },

    tryAndFailLoadFile: async (url) => {

        let data;
        try {
            data = await fs.readFileAsync(path.join(public_path, url));
        } catch (e) {
            log.error(`Error loading: ${url}`);
            throw new Error(`Error loading: ${url}`);
        }

        return data;

    }

}
