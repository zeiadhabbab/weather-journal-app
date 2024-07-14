/* Global Variables */
const WEATHER_API_KEY = 'dc17e11e845722c9c950a50c6d5c3b79';
const WEATHER_API_UNITS = 'imperial';
const apiKey = `appid=${WEATHER_API_KEY}&units=${WEATHER_API_UNITS}`;

// DOM elements
const zipInput = document.getElementById("zip");
const feelingsInput = document.getElementById("feelings");
const entryHolder = document.getElementById("entryHolder");
const dateDisplayer = document.getElementById("date");
const tempDisplayer = document.getElementById("temp");
const contentDisplayer = document.getElementById("content");
const getDataButton = document.getElementById("generate");
const errorMsg = document.getElementById("error");
const citylocation = document.getElementById("location");
const desc = document.getElementById("desc");
const loader = document.getElementById("loader");

// Function to update web page with recent entry / cashed entry
const changeWebPage = async () => {
    // Clearing the error message
    errorMsg.textContent = "";
    loader.classList.remove("hidden");


    try {
        const response = await fetch('/get-weather-data');
        if (!response.ok) {
            throw new Error(`Failed to fetch recent entry: ${response.status}`);
        }

        const { date, temp, feelingsContent, city, country, weatherDetails, icon } = await response.json();
        dateDisplayer.textContent = `Date: ${date}`;
        tempDisplayer.textContent = `Temp: ${Math.round(temp)} degrees`;
        desc.textContent = `Weather: ${weatherDetails}`;
        contentDisplayer.textContent = `Feeling today: ${feelingsContent}`;
        citylocation.textContent = `Location: ${city}, ${country}`;


        //Displaying the wether icon
        entryHolder.style.backgroundImage = `url(${icon})`;
        loader.classList.add("hidden");

        
    } catch (error) {
        console.error("Error updating UI:", error);
        loader.classList.add("hidden");
    }
};

// Function to handle generate button click event
const getDataButtonListener = async (event) => {
    event.preventDefault();
    loader.classList.remove("hidden");

    const zip = zipInput.value.trim();
    const feelings = feelingsInput.value.trim();
    const date = new Date();


    if (!zip || !feelings) {
        errorMsg.textContent = "Please fill the zip code and feelings input.";
        return;
    }

    try {
        const weatherDetails = await getWeatherData(zip);
        const postData = {
            zipCode: zip,
            feelingsContent: feelings,
            temp: weatherDetails.main.temp,
            city: weatherDetails.name,
            country: weatherDetails.sys.country,
            weatherDetails: weatherDetails.weather[0].description,
            icon: 'https://openweathermap.org/img/wn/'+  weatherDetails.weather[0].icon +'@2x.png',
            date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
        };

        await fetch("/post-weather-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        });

        await changeWebPage();
    } catch (error) {
        console.error("Error generating entry:", error);
        if (error.message === "city not found") {
            errorMsg.textContent = "No city found with the given zip code. Please enter a valid zip code with Contry code.";
        }
    }
};

// Function to fetch weather data from API OpenWeatherMap API
const getWeatherData = async (zipCode) => {

    const finalUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&${apiKey}`;
    try {
        const response = await fetch(finalUrl);
        if (!response.ok) {
            errorMsg.textContent = "Failed to fetch data. Please try again.";
            throw new Error(`Failed to fetch data: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
        errorMsg.textContent = "Failed to fetch data. Please try again.";
    }
};


// Initialize UI when DOM content is loaded
window.addEventListener("DOMContentLoaded", changeWebPage);

// Add event listener to get data button
getDataButton.addEventListener('click', getDataButtonListener);