const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const PORT = 3000;

const app = express();

app.engine('handlebars',
    exphbs(
        { defaultLayout: 'layout' }
    )
);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.listen(PORT, console.log(`DevJobs run in PORT: ${PORT}`));