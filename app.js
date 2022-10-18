require("dotenv").config()
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const initWebRoutes = require('./server/router/router');
const PORT = process.env.PORT || 5000;
const app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// Set up URL encoded and express JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Files
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/public')))

// Templating Engine
app.engine('hbs', exphbs( {extname: '.hbs' }));
app.set('view engine', 'hbs');

// Router setup
initWebRoutes(app);

app.listen(PORT)
console.log(`Listening on port: ${PORT}`);