var cityInput = document.querySelector('#city-input');
var cityBtn = document.querySelector('#search-btn');
var forecastEl = document.querySelector('.city-forecast');
var currentWeatherEl = document.querySelector('.current-weather');
var cityNameEl = document.querySelector('.city-name');

var formHandler = function(event) {
    event.preventDefault();
    var selectedCity = cityInput.value.trim();

    if (selectedCity) {
        getCoords(selectedCity);
        cityInput.value = '';
    } else {
        alert('Please enter a city!');
    }
}

// uses 'current weather api' to pull latitude and longitude
var getCoords = function(city) {
    var currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=91d7d61a609221126ce94454c32c2e3d`;

    fetch(currentWeatherApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lon = data.coord['lon'];
                var lat = data.coord['lat'];

                formatCityName(city);
                getCityForecast(lon, lat);
            });
        } else {
            alert(`Error: ${response.statusText}`)
        }
    })
    .catch(function(error) {
        alert('Unable to load weather.');
    })
}

    // uses latitude and longitude to pull current weather and five-day forecast
    var getCityForecast = function(lon, lat) {
    var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=91d7d61a609221126ce94454c32c2e3d`;
    fetch(oneCallApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // fiveDayForecast(data);
                currentForecast(data);
            });
        }
    })
}

// formats and displays city name
var formatCityName = function(city) {
    var cityName = city.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');

    cityNameEl.textContent = `${cityName} at ${moment().format("h:mm A on M/D/YYYY")}`;
}

// displays forecast for city
var currentForecast = function(forecast) {

    forecastEl.classList.remove('hide');

    var currentTemp = forecast.current['temp'];
    document.querySelector('#current-temp').textContent = currentTemp;

    var currentHumidity = forecast.current['humidity'];
    document.querySelector('#current-humidity').textContent = currentHumidity;

    var currentWind = forecast.current['wind_speed'];
    document.querySelector('#current-wind-speed').textContent = currentWind;

    var uviSpan = document.querySelector('#current-uvi')
    var currentUvi = forecast.current['uvi'];
    uviSpan.textContent = currentUvi

    // styles UV index
    if (currentUvi <= 2) {
        uviSpan.className = 'badge badge-success';
    } else if (currentUvi <= 5) {
        uviSpan.className ='badge badge-warning';
    } else if (currentUvi <= 7) {
        uviSpan.className = 'badge badge-danger';
    } else {
        uviSpan.className = 'badge text-light';
        uviSpan.setAttribute('style', 'background-color: #553C7B')
    }
}

cityBtn.addEventListener('click', formHandler)