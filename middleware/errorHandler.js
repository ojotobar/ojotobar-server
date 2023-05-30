const { logEvents } = require('./logEvents');
const { format } = require('date-fns');

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, `errLog-${format(new Date(), 'yyyyMMdd-HH')}.txt`);
    res.status(500).send(err.message);
}

module.exports = errorHandler;