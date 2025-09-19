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
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ maxWidth: 420 }}
    >
      <Stack spacing={2}>
        {errors.root?.message && (
          <Alert severity="error">{errors.root.message}</Alert>
        )}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message ?? " "}
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
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message ?? " "}
              fullWidth
            />
          )}
        />
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </Stack>

      <Typography>
        Don't have an account? 
        <Link to={'/register'}>Sign up</Link>
      </Typography>
    </Box>
  );
}

export default LoginForm;
