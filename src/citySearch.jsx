import { useState } from 'react'
import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper';
import { List, ListItem } from '@mui/material';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
function CitySearch() {

    const [cityOptions, setCityOptions] = useState([]);
    const [text, setText] = useState('');
    const [selectedCity, setSelectedCity] = useState('')
    const [weatherDetails, setWeatherDetails] = useState(null);
    
    React.useEffect (() => {
        const cityTimeoutCall = setTimeout(() => { 
            ( async () => {
            try {
            const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=10&appid=${import.meta.env.VITE_CITY_API_KEY}`);
            const data = await response.json();
            console.log("API response:", data)
            const cities = data.map(city => ({
                label: `${city.name}, ${city.country}`,
                latitude: city.lat,
                longitude: city.lon
            }) );
            setCityOptions(cities);
            }
            catch (err) {
                console.log("Unable to fetch cities", err)
            }
        }

        )()},1000)
        return () => clearTimeout(cityTimeoutCall);
    },[text])

    const fetchWeatherByCity = async (city) => {

        if (city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.latitude}&lon=${city.longitude}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`);
            const data = await response.json();
            console.log("Weather Details",data);
            const weatherInfo = {
                Description: data.weather[0].description,
                Temperature: data.main.temp,
                Wind_Speed: data.wind.speed,
                Humidity : data.main.humidity,
                iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            }

            setWeatherDetails(weatherInfo);
        }
        catch (err) {
            console.error("Error fetching weather:", err)
        }
    }
    } 
    return (
        <>
        <Autocomplete
        freeSolo
        options={cityOptions}
        
        inputValue={text}
        onInputChange={(e, newInputValue) => setText(newInputValue)}
        value={selectedCity}
        onChange={(e, newInputValue) => {
          if (newInputValue !== null) setSelectedCity(newInputValue);
        }}
        sx={{ width: 400, margin:'auto', marginBottom:10}}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search City"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                {params.InputProps.endAdornment}
                <InputAdornment position="end">
                  <IconButton onClick={() => fetchWeatherByCity(selectedCity || text)}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
                </>
              )
            }}
          />
        )}
      />
      {weatherDetails && (
      <Paper elevation={3} style={{ padding: '1rem'}}>
        <h2>Weather Details</h2>
        <List>
          <ListItem>
            <strong>Description: </strong> {weatherDetails.Description}  <img src={weatherDetails.iconUrl} alt="Weather icon" />
          </ListItem>
          <ListItem>
           <strong>Temperature: </strong> {weatherDetails.Temperature}˚C
          </ListItem>
          <ListItem>
            <strong>Wind Speed: </strong> {weatherDetails.Wind_Speed} m/s
          </ListItem>
          <ListItem>
            <strong>Humidity: </strong> {weatherDetails.Humidity}%
          </ListItem>
        </List>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
           variant="text"
           endIcon={<CancelIcon />}
           onClick={() => setWeatherDetails(null)}
          >
          Close
          </Button>
        </Box>
      </Paper>
      )}
      </>
      
    )
  }
  
  export default CitySearch
