// RegisterForm.jsx
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@mui/material";
import { publicApi } from "../api";


const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(6, "Min 6 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
  city: z.string().min(2, "Enter a valid city"),
  country: z.string().min(2, "Select a country"),
  latitude: z.number({ required_error: "Latitude missing" }),
  longitude: z.number({ required_error: "Longitude missing" }),
});

function RegisterForm({ onSuccess }) {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      city: "",
      country: "",
      latitude: undefined,
      longitude: undefined,
    },
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });


const [cityOptions, setCityOptions] = React.useState([]);
const [cityInput, setCityInput] = React.useState("");

React.useEffect(() => {
  const q = (cityInput || "").trim();

  if (q.length < 2) 
  {
    setCityOptions([]);
    return;
  }
  const ac = new AbortController();
  const cityTimeoutCall = setTimeout(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=10&appid=${
            import.meta.env.VITE_CITY_API_KEY
          }`, {signal: ac.signal}
        );
        const data = await res.json();
        console.log("API response:", data);
        const cities = data.map((city) => ({
          label: `${city.name}, ${city.country}`,
          city:city.name,
          country:city.country,
          latitude: Number(city.lat),
          longitude: Number(city.lon),
        }));
        setCityOptions(cities);
      } catch (err) {
        if(err?.name === 'AbortError') return;
        console.log("Unable to fetch cities", err);
        setCityOptions([]);
      }
    })();
  }, 1000);
  return () => {
    clearTimeout(cityTimeoutCall) //reset timeout if cityInput changes inside debouce window
    ac.abort(); //aborts old fetch with multiple key strokes
  }
}, [cityInput]);


  

  const onSubmit = async (values) => {
    clearErrors("root");
    try {
      const res = await publicApi.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        city: values.city,
        country: values.country,
        latitude: values.latitude,
        longitude: values.longitude,
      });
      navigate("/login")
    } catch (err) {
      const status = err?.response?.status;
      const code = err?.response?.data?.code;

      // Examples: map server errors to fields
      if (status === 409 || code === "USER_EXISTS") {
        setError("email", {
          type: "server",
          message: "Email is already registered",
        });
        return;
      }

      if (status === 400 && code === "WEAK_PASSWORD") {
        setError("password", { type: "server", message: "Password too weak" });
        return;
      }

      // Fallback root error
      setError("root", {
        type: "server",
        message: "Registration failed. Please try again.",
      });
    }
  };

  return (
    <Container
      maxWidth="sm"
      disableGutters
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        px: 2,
        pt: { xs: 6, sm: 8 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 480,
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          p: { xs: 2.5, sm: 3.5 },
          mx: "auto",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
          Create your account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter your details to get started.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ width: "100%" }}
        >
          <Stack spacing={2}>
            {errors.root?.message && (
              <Alert severity="error">{errors.root.message}</Alert>
            )}

            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Name"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="email"
                  label="Email"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Password"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="city"
              control={control}
              render={({ field, fieldState }) => (
                <Autocomplete
                  options={cityOptions}
                  getOptionLabel={(opt) =>
                    typeof opt === "string" ? opt : opt.label
                  }
                  onInputChange={(_, newInput) => setCityInput(newInput)}
                  onChange={(_, option) => {
                    if (option && typeof option === "object") {
                      field.onChange(option.city);
                      setValue("country", option.country ?? "", { shouldValidate: true });
                      setValue("latitude", option.latitude, { shouldValidate: true });
                      setValue("longitude", option.longitude, { shouldValidate: true });
                    } else {
                      field.onChange("");
                      setValue("country", "");
                      setValue("latitude", undefined);
                      setValue("longitude", undefined);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  )}
                />
              )}
            />

            <Controller
              name="country"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Country"
                  InputProps={{ readOnly: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />

            <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth>
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterForm;
