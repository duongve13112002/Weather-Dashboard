document.getElementById('search-button').addEventListener('click', function() {
    let city = document.getElementById('city-input').value;
    fetchWeatherData(city);
});

document.getElementById('location-button').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            fetchWeatherDataByLocation(lat, lon);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function fetchWeatherData(city) {
    fetch(`/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                displayWeatherData(data);
            }
        })
        .catch(error => console.error('Error:', error));
}

function fetchWeatherDataByLocation(lat, lon) {
    fetch(`/weatherlocation?lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                displayWeatherData(data);
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayWeatherData(data) {
    let currentWeather = document.getElementById('current-weather');
    currentWeather.innerHTML = `
        <div class="weather-details">
            <h2>${data.location.name} (${data.current.last_updated})</h2>
            <p>Temperature: ${data.current.temp_c}°C</p>
            <p>Wind: ${data.current.wind_kph} KPH</p>
            <p>Humidity: ${data.current.humidity}%</p>
        </div>
        <div class="weather-icon">
            <img src="${data.current.condition.icon}" alt="${data.current.condition.text}">
            <p>${data.current.condition.text}</p>
        </div>
    `;
    
    let forecast = document.getElementById('forecast');
    forecast.innerHTML = '';
    
    let lastFourDays = data.forecast.forecastday.slice(-4);
    lastFourDays.forEach(day => {
        forecast.innerHTML += `
            <div class="forecast-day">
                <h3>${day.date}</h3>
                <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
                <p>Temp: ${day.day.avgtemp_c}°C</p>
                <p>Wind: ${day.day.maxwind_kph} KPH</p>
                <p>Humidity: ${day.day.avghumidity}%</p>
            </div>
        `;
    });
}


document.getElementById('subscribe-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let email = document.getElementById('email-input').value;
    fetch('/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
               },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});