// ==============================
// SKYFETCH WEATHER APP
// Prototypal Inheritance Version
// ==============================

// Your OpenWeatherMap API Key
const API_KEY = 'YOUR_API_KEY';

const CURRENT_API = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API = 'https://api.openweathermap.org/data/2.5/forecast';

// ==============================
// Constructor Function
// ==============================
function WeatherApp() {
    this.weatherDisplay = document.getElementById('weather-display');
    this.forecastContainer = document.getElementById('forecast-container');
}

// ==============================
// FETCH WEATHER (MAIN ENTRY)
// ==============================
WeatherApp.prototype.getWeather = async function (city) {
    const currentUrl = `${CURRENT_API}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `${FORECAST_API}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    try {
        this.showLoading();

        // Fetch BOTH APIs together
        const [currentRes, forecastRes] = await Promise.all([
            axios.get(currentUrl),
            axios.get(forecastUrl)
        ]);

        console.log('Current:', currentRes.data);
        console.log('Forecast:', forecastRes.data);

        this.displayWeather(currentRes.data);
        this.displayForecast(forecastRes.data);

    } catch (error) {
        console.error('Error fetching weather:', error);
        this.showError('Could not fetch weather data. Please try again.');
    }
};

// ==============================
// LOADING UI
// ==============================
WeatherApp.prototype.showLoading = function () {
    this.weatherDisplay.innerHTML = `<p class="loading">Loading weather...</p>`;
    if (this.forecastContainer) {
        this.forecastContainer.innerHTML = '';
    }
};

// ==============================
// ERROR UI
// ==============================
WeatherApp.prototype.showError = function (message) {
    this.weatherDisplay.innerHTML = `<p class="loading">${message}</p>`;
};

// ==============================
// CURRENT WEATHER DISPLAY
// ==============================
WeatherApp.prototype.displayWeather = function (data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const html = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    this.weatherDisplay.innerHTML = html;
};

// ==============================
// 5-DAY FORECAST DISPLAY
// ==============================
WeatherApp.prototype.displayForecast = function (data) {
    if (!this.forecastContainer) return;

    // Filter 12:00 PM entries (1 per day)
    const dailyForecasts = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    ).slice(0, 5);

    const cards = dailyForecasts.map(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        const temp = Math.round(day.main.temp);
        const desc = day.weather[0].description;
        const icon = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        return `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="${iconUrl}" alt="${desc}">
                <div class="forecast-temp">${temp}°C</div>
                <p>${desc}</p>
            </div>
        `;
    }).join('');

    this.forecastContainer.innerHTML = cards;
};

// ==============================
// INIT APP
// ==============================
const app = new WeatherApp();

// Example default call
app.getWeather('London');

// Optional: expose globally for search input
window.app = app;