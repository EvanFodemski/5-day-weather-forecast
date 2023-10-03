
// Global constants called throughout the page
const apiKey = "e3d9d5f565cabd82c720d5e91db63868";
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchCity');
const historyButtons = document.getElementById('historyButtons');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const headerText = document.getElementById('header-text');

//recognizes what was typed in the search bar and button
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const searchTerm = searchInput.value.trim();
    if (searchTerm !== '') {
        getCurrentConditions(searchTerm);
        // getFiveDayForeCast(searchTerm);
        saveToLocalStorage(searchTerm);
        searchInput.value = '';
    }
});
// search history buttons to lead to the right spot
historyButtons.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        getCurrentConditions(event.target.textContent);
        getFiveDayForeCast(event.target.textContent);
    }
});


//saves searches to local storage
function saveToLocalStorage(city) {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    renderSearchHistory(searchHistory);
}
// shows search history
function renderSearchHistory(history) {
    historyButtons.innerHTML = '';
    history.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        historyButtons.appendChild(button);
    });
}
// Pulls the current conditions from the api for selected city
function getCurrentConditions(city) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${apiKey}`;
    fetch(queryURL)
    .then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
    })
    .then(response => {
        renderCurrentWeather(response);
        getForecast(response.coord.lat, response.coord.lon);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
// gets forecast for selected city
function getForecast(latitude, longitude) {
   console.log(latitude , longitude);
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
    fetch(forecastURL)
    .then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
    })
    
    .then(data => {
        // console.log(data);
        renderForecast(data.list);
    
    })

    .catch(error => {
        console.error('Error:', error);
    });
}
//renders boxes shown on page with search history
function renderCurrentWeather(data) {
    const iconURL = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    const dateTime = moment.unix(data.dt).format("(MM/DD/YY)");
    const html = `
        <h3>${data.name} ${dateTime} <img src="${iconURL}"></h3>
        <ul class="list-unstyled">
            <li>Temperature: ${data.main.temp}&#8457;</li>
            <li>Humidity: ${data.main.humidity}%</li>
            <li>Wind Speed: ${data.wind.speed} mph</li>
        </ul>`;
    currentWeatherDiv.innerHTML = html;
    headerText.textContent = data.name;
}
// assits the function renderCurrentWeather
function renderForecast(dailyData) {
    forecastDiv.innerHTML = ''; // Clear previous content
    
    for (var i = 0; i < dailyData.length; i += 8) {
        const day = dailyData[i];
        const iconURL = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`;
        const date = moment.unix(day.dt).format("MM/DD/YY");
        const temperature = day.main.temp.toFixed(2);
        const humidity = day.main.humidity;
        const windSpeed = day.wind.speed.toFixed(2);

        // Create a new box for each day
        const fiveDayBoxes = document.createElement('div');
        fiveDayBoxes.className = 'fiveDayBoxes';
        fiveDayBoxes.innerHTML = `
            <h5>${date}</h5>
            <img src="${iconURL}" alt="${day.weather[0].description}">
            <p>Temperature: ${temperature}&#8457;</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} mph</p>
        `;

        forecastDiv.appendChild(fiveDayBoxes); // Append the box to the forecastDiv
    }
}

// Load search history from localStorage when the page loads
window.addEventListener('load', function() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    renderSearchHistory(searchHistory);
    if (searchHistory.length > 0) {
        getCurrentConditions(searchHistory[searchHistory.length - 1]);
    }
});
//pulls information for the 5 day forecast
function getFiveDayForeCast (city){
    
    
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    fetch(queryURL)
    .then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
    })
    .then(data => {
        renderForecast(data.weekly);
         } )
         .catch(error => {
            console.error('Error:', error);
        });
    }
//renders 5 day forecast
    function renderFiveDayForecast(forecastData) {
        forecastDiv.innerHTML = '';
        for (let i = 0; i < forecastData.length; i += 8) {
            const day = forecastData[i];
            const iconURL = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`;
            const date = moment.unix(day.dt).format("MM/DD/YY");
            const html = `
                <div class="forecast-card">
                    <h5>${date}</h5>
                    <img src="${iconURL}" alt="${day.weather[0].description}">
                    <p>Temp: ${day.main.temp}&#8457;</p>
                    <p>Humidity: ${day.main.humidity}%</p>
                </div>`;
            forecastDiv.innerHTML += html;
        }
    }





