const API_KEY = '3e545aeb0f62d6150c6e6ed8ee9991c3';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');
let searchHistoryList = [];

// Event listener for form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (city) {
        getWeatherData(city);
        cityInput.value = '';
        
    }
});

// Function to fetch weather data
async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`);
        const data = await response.json();
        
        const currentWeather = data.list[0];
        displayCurrentWeather(currentWeather);

        const forecastData = data.list.slice(1, 6);
        displayForecast(forecastData);

        updateSearchHistory(city);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Function to display current weather
function displayCurrentWeather(data) {
    
    const cityName = data.name;
    const date = new Date(data.dt * 1000).toLocaleDateString();
    const icon = data.weather[0].icon;
    const temperature = (data.main.temp - 273.15).toFixed(2);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    // Create HTML elements for current weather
    const currentWeatherHTML = `
        <h2>${cityName} (${date})</h2>
        <img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;

    currentWeatherSection.innerHTML = currentWeatherHTML;
}

// Function to display 5 day forecast
function displayForecast(data) {
    
    let forecastHTML = '<h2>5-Day Forecast</h2>';
    data.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const icon = item.weather[0].icon;
        const temperature = (item.main.temp - 273.15).toFixed(2);
        const humidity = item.main.humidity;
        const windSpeed = item.wind.speed;

        forecastHTML += `
            <div class="forecast-item">
                <p>Date: ${date}</p>
                <img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
                <p>Temperature: ${temperature}°C</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            </div>
        `;
    });

    forecastSection.innerHTML = forecastHTML;
}


//functions for local storage
function updateSearchHistory(city) {

    searchHistoryList.push(city);


    if (searchHistoryList.length > 5) {
        searchHistoryList.shift();
    }

    localStorage.setItem('searchHistory', JSON.stringify(searchHistoryList));

    
    const searchHistoryHTML = searchHistoryList.map((item) => `<li>${item}</li>`).join('');
    searchHistory.innerHTML = searchHistoryHTML;

    
    const searchHistoryItems = document.querySelectorAll('#search-history li');
    searchHistoryItems.forEach((item) => {
        item.addEventListener('click', () => {
            getWeatherData(item.textContent);
        });
    });
}

updateSearchHistory('');

const selectedCity = localStorage.getItem('selectedCity');
if (selectedCity) {
    getWeatherData(selectedCity);
}