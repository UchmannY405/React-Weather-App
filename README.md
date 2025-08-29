# 🌦️ My Weather App

A simple, responsive weather application built with **React** and **Material UI (MUI)**.  
Users can search for a city, select from suggestions, and view current weather details such as temperature, wind speed, humidity, and description with an icon.

---

## 🚀 Features

- 🔍 **City Search with Autocomplete**  
  Type in a city name and get dynamic suggestions powered by the OpenWeather Geocoding API.

- 🏙️ **City Selection**  
  Selecting a suggestion updates the input automatically.

- ☁️ **Weather Fetch**  
  Clicking the search button fetches current weather details (via the OpenWeather API).

- 📄 **Weather Display**  
  Results are shown in a responsive **MUI Paper component** with:
  - Description + weather icon  
  - Temperature in °C  
  - Wind speed (m/s)  
  - Humidity (%)  

- 📱 **Responsive UI**  
  Works seamlessly across desktop and mobile with adaptive layouts.

---

## 🛠️ Tech Stack

- **React (Vite)** — front-end framework  
- **Material UI (MUI)** — UI components and styling  
- **OpenWeather API** — weather and geocoding data  
- **JavaScript (ES6+)**

---

## ⚙️ How It Works

1. A user types a city → updates the `text` state.  
2. This triggers a fetch for matching cities → updates the `cityOptions` state.  
3. When a user selects a city → it updates the `selectedCity` and input.  
4. Clicking the search button → fetches weather details for the selected city.  
5. Weather details are stored in `weatherDetails` state and displayed in a Paper card.

---

## 📸 Screenshots

![Autocomplete Search Feature](./src/App_Screenshots/Autcomplete%20Search%20Feature.jpg)  
![Mobile App view](./src/App_Screenshots/Mobile%20View.jpg)
![Desktop view](./src/App_Screenshots/Desktop%20View.jpg)  

---

## 🔑 Environment Variables

This project requires API keys from [OpenWeather](https://openweathermap.org/api).  
Create a `.env` file in the root directory and add:

```bash
VITE_CITY_API_KEY=your_api_key_here
VITE_WEATHER_API_KEY=your_api_key_here

---

```

---

## 📚 What I Learned

- How to integrate third-party APIs (OpenWeather) into a React project.  
- Managing multiple pieces of state (`text`, `cityOptions`, `selectedCity`, `weatherDetails`) effectively.  
- Using **Material UI** components (`Autocomplete`, `Paper`, `Box`, `Typography`) with responsive styling (`sx` prop).  
- Debouncing API calls with `setTimeout` inside `useEffect`.  
- Structuring a project for both desktop and mobile responsiveness.

---

## 💡 Future Improvements

- 🔐 Add backend support for user authentication with personalized dashboards (planned).
- ⭐ Save favorite cities in localStorage for quick access.  
- 🔄 Refresh weather data automatically every few minutes.  
- 🌑 Add dark mode toggle for better UX.  



## ▶️ Getting Started

Clone the repository:

```bash
git clone https://github.com/<your-username>/my-weather-app.git
cd my-weather-app
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to the local development URL shown in your terminal (usually `http://localhost:5173`).

