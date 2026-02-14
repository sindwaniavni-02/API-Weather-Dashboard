// Your OpenWeatherMap API Key
const API_KEY = 'YOUR_API_KEY';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// TODO: Convert this function to async/await
async function getWeather(city) {
    // TODO: Build the API URL
    const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    
    // TODO: Wrap in try-catch block
    try {
        // TODO: Use await with axios.get()
        const response = await axios.get(url);
        
        // TODO: Log the response (for debugging)
        console.log('Weather Data:', response.data);
        
        // TODO: Call displayWeather with response.data
        displayWeather(response.data);
    } catch (error) {
        // TODO: Log the error
        console.error('Error fetching weather:', error);
        
        // TODO: Call a new function showError()
        // We'll create this function next
        showError('Could not fetch weather data. Please try again.');
    }
}

// New helper to show errors
function showError(message) {
    document.getElementById('weather-display').innerHTML = 
        `<p class="loading">${message}</p>`;
}

// Function to display weather data
function displayWeather(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;
    
    document.getElementById('weather-display').innerHTML = weatherHTML;
}

// Call the function when page loads
getWeather('London');