const chalk = require("chalk")

module.exports = {
	__disabled: false,
	log: function(message) {
		if(this.__disabled) return;

		console.log(`${chalk.green("Log:")} ${message}`);
	},
	error: function(message) {
		if(this.__disabled) return;

		console.error(`${chalk.red("Error:")} ${message}`);
	},
	info: function(message) {
		if(this.__disabled) return;

		console.info(`${chalk.blue("Info:")} ${message}`);
	},
	debug: function(message) {
		if(this.__disabled) return;

		console.log(`${chalk.magenta("Debug:")} ${message}`);
	},
	blank: function(message) {
		if(this.__disabled) return;
		console.log(message);
	},
	disable: function() { this.__disabled = true; },
	enable: function() { this.__disabled = false; }
}
