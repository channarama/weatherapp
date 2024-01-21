import React, { useState, useEffect } from 'react';
import './App.css';

const apiKey = '37551e8b7a69208fe4dd1903ee6d21e3';

const WeatherApp = () => {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCity, setSearchCity] = useState('');

  const fetchWeatherData = async (latitude, longitude) => {
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
      setSearchCity('');
    }
  };

  const getCityName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0 && data[0].name) {
          const cityName = data[0].name;
          setLocation({ latitude, longitude, cityName });
        } else {
          setError('Failed to fetch city name');
        }
      } else {
        setError('Failed to fetch city name');
      }
    } catch (error) {
      setError('Error while fetching city name');
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getCityName(latitude, longitude);
        },
        (error) => {
          setError('Error getting location');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const searchWeatherByCity = async () => {
    if (searchCity.toLowerCase() === 'mylocation') {
     
      getLocation();
      setSearchCity('');
    } else if (searchCity) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}`
        );

        if (response.ok) {
          const data = await response.json();
          setWeatherData(data);
          setError(null);
          setLoading(false);
          setLocation({ latitude: data.coord.lat, longitude: data.coord.lon, cityName: data.name });
        } else {
          setWeatherData(null);
          setError('Failed to fetch weather data');
          setLoading(false);
        }
      } catch (error) {
        setWeatherData(null);
        setError('Error while fetching weather data');
        setLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchWeatherByCity();
    }
  };

  useEffect(() => {
    getLocation();
  }, [apiKey]);

  useEffect(() => {
    if (location) {
      fetchWeatherData(location.latitude, location.longitude);
    }
  }, [location, apiKey]);

  const kelvinToCelsius = (kelvin) => {
    return kelvin - 273.15;
  };

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}.png`;
  };

  return (
    <div className={`weather-app-container ${loading ? 'loading' : ''}`}>
     <h1 className="h1">patel.com</h1>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {location && !loading && (
        <div className="weather-details">
          <h2 className='h2'>Weather in {location.cityName || 'Your Location'}</h2>
          <p className="location-info">Latitude: {location.latitude}</p>
          <p className="location-info">Longitude: {location.longitude}</p>
          <div className="search-bar">
        <input
        
          type="text"
          placeholder="Enter city name"
          value={searchCity}
          className='i1'
          onChange={(e) => setSearchCity(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={() => searchWeatherByCity()}>Search</button>
      </div>
          {weatherData && (
            <div className="weather-sections">
              <div className="weather-section">
                <h3>Temperature</h3>
                <p className="temperature">{Math.round(kelvinToCelsius(weatherData.main.temp))}°C</p>
              </div>
              <div className="weather-section">
                <h3>Weather Description</h3>
                <p>{weatherData.weather[0].description}</p>
                {weatherData.weather[0].icon && (
                  <img src={getWeatherIcon(weatherData.weather[0].icon)} alt="Weather Icon" />
                )}
              </div>
              <div className="weather-section">
                <h3>Humidity</h3>
                <p>{weatherData.main.humidity}%</p>
              </div>
              <div className="weather-section">
                <h3>Wind Speed</h3>
                <p>{weatherData.wind.speed} m/s</p>
              </div>
            </div>
          )}
        </div>
      )}

      
    </div>
  );
};

export default WeatherApp;
