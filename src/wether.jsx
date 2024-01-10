import React, { useState, useEffect } from 'react';
import './App.css';

const WeatherApp = () => {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiKey = '37551e8b7a69208fe4dd1903ee6d21e3';

  useEffect(() => {
    const fetchWeatherData = async (latitude, longitude) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
        );

        if (response.ok) {
          const data = await response.json();
          setWeatherData(data);
          setError(null);
        } else {
          setWeatherData(null);
          setError('Failed to fetch weather data');
        }
      } catch (error) {
        setWeatherData(null);
        setError('Error while fetching weather data');
      } finally {
        setLoading(false);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            fetchWeatherData(latitude, longitude);
          },
          (error) => {
            setError('Error getting location');
          }
        );
      } else {
        setError('Geolocation is not supported by your browser');
      }
    };

    getLocation();
  }, [apiKey]);

  return (
    <div className="weather-app-container">
      <h1>Weather App</h1>

      {loading && <p>Loading...</p>}

      {error && <p className="error-message">{error}</p>}

      {location && (
        <div className="weather-details">
          <h2>Weather in Your Location</h2>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>

          {weatherData && (
            <>
              <p>Temperature: {Math.ceil(weatherData.main.temp - 273.15)}°C</p>
              <p>Weather: {weatherData.weather[0].description}</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Wind Speed: {weatherData.wind.speed} m/s</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;