const apiKey = '637e34ff9401b9f4865f13915fab5309';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');

searchForm.addEventListener('submit', function(event) {
event.preventDefault();
const city = cityInput.value.trim();
if (city) {
    fetchWeather(city);
    cityInput.value = '';
}
});

function fetchWeather(city) {
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      // Display current weather
    displayCurrentWeather(data);
      // Fetch forecast
    fetchForecast(city);
      // Store search history
    storeSearchHistory(city);
    })
    .catch(error => {
    console.error('Error fetching weather:', error);
    });
}

function fetchForecast(city) {
fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      // Display forecast
    displayForecast(data);
    })
    .catch(error => {
    console.error('Error fetching forecast:', error);
    });
}

function displayCurrentWeather(data) {
  // Extract relevant data from API response
const { name, main, weather, wind } = data;
const weatherDescription = weather[0].description;
const temperature = main.temp;
const humidity = main.humidity;
const windSpeed = wind.speed;

  // Display current weather
currentWeather.innerHTML = `
    <div class="weather-item">
    <h2>${name}</h2>
    <p>${weatherDescription}</p>
    <p>Temperature: ${temperature}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
    </div>
`;
}

function displayForecast(data) {
  // Extract relevant forecast data from API response and display it
  // Extract relevant forecast data from API response and display it
  const forecastData = data.list.slice(0, 5); // Assuming you want to display the first 5 forecast entries
  let forecastHTML = '';

  forecastData.forEach(forecast => {
    const { dt_txt, main, weather } = forecast;
    const forecastDate = new Date(dt_txt);
    const temperature = main.temp;
    const weatherDescription = weather[0].description;

    forecastHTML += `
      <div class="forecast-item">
        <h3>${forecastDate.toLocaleDateString()}</h3>
        <p>${weatherDescription}</p>
        <p>Temperature: ${temperature}°C</p>
      </div>
    `;
  });

  forecast.innerHTML = forecastHTML;
}

function storeSearchHistory(city) {
  // Store searched city in local storage
  // Load search history from local storage and display it
  // Store searched city in local storage
  let searchHistory = localStorage.getItem('searchHistory');
  if (!searchHistory) {
    searchHistory = [];
  } else {
    searchHistory = JSON.parse(searchHistory);
  }
  searchHistory.push(city);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

  // Load search history from local storage and display it
  loadSearchHistory();
}

function loadSearchHistory() {
  // Load search history from local storage and display it
}

// Load search history when the page loads
loadSearchHistory();
