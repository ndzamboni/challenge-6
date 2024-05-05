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
  const { name, main, weather, wind, dt } = data;
  const weatherDescription = weather[0].description;
  const temperature = main.temp;
  const humidity = main.humidity;
  const windSpeed = wind.speed;
  const iconCode = weather[0].icon;
  const currentDate = new Date(dt * 1000); // Convert timestamp to milliseconds

  currentWeather.innerHTML = `
  <div class="weather-item">
      <h2>${name}</h2>
      <p>${currentDate.toDateString()}</p>
      <img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
      <p>${weatherDescription}</p>
      <p>Temperature: ${temperature}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
  </div>
  `;
}

function displayForecast(data) {
  const forecastData = data.list.slice(0, 5);
  let forecastHTML = '';

  forecastData.forEach(forecast => {
      const { dt, main, weather } = forecast;
      const forecastDate = new Date(dt * 1000); // Convert timestamp to milliseconds
      const temperature = main.temp;
      const weatherDescription = weather[0].description;
      const iconCode = weather[0].icon;

      forecastHTML += `
      <div class="forecast-item">
          <h3>${forecastDate.toDateString()}</h3>
          <img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
          <p>${weatherDescription}</p>
          <p>Temperature: ${temperature}°C</p>
      </div>
      `;
  });

  forecast.innerHTML = forecastHTML;
}

function storeSearchHistory(city) {
  let searchHistory = localStorage.getItem('searchHistory');
  if (!searchHistory) {
      searchHistory = [];
  } else {
      searchHistory = JSON.parse(searchHistory);
  }

  // Add city to search history, removing duplicates
  searchHistory = searchHistory.filter(item => item !== city);
  searchHistory.unshift(city); // Add the new city at the beginning
  if (searchHistory.length > 10) {
      searchHistory = searchHistory.slice(0, 10); // Limit to the last 10 searches
  }
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

  // Display search history
  loadSearchHistory();
}

function loadSearchHistory() {
  let searchHistory = localStorage.getItem('searchHistory');
  if (searchHistory) {
      searchHistory = JSON.parse(searchHistory);
      const searchHistoryContainer = document.getElementById('search-history');
      searchHistoryContainer.innerHTML = '';
      searchHistory.forEach(city => {
          const button = document.createElement('button');
          button.textContent = city;
          button.classList.add('search-history-button');
          button.addEventListener('click', () => {
              fetchWeather(city);
          });
          searchHistoryContainer.appendChild(button);
      });
  }
}

