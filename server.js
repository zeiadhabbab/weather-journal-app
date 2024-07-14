//Importing all require modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const app = express();


// Start up an instance of app

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 8000;
const server = app.listen(port, listening);

function listening() {
    console.log(`server running on localhost: ${port}`);
}

// Callback function to complete GET '/get-weather-data'
function getWeatherData(req, res) {
    res.send(projectData);
}

// Callback function to complete POST '/post-weather-data'
function postWeatherData(req, res) {
    const { zipCode, feelingsContent, temp, date, city, country, icon, weatherDetails } = req.body;
    projectData = { zipCode, feelingsContent, temp, date, city, country, icon, weatherDetails };
    console.log("Weather data has been saved.");
    console.log(projectData);
    res.send({ message: "Entry has been saved." });
}

// GET route
app.get('/get-weather-data', getWeatherData);

// POST route
app.post('/post-weather-data', postWeatherData);