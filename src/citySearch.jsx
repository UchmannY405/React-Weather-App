import { useState } from 'react'
import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button';
function CitySearch() {

    const [cityOptions, setCityOptions] = useState([]);
    const [text, setText] = useState('');
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
    return (
        <>
        <Autocomplete
        freeSolo
        options={cityOptions}
        
        inputValue={text}
        onInputChange={(e, newInputValue) => setText(newInputValue)}
      />
      </>
      
    )
  }
  
  export default CitySearch
