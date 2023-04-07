const searchEl = document.querySelector('#search-bar');
const historyEl = document.querySelector('#search-history')
const weatherCard = document.querySelector('#weather-card');
const forecastCard = document.querySelector('#forecast-card');
const apiKey = '63c7862af6c52934f6ce9e8cd836cf3a';

const searchHistory = []
let currentCity = ''

// functions to update and display the search history
const updateHistory = (cityName) => {
  if (searchHistory > 5) {
    searchHistory.pop()
  }
  searchHistory.push(cityName)
  displayHistory();
};

const displayHistory = () => {
  historyEl.innerHTML = searchHistory.map((search) => {`<p>${search}<p>`});
};

// Function to get the City Coords
const getWeatherPosition = async (cityName) => {
  await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`)
  .then(response => {return response.json()})
  .then(data => {
    currentCity = data[0].name
    getForecast(data);
    getFiveDayForecast(data);
  }).catch((err) => {console.log(err)});
};

// Function to render the day of forecast
const getForecast = (data) => {
  let lat = data[0].lat;
  let lon = data[0].lon;
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
  .then(response => {return response.json()})
  .then(data => {
    let { icon } = data.weather[0];
    let { temp, humidity } = data.main;
    let windSpeed = data.wind.speed;
    console.log(currentCity, icon, temp, humidity, windSpeed);
    weatherCard.innerHTML = ''
    weatherCard.innerHTML =
      ` <div class="card-header" id="weather-type">
          <img class="card-img-top" id="weather-icon" src='https://openweathermap.org/img/wn/${icon}.png' alt="..." />
          <h3 class="card-title" id="weather-temp">${temp}°</h3>
          <h4 class="card-subtitle" id="weather-city">${currentCity}</h4>
          <p class='card-subtitle' id='weather-wind'>Wind: ${windSpeed} mph</p>
          <p class="card-title" id="weather-humidity">Humidity: ${humidity}%</p>
          <p class="card-subtitle" id="date"></p>
        </div>
      `
})};

// Function to Get and Render the Five Day Forecast
const getFiveDayForecast = (data) => {
  let { lat, lon } = data[0];
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
  .then(response => {return response.json()})
  .then(data => {
    forecastCard.innerHTML = '';
    for (i = 2; i < data.list.length; i += 8) {
      forecastCard.innerHTML += `
        <div id="forecast" class="card" style="width: 18rem;">
          <div id="icon"  class="card-text">
            <img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png">
          </div>
          <div class="card-body">
            <p id="date" class="card-text forecast-date">${data.list[i].dt_txt.replace("12:00:00","")}</p>
            <p id="temp" class="card-text forecast-temp">${data.list[i].main.temp}</p>
            <p id="wind" class="card-text forecast-wind">${data.list[i].wind.speed}</p>
            <p id="humidity" class="card-text forecast-humidity">${data.list[i].main.humidity}</p>
          </div>
        </div>
      `;
    }
  }).catch((err) => {console.log(err)});
};

// Event Handler for the Search Bar 'Click' Event
const searchSubmit = (event) => {
  event.preventDefault();
  getWeatherPosition(searchEl.value);
  updateHistory(searchEl.value);
};

//Event Listener for the Search Bar
document.querySelector("#submit").addEventListener("click", searchSubmit);