const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


require('dotenv').config({ path: 'variables.env' });

const app = express();

app.engine('handlebars',
    exphbs(
        { defaultLayout: 'layout' }
    )
);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));


app.use('/', router);

app.listen(process.env.PORT, console.log(`DevJobs run in PORT: ${process.env.PORT}`));