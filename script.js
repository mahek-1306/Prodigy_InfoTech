// Weather API key
const apiKey = '1044f34f9804450495453740251901'; // Replace with your WeatherAPI key

// Function to fetch and update current weather
async function fetchWeather(place) {
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${place}&lang=en`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.location && data.current) {
      // Update the UI with fetched weather data
      document.getElementById('location').textContent = `${data.location.name}, ${data.location.country}`;
      document.getElementById('temperature').textContent = Math.round(data.current.temp_c) + '°C';

      document.getElementById('feels-like').textContent = `Feels like: `+ Math.round (data.current.feelslike_c)+'°C';
      document.getElementById('description').textContent = data.current.condition.text;
      document.getElementById('humidity').textContent = `${data.current.humidity}%`;
      document.getElementById('wind-speed').textContent = `${data.current.wind_kph} km/h`;
      document.getElementById('cloud-cover').textContent = `${data.current.cloud}%`;
      document.getElementById('pressure').textContent = `${data.current.pressure_mb} mb`;
      document.getElementById('visibility').textContent = `${data.current.vis_km} km`;
      document.getElementById('uv-index').textContent = `${data.current.uv}`;


      // Add Weather Icon
      const weatherIcon = data.current.condition.icon;
      document.querySelector('.weather-icon').innerHTML = `<img src="https:${weatherIcon}" alt="Weather Icon" />`;
       // Get and display current date and time in custom format
       const currentDateTime = new Date(data.location.localtime);
       document.getElementById('date-time').textContent = currentDateTime.toLocaleString('en-US', {
         weekday: 'long', 
         day: 'numeric', 
         month: 'short', 
         year: 'numeric', 
         hour: '2-digit', 
         minute: '2-digit'
       });
     
    } else {
      alert('Could not fetch weather data. Try again later.');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Failed to load weather data.');
  }
}

// Function to fetch and display the weather forecast
async function fetchForecast(place) {
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${place}&days=10&lang=en`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.forecast && data.forecast.forecastday) {
      const forecastContainer = document.getElementById('forecast-container');
      forecastContainer.innerHTML = ''; // Clear previous forecast

      data.forecast.forecastday.forEach((day) => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
          <h4>${formatDate(day.date)}</h4>
          <p>Max: ${day.day.maxtemp_c}°C</p>
          <p>Min: ${day.day.mintemp_c}°C</p>
          <p>${day.day.condition.text}</p>
          <img src="https:${day.day.condition.icon}" alt="Weather Icon" />
        `;
        forecastContainer.appendChild(forecastItem);
      });
    } else {
      alert('Could not fetch weather forecast. Try again later.');
    }
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
  }
}


// Helper function to format dates
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short' });
}

// Event listeners
document.getElementById('search-button').addEventListener('click', () => {
  const place = document.getElementById('search-input').value;
  if (place) {
    fetchWeather(place);
    fetchForecast(place);
  } else {
    alert('Please enter a location.');
  }
});

document.getElementById('location-button').addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(`${latitude},${longitude}`);
      fetchForecast(`${latitude},${longitude}`);
    },
    (error) => {
      console.error('Geolocation error:', error);
      alert('Could not fetch your location.');
    }
  );
});
