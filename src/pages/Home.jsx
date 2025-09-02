import { useState } from "react";
import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import { List, ListItem } from "@mui/material";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
function Home() {
  const [cityOptions, setCityOptions] = useState([]);
  const [text, setText] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [weatherDetails, setWeatherDetails] = useState(null);

  React.useEffect(() => {
    const cityTimeoutCall = setTimeout(() => {
      (async () => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=10&appid=${
              import.meta.env.VITE_CITY_API_KEY
            }`
          );
          const data = await response.json();
          console.log("API response:", data);
          const cities = data.map((city) => ({
            label: `${city.name}, ${city.country}`,
            latitude: city.lat,
            longitude: city.lon,
          }));
          setCityOptions(cities);
        } catch (err) {
          console.log("Unable to fetch cities", err);
        }
      })();
    }, 1000);
    return () => clearTimeout(cityTimeoutCall);
  }, [text]);

  const fetchWeatherByCity = async (city) => {
    if (city) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${
            city.latitude
          }&lon=${city.longitude}&appid=${
            import.meta.env.VITE_WEATHER_API_KEY
          }&units=metric`
        );
        const data = await response.json();
        console.log("Weather Details", data);
        const weatherInfo = {
          Description: data.weather[0].description,
          Temperature: data.main.temp,
          Wind_Speed: data.wind.speed,
          Humidity: data.main.humidity,
          iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        };

        setWeatherDetails(weatherInfo);
      } catch (err) {
        console.error("Error fetching weather:", err);
      }
    }
  };
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
        sx={{
          width: { xs: "100%", sm: 480 },
          margin: "auto",
          maxWidth: "100%",
          //mx: 'auto',
          //marginBottom: 10,
          mb: { xs: 3, sm: 5 },
        }}
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
                    <IconButton
                      onClick={() => fetchWeatherByCity(selectedCity || text)}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                </>
              ),
            }}
          />
        )}
      />
      {weatherDetails && (
        <Box sx={{ px: { xs: 1.5, sm: 0 } }}>
          <Paper
            elevation={3}
            sx={{
              //padding: "1rem",
              p: { xs: 2, sm: 3, md: 4 },
              maxWidth: 800,
              width: "100%",
              mx: { xs: "auto", sm: "auto" },
              borderRadius: 2,
              boxSizing: "border-box",
              overflowWrap: "anywhere",
            }}
          >
            <Box sx={{ mb: { xs: 1, sm: 2 } }}>
              <Box
                component="h2"
                sx={{
                  m: 0,
                  fontWeight: 700,
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  lineHeight: 1.3,
                }}
              >
                Weather Details
              </Box>
            </Box>
            <List
              sx={{
                p: 0,
                "& .MuiListItem-root": {
                  px: 0,
                  py: { xs: 0.5, sm: 1 },
                  alignItems: "center",
                  flexWrap: "wrap",
                },
                "& strong": {
                  marginRight: 0.5,
                },
              }}
            >
              <ListItem
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <strong>Description: </strong>
                <span>{weatherDetails.Description}</span>
                <Box
                  component="img"
                  src={weatherDetails.iconUrl}
                  alt="Weather icon"
                  sx={{
                    width: { xs: 36, sm: 48 },
                    height: "auto",
                    ml: 1,
                  }}
                />
              </ListItem>
              <ListItem>
                <strong>Temperature: </strong>
                <span>{weatherDetails.Temperature}˚C</span>
              </ListItem>
              <ListItem>
                <strong>Wind Speed: </strong>
                <span>{weatherDetails.Wind_Speed} m/s</span>
              </ListItem>
              <ListItem>
                <strong>Humidity: </strong>
                <span>{weatherDetails.Humidity}%</span>
              </ListItem>
            </List>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="text"
                endIcon={<CancelIcon />}
                onClick={() => setWeatherDetails(null)}
                sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              >
                Close
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </>
  );
}

export default Home;

/*
  1. A user types a city (text state).
  2. this is used to fetch the city options based on the text (city options state)
  3. when the user selects a city (selectedCity state), this automatically becomes the text state
  4. when the user clicks the search button, its used to fetch the waether details which is display on the 
  paper (weatherDetails state);
  */
