const express = require('express');
const methodOverride = require('method-override');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db');
const bodyParser = require('body-parser');
//const moment = require('moment');
//const popup = require('popups');

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// bodyparser
// app.use(express.static('public'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json())

app.set('view engine', 'ejs');

db.connect();

require('./routes')(app);

app.listen(port, () => console.log(`Server started at port ${port}`));