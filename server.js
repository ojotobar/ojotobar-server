require('dotenv').config();
const express = require('express');
const { format } = require('date-fns');
const app = express();
const os = require('os');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger, logEvents } = require('./middleware/logEvents');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3500;

//Connect to MongoDb
connectDB();

//custom middleware logger
app.use(logger);

//Handle options credential check - before CORS!
//and fetch cookies credentials requirement
app.use(credentials);
//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//for form-data: 'content-type': application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

//middleware for cookie
app.use(cookieParser());

//middleware for json
app.use(express.json());

app.use('/education', require('./routes/api/educations'));
app.use('/register', require('./routes/api/register'));
app.use('/login', require('./routes/api/login'));
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logOut'));
app.use('/roles', require('./routes/api/role'));
app.use('/verify-email', require('./routes/api/verifyEmail'));
app.use('/experience', require('./routes/api/experience'));
app.use('/address', require('./routes/api/address'));
app.use('/certification', require('./routes/api/certification'));
app.use('/project', require('./routes/api/project'));
app.use('/skill', require('./routes/api/skill'));
app.use('/social-link', require('./routes/api/socialLink'));
app.use('/user', require('./routes/api/user'));


app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDb');
    app.listen(PORT, () =>
    logEvents(`Server running on ${PORT}.\t${os.type()} - ${os.version()}`, `evLog-${format(new Date(), 'yyyyMMdd-HH')}.txt`)
);
});