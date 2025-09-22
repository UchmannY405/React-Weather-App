// LoginForm.jsx
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useAuth } from "../features/AuthContext";
import { Link, useNavigate } from "react-router-dom";
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters"),
});

function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const onSubmit = async (values) => {
    try {
      console.log("[login] submit", values.email);
      await login(values.email, values.password);
      navigate('/dashboard');
    } 
    catch (err) {
      const status = err?.response?.status;
      const code = err?.response?.data?.code;
      if (status === 401 || code === "INVALID_CREDENTIALS") {
        setError("password", {
          type: "server",
          message: "Invalid email or password",
        });
      } else {
        setError("root", {
          type: "server",
          message: "Login failed. Try again.",
        });
      }
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
        pt: { xs: 6, sm: 8 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          p: { xs: 2.5, sm: 3.5 },
          mx: "auto",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, mb: 0.5, textAlign: "left" }}
        >
          Sign in
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Welcome back. Please enter your details.
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            {errors.root?.message && (
              <Alert severity="error">{errors.root.message}</Alert>
            )}
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
                  InputProps={{
                    inputProps: { inputMode: "email" },
                  }}
                  size="medium"
                  margin="dense"
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message ?? " "}
                  fullWidth
                  size="medium"
                  margin="dense"
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </Stack>
        </Box>
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Don&apos;t have an account? <Link to={"/register"}>Sign up</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default LoginForm;
