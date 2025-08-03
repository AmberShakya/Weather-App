# 🌤️ Weather App

A sleek, responsive Progressive Web App (PWA) that shows real-time weather updates and 3-day forecasts using OpenWeather API and GeoDB city autocomplete.

🔗 **Live Demo**: [https://ambershakya.github.io/Weather-App/](https://ambershakya.github.io/Weather-App/)

---

## ✨ Features

- 🔍 **City Autocomplete**: Suggestions as you type using GeoDB API
- 📍 **Auto-location**: Detects your location on first load
- 🌦️ **Current Weather**: Temperature, humidity, description, and more
- 📅 **3-Day Forecast**: Clean card layout with icons and date
- 🌙 **Dark Mode Toggle**: Simple light/dark UI switch
- 🔌 **Offline Support**: Thanks to a Service Worker
- 📲 **Responsive Design**: Works well on desktop and mobile
- 💾 **City Persistence**: Remembers last searched city using localStorage

---

## 🔧 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**:
  - [OpenWeatherMap API](https://openweathermap.org/api)
  - [GeoDB Cities API (via RapidAPI)](https://rapidapi.com/wirefreethought/api/geodb-cities)
- **PWA**: Service Worker, Cache API
- **Deployment**: GitHub Pages

---

## 🗂️ Project Structure

Weather-App/
├── index.html # Main HTML file
├── index.css # Stylesheet with responsive design
├── index.js # Weather + autocomplete logic
├── service-worker.js # Offline caching
├── favicon.ico # App icon
└── assets/

