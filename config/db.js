const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DATABASE, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('Connected DB') })
    .catch((err) => { console.log('DB connection failed', err) })

// Importing the models
require('../models/Vacantes');
require('../models/Usuarios');