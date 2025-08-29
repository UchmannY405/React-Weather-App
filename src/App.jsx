import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CitySearch from './citySearch';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';


function App() {
  return (
    <>
    <Container maxWidth='md'
      sx={{
        px: {xs:2, sm:3},
        py: {xs:1, sm:2},
      }}
    >
    <Box 
      sx={{ 
        flexGrow: 1, 
        mb: {xs: 2, sm:3, md:5},
        mt: {xs:1, sm:2}, 
      }}
    >
      <AppBar position="static">
        <Toolbar
          sx={{
            minHeight: {xs:56, sm:64},
            justifyContent: 'center'
          }}
        >
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              textAlign:'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              fontSize: {xs: '1.1rem', sm: 'inherit'},
              fontWeight: 600
          }}
        >
            My Weather App
            <WbCloudyIcon
              sx={{
                fontSize: {xs: 20, sm: 24}
              }}
            />
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
    <CitySearch />
    </Container>
    </>
  )
}

export default App
