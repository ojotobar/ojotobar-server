const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const os = require('os');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if(!fs.existsSync(path.join(__dirname, '../logs', `${format(new Date(), 'yyyy-MM-dd')}`))){
            await fsPromises.mkdir(path.join(__dirname, '../logs', `${format(new Date(), 'yyyy-MM-dd')}`));
        }
        await fsPromises.appendFile(path.join(__dirname, '../logs', `${format(new Date(), 'yyyy-MM-dd')}`, logName), logItem);
    } catch (error) {
        console.log(error)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, `reqLog-${format(new Date(), 'yyyyMMdd-HH')}.txt`);
    next();
}

module.exports = { logger, logEvents };