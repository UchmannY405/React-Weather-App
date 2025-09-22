
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/AuthContext";

const toNumOrUndef = (v) => (v === '' || v === null || v === undefined ? undefined : v);

const schema = z
  .object({
    name: z.string().min(2, "Please enter your full name"),
    email: z.string().email("Enter a valid email"),
    city: z.string().min(1, "City is required").optional(),
    country: z.string().min(2, "Select a country").optional(),
    latitude: z.preprocess(toNumOrUndef, z.number()).optional(),
    longitude: z.preprocess(toNumOrUndef, z.number()).optional(),
  })
  .superRefine((data, ctx) => {
    const changingLocation = !!data.city || !!data.country;
    if (changingLocation) {
      if (!data.country || data.country.length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['country'], message: 'Country required when changing city' });
      }
      if (typeof data.latitude !== 'number' || Number.isNaN(data.latitude)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['latitude'], message: 'Latitude required when changing city/country' });
      }
      if (typeof data.longitude !== 'number' || Number.isNaN(data.longitude)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['longitude'], message: 'Longitude required when changing city/country' });
      }
    }
  });

export default function UserUpdate() {
  const navigate = useNavigate();
  const { user, updatedUser } = useAuth(); 

  const defaultValues = React.useMemo(
    () => ({
      name: user?.name ?? "",
      email: user?.email ?? "",
      city: user?.city ?? "",
      country: user?.country ?? "",
      latitude: user?.latitude ?? null,
      longitude: user?.longitude ?? null,
    }),
    [user]
  );

  const {
    control,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [cityOptions, setCityOptions] = React.useState([]);
  const [cityInput, setCityInput] = React.useState(defaultValues.city || "");

  React.useEffect(() => {
    const q = (cityInput || "").trim();
    if (q.length < 2) {
      setCityOptions([]);
      return;
    }

    const ac = new AbortController();
    const t = setTimeout(() => {
      (async () => {
        try {
          const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            q
          )}&limit=10&appid=${import.meta.env.VITE_CITY_API_KEY}`;
          const res = await fetch(url, { signal: ac.signal });
          const data = await res.json();
          const options = Array.isArray(data)
            ? data.map((c) => ({
                label: `${c.name}, ${c.country}`,
                city: c.name,
                country: c.country,
                latitude: Number(c.lat),
                longitude: Number(c.lon),
              }))
            : [];
          setCityOptions(options);
        } catch (err) {
          if (err?.name !== "AbortError") {
            console.warn("City lookup failed", err);
            setCityOptions([]);
          }
        }
      })();
    }, 500);

    return () => {
      clearTimeout(t);
      ac.abort();
    };
  }, [cityInput]);

  // state
  const [selectedCity, setSelectedCity] = React.useState(null);

  React.useEffect(() => {
    reset(defaultValues);
    setSelectedCity(
      defaultValues.city && defaultValues.country
        ? {
            label: defaultValues.country
              ? `${defaultValues.city}, ${defaultValues.country}`
              : defaultValues.city,
            city: defaultValues.city,
            country: defaultValues.country,
            latitude: defaultValues.latitude,
            longitude: defaultValues.longitude,
          }
        : null
    );
    setCityInput(
      defaultValues.city && defaultValues.country
        ? `${defaultValues.city}, ${defaultValues.country}`
        : defaultValues.city || ""
    );
    setValue(
      "city",
      defaultValues.city || "",
      { shouldDirty: false }
    );
    setValue("country", defaultValues.country || "", { shouldValidate: true });
    setValue("latitude", defaultValues.latitude ?? undefined, {
      shouldDirty: false,
    });
    setValue("longitude", defaultValues.longitude ?? undefined, {
      shouldDirty: false,
    });
  }, [defaultValues, reset, setValue]);

  const onSubmit = async (values) => {
    try {
      await updatedUser(
        values.email,
        values.city || user?.city,
        values.country || user?.country, 
        values.latitude ?? user?.latitude,
        values.longitude ?? user?.longitude
      );
      console.log(user)
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("root", {
        type: "server",
        message: err?.response?.data?.message || "Update failed. Try again.",
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
          Update Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Edit your contact and location. Name is read-only.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            {errors.root?.message && (
              <Alert severity="error">{errors.root.message}</Alert>
            )}

            {/* NAME — read-only */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  InputProps={{ readOnly: true }}
                  helperText="Name cannot be changed"
                  fullWidth
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message ?? " "}
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
                  value={selectedCity}
                  inputValue={cityInput}
                  onInputChange={(_, v) => setCityInput(v)}
                  onChange={(_, option) => {
                    setSelectedCity(option || null);
                    if (option) {
                      setCityInput(option.label);
                      field.onChange(option.city); 
                      setValue("country", option.country ?? "", {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setValue("latitude", option.latitude, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setValue("longitude", option.longitude, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    } else {
                      field.onChange("");
                      setValue("country", "", {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setValue("latitude", undefined, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setValue("longitude", undefined, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                  }}
                  getOptionLabel={(opt) =>
                    typeof opt === "string" ? opt : opt.label
                  }
                  isOptionEqualToValue={(opt, val) =>
                    !!val &&
                    opt.city === val.city &&
                    opt.country === val.country &&
                    opt.latitude === val.latitude &&
                    opt.longitude === val.longitude
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message ?? " "}
                      fullWidth
                    />
                  )}
                />
              )}
            />
      
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? user?.country ?? ""}
                  label="Country"
                  error={!!errors.country}
                  helperText={errors.country?.message ?? " "}
                  inputProps={{ readOnly: true }}
                  fullWidth
                />
              )}
            />

            <Controller
              name="latitude"
              control={control}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <Controller
              name="longitude"
              control={control}
              render={({ field }) => <input type="hidden" {...field} />}
            />

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button
                variant="outlined"
                type="button"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
