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
    // Your current weather display function
}

function displayForecast(data) {
  const forecastData = data.list.slice(0, 7);
  let forecastHTML = '';

  forecastData.forEach((forecast, index) => {
      const { dt, main, weather } = forecast;
      const forecastDate = dayjs().add(index + 1, 'day'); // Add 1 day for each forecast item
      const formattedDate = forecastDate.format('dddd, MMM D'); // Format the date as "Day, Month Day"
      const temperature = main.temp;
      const weatherDescription = weather[0].description;
      const iconCode = weather[0].icon;

      forecastHTML += `
          <div class="forecast-item">
              <h3>${formattedDate}</h3>
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

// clear search history button  
const clearButton = document.getElementById('clear-history');
clearButton.addEventListener('click', function() {
    localStorage.removeItem('searchHistory');
    searchHistory.innerHTML = '';
});

