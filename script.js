document.addEventListener('DOMContentLoaded', () => {
    const weatherContainer = document.getElementById('weather-container');

    function getWeatherIcon(wmoCode) {
        const icons = {
            0: 'wi-day-sunny',
            1: 'wi-day-cloudy',
            2: 'wi-cloudy',
            3: 'wi-cloudy-gusts',
            45: 'wi-fog',
            48: 'wi-fog',
            51: 'wi-showers',
            53: 'wi-showers',
            55: 'wi-showers',
            61: 'wi-rain',
            63: 'wi-rain',
            65: 'wi-rain',
            80: 'wi-rain',
            81: 'wi-rain',
            82: 'wi-rain',
            95: 'wi-thunderstorm',
            96: 'wi-thunderstorm',
            99: 'wi-thunderstorm'
        };
        return icons[wmoCode] || 'wi-na';
    }

    function getDayName(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }

    function fetchWeather(lat, lon) {
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                weatherContainer.innerHTML = '';
                data.daily.time.forEach((date, index) => {
                    const dayCard = document.createElement('div');
                    dayCard.className = 'weather-day';

                    const dayName = document.createElement('h2');
                    dayName.textContent = getDayName(date);

                    const icon = document.createElement('i');
                    const wmoCode = data.daily.weathercode[index];
                    icon.className = `wi ${getWeatherIcon(wmoCode)}`;

                    const temp = document.createElement('p');
                    temp.className = 'temp';
                    const maxTemp = data.daily.temperature_2m_max[index];
                    const minTemp = data.daily.temperature_2m_min[index];
                    temp.textContent = `${Math.round(minTemp)}° / ${Math.round(maxTemp)}°`;

                    dayCard.appendChild(dayName);
                    dayCard.appendChild(icon);
                    dayCard.appendChild(temp);

                    weatherContainer.appendChild(dayCard);
                });
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherContainer.innerHTML = '<p>Could not fetch weather data.</p>';
            });
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                fetchWeather(position.coords.latitude, position.coords.longitude);
            }, () => {
                weatherContainer.innerHTML = '<p>Geolocation is not supported by this browser or permission was denied.</p>';
                // Fallback to a default location (e.g., London)
                fetchWeather(51.5074, -0.1278);
            });
        } else {
            weatherContainer.innerHTML = '<p>Geolocation is not supported by this browser.</p>';
            // Fallback to a default location
            fetchWeather(51.5074, -0.1278);
        }
    }

    getLocation();
});