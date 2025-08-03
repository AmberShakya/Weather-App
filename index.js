const input = document.getElementById('locationName');
const suggestionsList = document.getElementById('suggestions');
const loading = document.getElementById('loading');
const output = document.getElementById('output');
const forecastContainer = document.getElementById('forecastContainer');

// === VOICE INPUT ===
function startVoiceSearch() {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Voice recognition not supported');
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    getweather();
  };
}


// === AUTOCOMPLETE ===
input.addEventListener('input', async () => {
  const query = input.value.trim();
  if (query.length < 2) {
    suggestionsList.innerHTML = '';
    renderRecentSearches(); // Show recent on blank
    return;
  }

  try {
    const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5`, {
      headers: {
        'X-RapidAPI-Key': '8c5951e3b9msh891d1a522e52753p1f3495jsn50bcbeaa4230',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    });

    const data = await response.json();
    suggestionsList.innerHTML = '';

    data.data.forEach(city => {
      const li = document.createElement('li');
      li.textContent = `${city.name}, ${city.countryCode}`;
      li.addEventListener('click', () => {
        input.value = city.name;
        suggestionsList.innerHTML = '';
        getweather();
      });
      suggestionsList.appendChild(li);
    });
  } catch (err) {
    console.error('Autocomplete error:', err);
  }
});

// === DARK MODE ===
document.getElementById('themeToggle').addEventListener('change', () => {
  document.body.classList.toggle('dark');
});

// === ON PAGE LOAD ===
window.addEventListener('DOMContentLoaded', () => {
  renderRecentSearches();

  const lastCity = localStorage.getItem('lastCity');
  if (lastCity) {
    input.value = lastCity;
    getweather();
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=98c5e5c671f25d157c42acfabb13b4d5&units=metric`);
      const data = await res.json();
      input.value = data.name;
      getweather();
    });
  }
  renderRecentSearches();
});

// === GET WEATHER ===
window.getweather = async function () {
  const location = input.value.trim();
  if (!location) return;
  localStorage.setItem('lastCity', location);
  updateRecentSearches(location);

  // Reset animations
  output.classList.remove('fade-in');
  forecastContainer.classList.remove('fade-in');
  void output.offsetWidth;
  void forecastContainer.offsetWidth;

  output.style.display = 'none';
  forecastContainer.style.display = 'none';
  loading.style.display = 'block';

  try {
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=98c5e5c671f25d157c42acfabb13b4d5&units=metric`);
    const weather = await weatherRes.json();

    loading.style.display = 'none';
    output.style.display = 'block';

    if (weather.cod !== 200) {
      output.innerHTML = `<span style="color:red">${weather.message}</span>`;
      return;
    }

    const iconURL = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    const bgClass = weather.weather[0].main.toLowerCase();
    document.body.className = '';
    document.body.classList.add(bgClass);

    output.innerHTML = `
      <h2>${weather.name}</h2>
      <img src="${iconURL}" alt="${weather.weather[0].description}" />
      <p><b>Temperature:</b> ${weather.main.temp}°C</p>
      <p><b>Feels Like:</b> ${weather.main.feels_like}°C</p>
      <p><b>Humidity:</b> ${weather.main.humidity}%</p>
      <p><b>Condition:</b> ${weather.weather[0].description}</p>
    `;
    output.classList.add('fade-in');

    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&cnt=24&appid=98c5e5c671f25d157c42acfabb13b4d5&units=metric`);
    const forecast = await forecastRes.json();

    if (forecast.cod === "200") {
      const daily = forecast.list.filter((_, i) => i % 8 === 0);
      forecastContainer.innerHTML = `<h3>3-Day Forecast</h3><div class="forecast-row">${daily.map(day => {
        const date = new Date(day.dt * 1000);
        return `
          <div class="forecast-card">
            <div>${date.toDateString().split(' ').slice(0, 3).join(' ')}</div>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
            <div>${day.main.temp}°C</div>
          </div>
        `;
      }).join('')}</div>`;
      forecastContainer.style.display = 'block';
      forecastContainer.classList.add('fade-in');
    }

  } catch (err) {
    console.error('Weather load error:', err);
    loading.textContent = 'Failed to load weather data.';
  }
};

// === RECENT SEARCHES LOGIC ===
function updateRecentSearches(city) {
  let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
  searches = searches.filter(item => item !== city);
  searches.unshift(city);
  if (searches.length > 5) searches.pop();
  localStorage.setItem('recentSearches', JSON.stringify(searches));
  renderRecentSearches();
}

function renderRecentSearches() {
  const recentList = document.getElementById('recent-searches');
  if (!recentList) return;

  const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
  recentList.innerHTML = ''; // Clear old entries

  searches.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    li.classList.add('recent-search-item');
    li.addEventListener('click', () => {
      input.value = city;
      getweather();
    });
    recentList.appendChild(li);
  });
}

