function getlocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        // var currentLat = position.coords.latitude;
        // var currentLng = position.coords.longitude;
        const { latitude, longitude } = position.coords;

        // Save the coordinates to localStorage
        saveCoordinatesToLocalStorage(latitude, longitude);

        alert(
          "Current Location - Latitude: " +
            latitude +
            ", Longitude: " +
            longitude
        );
        getCityName(latitude, longitude);
        WeatherData = await getWeatherData(latitude, longitude);
        console.log(WeatherData);
        test();
      },
      function (error) {
        alert("Error getting current location: " + error.message);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

var WeatherData = null;
async function getCoordinates() {
  var selectedOption = document.getElementById("Location").value;
  if (selectedOption === "CurrentLocation") {
    // Code to get current location coordinates
    getlocation();
  } else {
    // Code to get coordinates for the selected city
    // Retrieve the saved coordinates from local storage
    const savedLocations =
      JSON.parse(localStorage.getItem("savedLocations")) || [];
    const selectedLocation = savedLocations.find(
      (location) => location.cityName === selectedOption
    );

    if (selectedLocation) {
      const { latitude, longitude } = selectedLocation;
      alert(
        "Selected Location - Latitude: " +
          latitude +
          ", Longitude: " +
          longitude
      );

      // Call functions to get city name and weather data using the saved coordinates

      WeatherData = await getWeatherData(latitude, longitude);
      console.log(WeatherData);
      test();
    } else {
      alert("Coordinates for " + selectedOption + " not found.");
    }
  }
}

// Function to save coordinates to localStorage
function saveCoordinatesToLocalStorage(latitude, longitude) {
  localStorage.setItem("lastLocationLatitude", latitude);
  localStorage.setItem("lastLocationLongitude", longitude);
}

// Function to retrieve coordinates from localStorage
function getLastLocationFromLocalStorage() {
  const latitude = localStorage.getItem("lastLocationLatitude");
  const longitude = localStorage.getItem("lastLocationLongitude");
  return { latitude, longitude };
}

// Attach event listener to the dropdown
document.getElementById("Location").addEventListener("change", getCoordinates);

async function getWeatherData(latitude, longitude) {
  const apiKey = "YDKLNUJLBQLPSZXWKD3MT5XQS";
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=uk&key=${apiKey}`
  );
  // https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/12.9228,80.1583?unitGroup=uk&key=YDKLNUJLBQLPSZXWKD3MT5XQS

  const data = await response.json();
  return data;
}

const searchForm = document.getElementById("formAction");
searchForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  const cityNameInput = document.getElementById("searchdata");
  const cityName = cityNameInput.value;

  if (cityName) {
    WeatherData = await getWeatherDataByCityName(cityName);
    const latitude = WeatherData.latitude;
    const longitude = WeatherData.longitude;
    saveCoordinatesToLocalStorage(latitude, longitude);

    console.log(WeatherData);
    test();
  } else {
    alert("City name cannot be empty.");
  }
});

async function getWeatherDataByCityName(cityName) {
  const apiKey = "YDKLNUJLBQLPSZXWKD3MT5XQS";
  // const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/unitGroup=uk/${cityName}?key=${apiKey}`);
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=uk&key=${apiKey}`
  );

  const data = await response.json();
  console.log(data);
  return data;
}

async function getCityName(lat, lon) {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=3fb4ad9b362949b5a0cf0f155432a6cc`
    );
    const data = await response.json();
    // console.log(data);

    if (data.results.length > 0) {
      // const city = data.results[0].components.city;
      const city = data.results[0].components.city
        ? data.results[0].components.city
        : data.results[0].components.suburb;

      const cityNameElement = document.getElementById("cityName");
      cityNameElement.innerText = city;

      //   console.log(
      //     "Current Location - Latitude: " +
      //       lat +
      //       ", Longitude: " +
      //       lon +
      //       ", City: " +
      //       city
      //   );
    } else {
      alert("City name not available.");
    }
  } catch (error) {
    console.error("Error getting city name:", error);
  }
}
function test() {
  //   console.log("hello");
  displayTemperature(WeatherData.currentConditions.temp);
  displayPressure(WeatherData.currentConditions.pressure);
  displaywind(WeatherData.currentConditions.windspeed);
  displayhumidity(WeatherData.currentConditions.humidity);
  displayUV(WeatherData.currentConditions.uvindex);
  cityNameofLocation();
  dispalyImage();
  //   getCityName(lastLocation.latitude, lastLocation.longitude);

  // Display time and temperature for each hour
  for (let i = 0; i < 8; i++) {
    // console.log(i);
    displayTime(`Hours${i + 1}`, i * 3);
    displayHourTemp(`HoursTemp${i + 1}`, i * 3);
  }

  // Display day and temperature for each day
  for (let i = 0; i < 6; i++) {
    displayDayTemp(`DayTemp${i + 1}`, i);
  }

  for (let i = 0; i < 9; i++) {
    dispalyHourImage(`HourImage${i + 1}`, i * 3);
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function cityNameofLocation() {
  const cityNameElement = document.getElementById("cityName");
  cityNameElement.innerText = capitalizeFirstLetter(WeatherData.address);
}

function displayTemperature(temperature) {
  document.getElementById(
    "tempinner"
  ).innerHTML = `<h2 id="tempText">${temperature}&deg;C</h2>
     <p>FEEL LIKE</p>
     <p id="feellike"> ${WeatherData.currentConditions.feelslike}&deg;C</p>`;
}

function displayPressure(pressure) {
  document.getElementById("pressureinner").innerText = pressure;
  //    console.log(pressure);
}
function displaywind(wind) {
  document.getElementById("windinner").innerText = wind;
  //    console.log(wind);
}
function displayhumidity(humidity) {
  document.getElementById("humidityinner").innerText = humidity;
  //    console.log(humidity);
}
function displayUV(UV) {
  document.getElementById("UVinner").innerText = UV;
  //    console.log(UV);
}

function displayTime(id, hoursToAdd) {
  var now = new Date();

  var targetElement = document.getElementById(id);
  var newHours = (now.getHours() + hoursToAdd) % 24;
  //   console.log(newHours); // Ensure the result is within the range 0-23

  // Add leading zero if needed
  newHours = newHours < 10 ? "0" + newHours : newHours;

  targetElement.innerText = newHours;
}

function displayHourTemp(id, hoursToAdd) {
  var now = new Date();
  var targetElement = document.getElementById(id);
  var newHours = (now.getHours() + hoursToAdd) % 24; // Ensure the result is within the range 0-23

  // Add leading zero if needed
  // newHours = (newHours < 10) ? "0" + newHours : newHours;

  targetElement.innerText = WeatherData.days[0].hours[newHours].temp;
}

function dispalyHourImage(id, hoursToAdd) {
  const HourImage = document.getElementById(id);
  var now = new Date();
  var newHours = (now.getHours() + hoursToAdd) % 24;
  const weatherIcon = WeatherData.days[0].hours[newHours].icon; // Assuming this holds the weather icon
  console.log(weatherIcon);
  const iconImageSrc = getIconImageSrc(weatherIcon);
  HourImage.src = iconImageSrc;
}

function displayDayTemp(targetId, daysToAdd) {
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var now = new Date();
  now.setDate(now.getDate() + daysToAdd);
  var targetElement = document.getElementById(targetId);

  // Get the day, date, and month
  var todayMonth = months[now.getMonth()];
  var todayDate = now.getDate();
  var todayDay = daysOfWeek[now.getDay()];

  // Get the weather icon code
  var weatherIcon = WeatherData.days[daysToAdd].icon; // Replace with the actual property name

  // Map the weather icon code to the corresponding image source
  var iconImageSrc = getIconImageSrc(weatherIcon);
  // console.log(iconImageSrc);

  // Display the day, date, and month along with an image and temperature
  targetElement.innerHTML = `
          <div>
              <p>${todayDay}</p>
          </div>
          <div>
              <p>${todayMonth}, ${todayDate}</p>
          </div>
          <div><img class="dayImageHgt" src="${iconImageSrc}"></div>
          <div>
              <p>${WeatherData.days[daysToAdd].temp}&deg;C</p>
          </div>`;
}

const saveButton = document.getElementById("saveLocation");

saveButton.addEventListener("click", function () {
  // Prompt for the city name
  const cityName = prompt("Enter the city name:");

  if (
    cityName &&
    WeatherData &&
    WeatherData.latitude &&
    WeatherData.longitude
  ) {
    // Retrieve existing locations from local storage or initialize an empty array
    const existingLocations =
      JSON.parse(localStorage.getItem("savedLocations")) || [];

    // Add the new location to the array using API coordinates
    const newLocation = {
      cityName,
      latitude: WeatherData.latitude,
      longitude: WeatherData.longitude,
    };
    existingLocations.push(newLocation);

    // Save the updated array to local storage
    localStorage.setItem("savedLocations", JSON.stringify(existingLocations));

    console.log("Location saved successfully.");
  } else {
    console.log("City name or coordinates are missing.");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const lastLocation = getLastLocationFromLocalStorage();

  if (lastLocation.latitude && lastLocation.longitude) {
    // Use the last location
    console.log(
      "Using last location:",
      lastLocation.latitude,
      lastLocation.longitude
    );
    (async () => {
      // alert("Current Location - Latitude: " + lastLocation.latitude + ", Longitude: " + lastLocation.longitude);
      getCityName(lastLocation.latitude, lastLocation.longitude);
      WeatherData = await getWeatherData(
        lastLocation.latitude,
        lastLocation.longitude
      );
      console.log(WeatherData);
      test();
    })();
    // Add your logic to fetch weather data and display it using the last location
  } else {
    console.log("No last location found");
  }
  displaySavedLocations();
});

function displaySavedLocations() {
  const savedLocations =
    JSON.parse(localStorage.getItem("savedLocations")) || [];

  const selectElement = document.getElementById("Location");
  // Clear existing options
  selectElement.innerHTML =
    '<option value="selectlocation">Select Location</option>  <option value="CurrentLocation">Current Location</option> ';

  // Add saved locations as options
  savedLocations.forEach((location) => {
    const option = document.createElement("option");
    option.value = location.cityName;
    option.textContent = location.cityName;
    selectElement.appendChild(option);
  });
}

function getIconImageSrc(iconCode) {
  switch (iconCode) {
    case "snow":
      return "/image/icon/snow.gif";
    case "snow-showers-day":
      return "/image/icon/snow-showers-day.gif";
    case "snow-showers-night":
      return "/image/icon/snow-showers-night.gif";
    case "thunder-rain":
      return "/image/icon/thunder-rain.svg";
    case "thunder-showers-day":
      return "/image/icon/thunder-showers-day.gif";
    case "thunder-showers-night":
      return "/image/icon/thunder-showers-day.gif";
    case "rain":
      return "/image/icon/rain.gif";
    case "showers-day":
      return "/image/icon/showers-day.gif";
    case "showers-night":
      return "/image/icon/showers-night.gif";
    case "fog":
      return "/image/icon/fog.gif";
    case "wind":
      return "/image/icon/wind.svg";
    case "cloudy":
      return "/image/icon/partly-cloudy-day.gif";
    case "partly-cloudy-day":
      return "/image/icon/partly-cloudy-day.gif";
    case "partly-cloudy-night":
      return "/image/icon/partly-cloudy-night.gif";
    case "clear-day":
      return "/image/icon/clear-day.gif";
    case "clear-night":
      return "/image/icon/clear-night.gif";
    default:
      return "/image/icon/clear-day.gif";
  }
}

console.log(WeatherData);

function dispalyImage() {
  const imageElement = document.getElementById("tempImage"); // Use more descriptive variable name
  const weatherIcon = WeatherData.currentConditions.icon;
  // console.log(weatherIcon); // Ensure WeatherData is accessible within this function's scope

  const iconImageSrc = getIconImageSrc(weatherIcon); // Assuming this function fetches the image URL

  imageElement.src = iconImageSrc; // Directly set the image source
}
