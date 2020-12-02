var cityInput = document.querySelector('#city-input');
var cityBtn = document.querySelector('#search-btn');
var cityNameEl = document.querySelector('#city-name');
var cityArr = [];

var formHandler = function(event) {
    event.preventDefault();
    // formats city name
    var selectedCity = cityInput
        .value
        .trim()
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');

    if (selectedCity) {
        getCoords(selectedCity);
        cityInput.value = '';
    } else {
        alert('Please enter a city!');
    };
};

// uses 'current weather api' to fetch latitude and longitude
var getCoords = function(city) {
    var currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${apiKey}`;

    fetch(currentWeatherApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lon = data.coord['lon'];
                var lat = data.coord['lat'];
                getCityForecast(city, lon, lat);

                // saves searched city and refreshes recent city list
                if (document.querySelector('.city-list')) {
                    document.querySelector('.city-list').remove();
                }

                saveCity(city);
                loadCities();
            });
        } else {
            alert(`Error: ${response.statusText}`)
        }
    })
    .catch(function(error) {
        alert('Unable to load weather.');
    })
}

    // uses latitude and longitude to fetch current weather and five-day forecast
    var getCityForecast = function(city, lon, lat) {
    var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=${apiKey}`;
    fetch(oneCallApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {

                // identifies city name in forecast
                cityNameEl.textContent = `${city} (${moment().format("M/D/YYYY")})`; 

                currentForecast(data);
                fiveDayForecast(data);
            });
        }
    })
}

// displays current forecast
var currentForecast = function(forecast) {

    var forecastEl = document.querySelector('.city-forecast');
    forecastEl.classList.remove('hide');
    
    var weatherIconImg = document.querySelector('#today-icon');
    var currentIcon = forecast.current.weather[0].icon;
    weatherIconImg.setAttribute('src', `http://openweathermap.org/img/wn/${currentIcon}.png`);
    weatherIconImg.setAttribute('alt', forecast.current.weather[0].main)

    var currentTemp = Math.round(forecast.current['temp']);
    document.querySelector('#current-temp').textContent = currentTemp;

    var currentFeelsLike = Math.round(forecast.current['feels_like']);
    document.querySelector('#current-feels-like').textContent = currentFeelsLike;

    var currentHigh = Math.round(forecast.daily[0].temp.max);
    document.querySelector('#current-high').textContent = currentHigh;

    var currentLow = Math.round(forecast.daily[0].temp.min);
    document.querySelector('#current-low').textContent = currentLow;

    var currentCondition = forecast.current.weather[0].description
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
    document.querySelector('#current-condition').textContent = currentCondition;

    var currentHumidity = forecast.current['humidity'];
    document.querySelector('#current-humidity').textContent = currentHumidity;

    var currentWind = forecast.current['wind_speed'];
    document.querySelector('#current-wind-speed').textContent = currentWind;

    var uviSpan = document.querySelector('#current-uvi')
    var currentUvi = forecast.current['uvi'];
    uviSpan.textContent = currentUvi;

    // styles UV index
    switch (true) {
        case (currentUvi <= 2):
            uviSpan.className = 'badge badge-success';
            break;
        case (currentUvi <= 5):
            uviSpan.className = 'badge badge-warning';
            break;
        case (currentUvi <=7):
            uviSpan.className = 'badge badge-danger';
            break;
        default:
            uviSpan.className = 'badge text-light';
            uviSpan.setAttribute('style', 'background-color: #553C7B');
    }
}

// displays five day forecast
var fiveDayForecast = function(forecast) { 

    for (var i = 1; i < 6; i++) {
        var dateP = document.querySelector('#date-' + i);
        dateP.textContent = moment().add(i, 'days').format('M/D/YYYY');

        var iconImg = document.querySelector('#icon-' + i);
        var iconCode = forecast.daily[i].weather[0].icon
        iconImg.setAttribute('src', `http://openweathermap.org/img/wn/${iconCode}.png`)
        iconImg.setAttribute('alt', forecast.daily[i].weather[0].main)

        var tempSpan = document.querySelector('#temp-' + i);
        tempSpan.innerHTML = `${Math.round(forecast.daily[i].temp.day)} &deg;F`;

        var lowSpan = document.querySelector('#low-' + i);
        lowSpan.textContent = Math.round(forecast.daily[i].temp.min);

        var humiditySpan = document.querySelector('#humidity-' + i);
        humiditySpan.textContent = forecast.daily[i].humidity;
    }
}

// saves cities into local storage
var saveCity = function(city) {

    // prevents duplicate cities from being saved
    for (var i = 0; i < cityArr.length; i++) {
        if (city === cityArr[i]) {
            cityArr.splice(i, 1);
        }
    }

    cityArr.push(city);
    localStorage.setItem('cities', JSON.stringify(cityArr));
}

// loads cities from local storage
var loadCities = function() {
    cityArr = JSON.parse(localStorage.getItem('cities'));

    if (!cityArr) {
        cityArr = [];
        return false;
    } else if (cityArr.length > 5) {
        // only saves the five most recent cities
        cityArr.shift();
    }

    var recentCities = document.querySelector('#recent-cities');
    var cityListUl = document.createElement('ul');
    cityListUl.className = 'list-group list-group-flush city-list';
    recentCities.appendChild(cityListUl);

    for (var i = 0; i < cityArr.length; i++) {
        var cityListItem = document.createElement('button');
        cityListItem.setAttribute('type', 'button');
        cityListItem.className = 'list-group-item';
        cityListItem.setAttribute('value', cityArr[i]);
        cityListItem.textContent = cityArr[i];
        cityListUl.prepend(cityListItem);
    }

    var cityList = document.querySelector('.city-list');
    cityList.addEventListener('click', selectRecent)
}

var selectRecent = function(event) {
    var clickedCity = event.target.getAttribute('value');
    getCoords(clickedCity);
}

loadCities();

cityBtn.addEventListener('click', formHandler)

cityInput.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        cityBtn.click();
    }
});


//        /((((((\\\\
//======((((((((((\\\\\
//     ((           \\\\\\\
//     ( (*    _/      \\\\\\\
//       \    /  \      \\\\\\________________
//        |  |   |       </                  ((\\\\
//        o_|   /        /                      \ \\\\    \\\\\\\
//             |  ._    (                        \ \\\\\\\\\\\\\\\\
//            | /                       /       /    \\\\\\\     \\
//     .______/\/     /                 /       /         \\\
//    / __.____/    _/         ________(       /\
//   / / / ________/`_________'         \     /  \_
//  / /  \ \                             \   \ \_  \
// ( <    \ \                             >  /    \ \
//  \/     \\_                           / /       > )
//          \_|                         / /       / /
//                                    _//       _//
//                                   /_|       /_|