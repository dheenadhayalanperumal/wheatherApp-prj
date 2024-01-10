// Variable to store weather data
let WeatherData = null;

// Function to get current location coordinates
async function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            const { latitude, longitude } = position.coords;
            saveCoordinatesToLocalStorage(latitude, longitude);

            alert("Current Location - Latitude: " + latitude + ", Longitude: " + longitude);
            getCityName(latitude, longitude);
            WeatherData = await getWeatherData(latitude, longitude);
            console.log(WeatherData);
            updateUI();
        }, function (error) {
            alert("Error getting current location: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to get coordinates for the selected city
async function getSelectedCityCoordinates(selectedOption) {
    const savedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];
    const selectedLocation = savedLocations.find(location => location.cityName === selectedOption);

    if (selectedLocation) {
        const { latitude, longitude } = selectedLocation;
        alert("Selected Location - Latitude: " + latitude + ", Longitude: " + longitude);

        WeatherData = await getWeatherData(latitude, longitude);
        console.log(WeatherData);
        updateUI();
    } else {
        alert("Coordinates for " + selectedOption + " not found.");
    }
}

// Function to save coordinates to localStorage
function saveCoordinatesToLocalStorage(latitude, longitude) {
    localStorage.setItem('lastLocationLatitude', latitude);
    localStorage.setItem('lastLocationLongitude', longitude);
}

// Function to retrieve coordinates from localStorage
function getLastLocationFromLocalStorage() {
    const latitude = localStorage.getItem('lastLocationLatitude');
    const longitude = localStorage.getItem('lastLocationLongitude');
    return { latitude, longitude };
}

// Function to display city name
function displayCityName(city) {
    const cityNameElement = document.getElementById('cityName');
    cityNameElement.innerText = capitalizeFirstLetter(city);
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Event listener for the dropdown change
document.getElementById("Location").addEventListener("change", function () {
    const selectedOption = this.value;

    if (selectedOption === "CurrentLocation") {
        getCurrentLocation();
    } else {
        getSelectedCityCoordinates(selectedOption);
    }
});

// Event listener for the form submission
const searchForm = document.getElementById("formAction");
searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const cityNameInput = document.getElementById("searchdata");
    const cityName = cityNameInput.value;

    if (cityName) {
        WeatherData = await getWeatherDataByCityName(cityName);
        const latitude = WeatherData.latitude;
        const longitude = WeatherData.longitude;
        saveCoordinatesToLocalStorage(latitude, longitude);

        console.log(WeatherData);
        updateUI();
    } else {
        alert("City name cannot be empty.");
    }
});

// Function to get weather data by city name
async function getWeatherDataByCityName(cityName) {
    const apiKey = "YDKLNUJLBQLPSZXWKD3MT5XQS";
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=uk&key=${apiKey}`);
    const data = await response.json();
    console.log(data);
    return data;
}

// Function to get city name from coordinates
async function getCityName(lat, lon) {
    try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=3fb4ad9b362949b5a0cf0f155432a6cc`);
        const data = await response.json();

        if (data.results.length > 0) {
            const city = data.results[0].components.city ? data.results[0].components.city : data.results[0].components.suburb;
            displayCityName(city);

            console.log("Current Location - Latitude: " + lat + ", Longitude: " + lon + ", City: " + city);
        } else {
            alert("City name not available.");
        }
    } catch (error) {
        console.error("Error getting city name:", error);
    }
}

// Function to initialize the page
function async initializePage() {
    const lastLocation = getLastLocationFromLocalStorage();

    if (lastLocation.latitude && lastLocation.longitude) {
        console.log("Using last location:", lastLocation.latitude, lastLocation.longitude);
        getCityName(lastLocation.latitude, lastLocation.longitude);
        WeatherData = await getWeatherData(lastLocation.latitude, lastLocation.longitude);
        console.log(WeatherData);
        updateUI();
    } else {
        console.log("No last location found");
    }
    displaySavedLocations();
}

