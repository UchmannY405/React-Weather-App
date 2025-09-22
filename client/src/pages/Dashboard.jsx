import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Container,
} from "@mui/material";
import { useAuth } from '../features/AuthContext';
import { Outlet } from "react-router-dom";
import CitySearch from "../components/citySearch";
import Box from "@mui/material/Box";
import Thermostat from "@mui/icons-material/Thermostat";
import Air from "@mui/icons-material/Air";
import WaterDrop from "@mui/icons-material/WaterDrop";


const Dashboard = () => {
  const { user } = useAuth();

  const [userWeatherInfo, setUserWeatherInfo] = React.useState(null);

  React.useEffect(()=>{
    if (!user?.latitude || !user?.longitude) return; 
    const ac = new AbortController();
    const fetchUserWeather = async()=>{
    try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${user.latitude}&lon=${user.longitude}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`,
              {signal:ac.signal}
            );
            const data = await response.json();
            console.log("Weather Details",data);
            const w0 = data?.weather?.[0];
            const weatherInfo = {
              Description: w0?.description ?? "-",
              Temperature: data?.main?.temp ?? null,
              FeelsLike: data?.main?.feels_like ?? data?.main?.temp ?? null,
              Wind_Speed: data?.wind?.speed ?? null,
              Humidity: data?.main?.humidity ?? null,
              iconUrl: w0?.icon
                ? `https://openweathermap.org/img/wn/${w0.icon}@2x.png`
                : null,
            };

            setUserWeatherInfo(weatherInfo);
        }
        catch (err) {
            console.error("Error fetching weather:", err)
        }
      }
      fetchUserWeather();
      return () => ac.abort();
  },[user?.latitude,user?.longitude])

  const hours = new Date().getHours();
  const greet =
    hours < 12
      ? "Good morning"
      : hours < 18
      ? "Good afternoon"
      : "Good evening";
  return (
    <Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          // ml: { xs: 0, md: `${drawerWidth}px` },
        }}
      >
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {greet} {user?.name?.split(" ")[0] || "there"}
          </Typography>

          <Grid container direction="column" alignItems="center" sx={{ mb: 3 }}>
            <Grid item>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Here's the current weather in{" "}
                <strong>{user?.city || "your city"}</strong>.
              </Typography>
            </Grid>

            {/* KPI row */}
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
              <Grid item xs={4} sm={4} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 1.25, md: 2 },
                    textAlign: "center",
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    minHeight: { xs: 80, md: 96 },
                  }}
                >
                  <Typography variant="overline" sx={{ letterSpacing: 1 }}>
                    FEELS LIKE
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Thermostat fontSize="small" />
                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: 18, md: 20 } }}
                    >
                      {userWeatherInfo?.FeelsLike != null
                        ? `${Math.round(userWeatherInfo.FeelsLike)}°C`
                        : "—"}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={4} sm={4} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 1.25, md: 2 },
                    textAlign: "center",
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    minHeight: { xs: 80, md: 96 },
                  }}
                >
                  <Typography variant="overline" sx={{ letterSpacing: 1 }}>
                    WIND SPEED
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Air fontSize="small" />
                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: 18, md: 20 } }}
                    >
                      {userWeatherInfo?.Wind_Speed != null
                        ? `${userWeatherInfo.Wind_Speed} m/s`
                        : "—"}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={4} sm={4} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 1.25, md: 2 },
                    textAlign: "center",
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    minHeight: { xs: 80, md: 96 },
                  }}
                >
                  <Typography variant="overline" sx={{ letterSpacing: 1 }}>
                    HUMIDITY
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <WaterDrop fontSize="small" />
                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: 18, md: 20 } }}
                    >
                      {userWeatherInfo?.Humidity != null
                        ? `${userWeatherInfo.Humidity}%`
                        : "—"}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* CitySearch panel (wide, centered) */}
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
              <Card
                sx={{
                  p: 2,
                  transition: "box-shadow .2s",
                  "&:hover": { boxShadow: 3 },
                }}
              >
                <CardContent>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      mb: 2,
                      fontWeight:600,
                    }}
                    gutterBottom
                  >
                    Get Weather in Another City
                  </Typography>
                  <CitySearch />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard