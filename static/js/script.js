document.getElementById('search-button').addEventListener('click', function() {
    let city = document.getElementById('city-input').value;
    fetchWeatherData(city);
    addToCityHistory(city);
});
document.getElementById('clear-history-button').addEventListener('click', function() {
    clearCityHistory();
});
let cityHistory = [];


function clearCityHistory() {
    cityHistory = [];
    displayCityHistory();
    toggleClearHistoryButton();
}

function toggleClearHistoryButton() {
    let clearHistoryButton = document.getElementById('clear-history-button');
    if (cityHistory.length > 0) {
        clearHistoryButton.style.display = 'block';
    } else {
        clearHistoryButton.style.display = 'none';
    }
}

function addToCityHistory(city) {
    if (!cityHistory.includes(city)) {
        cityHistory.push(city);
    }
    displayCityHistory();
    toggleClearHistoryButton();
}

function displayCityHistory() {
    let historyContainer = document.getElementById('city-history');
    historyContainer.innerHTML = '<strong>City History:</strong> ';
    
    cityHistory.forEach((city, index) => {
        let link = document.createElement('span');
        link.classList.add('city-history-item');
        link.textContent = city;
        link.addEventListener('click', function() {
            // console.log('City clicked:', city);
            fetchWeatherData(city);
        });
        
        if (index < cityHistory.length - 1) {
            historyContainer.appendChild(link);
            historyContainer.innerHTML += ', ';
        } else {
            historyContainer.appendChild(link);
        }
    });
}


document.getElementById('location-button').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            fetchWeatherDataByLocation(lat, lon);
            addToCityHistory("Current Location");
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

function loadMoreForecast() {
    fetch(`/load_more_forecast`)
        .then(response => response.json())
        .then(data => {
	    if (data.error) {
                alert(data.error);
            } else {
                renderForecast(data, true); // Append new forecast data
            } 
    
        })
        .catch(error => console.error('Error loading more forecast:', error));
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
    
    let lastFourDays = data.forecast.forecastday.slice(1, 5);
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

    if (forecast.innerHTML != '') {
        document.getElementById('load-more-btn').style.display = 'block';
    }
}


function renderForecast(data, append = false) {
    const forecastContainer = document.getElementById('forecast');
    if (!append) {
        forecastContainer.innerHTML = '';
    }
    let forecast  = data.forecast.forecastday.slice(-4);

    let rows = Math.ceil(forecast.length / 4);
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'forecast-row';
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        for (let j = 0; j < 4; j++) {
            let dayIndex = i * 4 + j;
            if (dayIndex < forecast.length) {
                const day = forecast[dayIndex];
                const forecastElement = document.createElement('div');
                forecastElement.className = 'forecast-day';
                forecastElement.innerHTML = `
                    <h3>${day.date}</h3>
                    <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
                    <p>Temp: ${day.day.avgtemp_c}°C</p>
                    <p>Wind: ${day.day.maxwind_kph} KPH</p>
                    <p>Humidity: ${day.day.avghumidity}%</p>
                `;
                row.appendChild(forecastElement);
            }
        }
        forecastContainer.appendChild(row);
    }
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