// Function to display saved locations in the dropdown
function displaySavedLocations() {
    const savedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];
    const selectElement = document.getElementById("Location");

    selectElement.innerHTML = '<option value="selectlocation">Select Location</option><option value="CurrentLocation">Current Location</option>';

    savedLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location.cityName;
        option.textContent = location.cityName;
        selectElement.appendChild(option);
    });
}

// Function to update the UI with weather data
function updateUI() {
    console.log("hello");
    displayTemperature(WeatherData.currentConditions.temp);
    displayPressure(WeatherData.currentConditions.pressure);
    displaywind(WeatherData.currentConditions.windspeed);
    displayhumidity(WeatherData.currentConditions.humidity);
    displayUV(WeatherData.currentConditions.uvindex);
    cityNameofLocation();

    // Display time and temperature for each hour
    for (let i = 0; i < 5; i++) {
        displayTime(`Hours${i + 1}`, i);
        displayHourTemp(`HoursTemp${i + 1}`, i);
    }

    // Display day and temperature for each day
    for (let i = 0; i < 6; i++) {
        displayDayTemp(`DayTemp${i + 1}`, i);
    }
}

// Function to display temperature
function displayTemperature(temperature) {
    document.getElementById('tempinner').innerHTML =
        `<h2 id="tempText">${temperature}&deg;F</h2>
        <p>FEEL LIKE</p>
        <p id="feellike"> ${WeatherData.currentConditions.feelslike}&deg;F</p>`;
}

// Function to display pressure
function displayPressure(pressure) {
    document.getElementById('pressureinner').innerText = pressure;
}

// Function to display wind
function displaywind(wind) {
    document.getElementById('windinner').innerText = wind;
}

// Function to display humidity
function displayhumidity(humidity) {
    document.getElementById('humidityinner').innerText = humidity;
}

// Function to display UV index
function displayUV(UV) {
    document.getElementById('UVinner').innerText = UV;
}

// Function to display time
function displayTime(id, hoursToAdd) {
    var now = new Date();
    var targetElement = document.getElementById(id);
    var newHours = (now.getHours() + hoursToAdd) % 24;

    newHours = (newHours < 10) ? "0" + newHours : newHours;

    targetElement.innerText = newHours;
}

// Function to display hour temperature
function displayHourTemp(id, hoursToAdd) {
    var now = new Date();
    var targetElement = document.getElementById(id);
    var newHours = (now.getHours() + hoursToAdd) % 24;

    targetElement.innerText = WeatherData.days[0].hours[newHours].temp;
}

// Function to display day temperature
function displayDayTemp(targetId, daysToAdd) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var now = new Date();
    now.setDate(now.getDate() + daysToAdd);
    var targetElement = document.getElementById(targetId);

    var todayMonth = months[now.getMonth()];
    var todayDate = now.getDate();
    var todayDay = daysOfWeek[now.getDay()];

    targetElement.innerHTML = `
        <div>
            <p>${todayDay}</p>
        </div>
        <div>
            <p>${todayMonth}, ${todayDate}</p>
        </div>
        <div><img src="/image/image6.svg"></div>
        <div>
            <p>${WeatherData.days[daysToAdd].temp}&deg;F</p>
        </div>`;
}

// Event listener for the save button
const saveButton = document.getElementById("saveLocation");
saveButton.addEventListener("click", function () {
    const cityName = prompt("Enter the city name:");

    if (cityName && WeatherData && WeatherData.latitude && WeatherData.longitude) {
        const existingLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];
        const newLocation = { cityName, latitude: WeatherData.latitude, longitude: WeatherData.longitude };
        existingLocations.push(newLocation);

        localStorage.setItem('savedLocations', JSON.stringify(existingLocations));

        console.log("Location saved successfully.");
    } else {
        console.log("City name or coordinates are missing.");
    }
});

// Event listener when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);
