function getDateKey() {
  const date = new Date();
  return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
}

function getLogger(name) {
  const maxFileLength = 27;
  const prefix = '_' + getDateKey() + '.log';
  const logFileName = (name + prefix).length > maxFileLength ? name.substring(0, maxFileLength - prefix.length) + prefix : name + prefix;
  const currentLogFile = require("Storage").open(logFileName, 'w');

  return {
    log(message) {
     console.log(`writing: ${message} \n`);
      const file = currentLogFile.write(new Date().toUTCString() + ' '+message + '\n');
    },


  };
}

module.exports = {
  getLogger: getLogger,
};
