var cityInput = document.querySelector('#city-input');
var cityBtn = document.querySelector('#search-btn');
var cityForecastEl = document.querySelector('.city-forecast');
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
    var currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=3655ed2750f651629b08c7f61f4fd95c`;

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
var getCityForecast = function(lon, lat, city) {
    var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=0231b088137927c3d579de4869b3ea5f`;
    fetch(oneCallApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayForecast(data, city)
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
var displayForecast = function(forecast) {

    cityForecastEl.classList.remove('hide');

    var cityTemp = document.createElement('p');
    cityTemp.classList = 'pl-3 mt-3 weather-info';
    cityTemp.textContent = `Current Temperature: ${forecast.current['temp']}`;
    currentWeatherEl.appendChild(cityTemp);

    var cityHumidity = document.createElement('p');
    cityHumidity.classList = 'pl-3 weather-info';
    cityHumidity.textContent = `Humidity: ${forecast.current['humidity']}%`;
    currentWeatherEl.appendChild(cityHumidity);

    var cityWind = document.createElement('p');
    cityWind.classList = 'pl-3 weather-info';
    cityWind.textContent = `Wind Speed: ${forecast.current['wind_speed']} MPH`;
    currentWeatherEl.appendChild(cityWind);

    var cityUv = document.createElement('p');
    cityUv.classList = 'pl-3 weather-info';
    cityUv.textContent = `UV Index: ${forecast.current['uvi']}`;
    currentWeatherEl.appendChild(cityUv);

}

cityBtn.addEventListener('click', formHandler)