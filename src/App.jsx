import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
function App() {
  return (
    <>
    <Container maxWidth='md'>
    <Box sx={{ flexGrow: 1, marginBottom: 10, marginTop: 5}}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign:'center'}}>
            My Weather App
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
    </Container>
    </>
  )
}

export default App
