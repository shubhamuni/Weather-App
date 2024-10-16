const key = 'ce1e7e625e1e2df65f997a491553ae59'; // Replace with your own API key

// Function to search for a city and display the result in the form
const search = async (event) => {
    const phrase = event.target.value;
    if (phrase.length === 0) return; // Prevent empty queries
    
    const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${phrase}&appid=${key}`);
    
    if (weather.ok) {
        const data = await weather.json();
        const ul = document.querySelector('form ul');
        const { lat, lon } = data.coord;
        ul.innerHTML = ''; // Clear previous search results
        ul.innerHTML += `
            <li
                data-lat="${lat}"
                data-lon="${lon}"
                data-name="${data.name}"
            >
                ${data.name} <span>${data.sys.country}</span>
            </li>`;
        console.log(data);
    } else {
        console.error('City not found');
    }
};

// Apply debounce to the search function to limit API calls
const debouncedSearch = _.debounce(search, 600);

// Attach event listener to the input field
document.querySelector('input[type="text"]').addEventListener('keyup', debouncedSearch);

// Function to fetch and display the weather details based on lat/lon
const showWeather = async (lat, lon, name) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
    
    if (response.ok) {
        const data = await response.json();
        const { temp, feels_like, humidity } = data.main;
        const wind = Math.round(data.wind.speed);
        const icon = data.weather[0].icon;

        // Update the UI with the weather data
        document.getElementById("city").innerHTML = name;
        document.getElementById("degrees").innerHTML = Math.round(temp) + '<span> &#8451</span>'; // Temperature in Celsius
        document.getElementById("feelsLikeValue").innerHTML = Math.round(feels_like) + '<span>&#8451</span>'; // Feels like temperature
        document.getElementById("windValue").innerHTML = Math.round(wind) + '<span> km/h</span>'; // Wind speed
        document.getElementById("humidityValue").innerHTML = Math.round(humidity) + "<span> %</span>"; // Humidity
        document.getElementById("icon").src = `https://openweathermap.org/img/wn/${icon}@4x.png`; // Weather icon

        // Hide the form and show the weather info
        document.querySelector('form').style.display = "none";
        document.getElementById("weather").style.display = "block";
    } else {
        console.error('Unable to fetch weather data');
    }
};

// Event listener to capture clicks on search results (list items)
document.body.addEventListener('click', (e) => {
    const li = e.target.closest('li'); // Ensure the click is on an li element
    if (li && li.dataset.lat && li.dataset.lon && li.dataset.name) {
        const { lat, lon, name } = li.dataset;
        localStorage.setItem("lat", lat)
        localStorage.setItem("lon", lon)
        localStorage.setItem("name", name)
        showWeather(lat, lon, name);
    }
});

// Event listener for the "Change city" button to reset the form
document.getElementById("change").addEventListener('click', () => {
    document.querySelector('form').style.display = "block";
    document.getElementById("weather").style.display = "none";
    // document.querySelector('form input').value = ''; // Clear search input
    // document.querySelector('form ul').innerHTML = ''; // Clear previous results
});

document.body.onload = () => {
    if (localStorage.getItem('lat')) {
        const lat = localStorage.getItem("lat");
        const lon = localStorage.getItem("lon");
        const name = localStorage.getItem("name");
        showWeather(lat, lon, name);
    }
}