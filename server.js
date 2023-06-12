const swaggerUI = require('swagger-ui-express');
//const YAML = require('yamljs');
const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();
const express = require('express');
const { format } = require('date-fns');
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
//Middleware for swagger documentation
//app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Portfolio API",
            version: "1.0.0",
            description: "Professional Portfolio API",
            contact: {
                email: "ojotobar@gmail.com",
                website: "https://ojotobar.com"
            },
            license: {
                name: "Apache",
                url: "http://apache.com"
            }
        },
        servers: [
            {
                url: "http://localhost:3500"
            },
            {
                url: "https://www.ojotobar.api.com"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
        },
        security: {
            bearerAuth: []
        }
    },
    apis: ["./routes/api/*.js"]
}

const specs = swaggerJsDoc(options);
const app = express();

//swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

//Connect to MongoDb
connectDB();

//custom middleware logger
app.use(logger);

//Handle options credential check - before CORS!
//and fetch cookies credentials requirement
//app.use(credentials);
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
app.use('/reset-password', require('./routes/api/resetPassword'));
app.use('/change-password', require('./routes/api/changePassword'));
app.use('/notification', require('./routes/api/notification'));

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDb');
    app.listen(PORT, () =>
    logEvents(`Server running on ${PORT}.\t${os.type()} - ${os.version()}`, `evLog-${format(new Date(), 'yyyyMMdd-HH')}.txt`)
);
});