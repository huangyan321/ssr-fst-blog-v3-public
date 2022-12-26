const chalk = require('chalk');
function noop(msg) {
  return msg;
}

function log(fn, type) {
  return (msg) => {
    console.log(fn(`\n[log] ${msg}\n`));
  };
}

module.exports = {
  success: log(chalk.green),
  error: log(chalk.red),
  warn: log(chalk.yellow),
  info: log(chalk.cyan),
  log: log(noop)
};
