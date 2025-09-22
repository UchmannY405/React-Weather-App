const { z, email } = require("zod");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email");
const passwordSchema = z
  .string()
  .min(6, "Min 6 characters")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number");

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: emailSchema,
  password: passwordSchema,
  city: z.string().trim().min(2, "Enter a valid city"),
  country: z
    .string()
    .trim()
    .length(2, "Use 2-letter country code")
    .transform((c) => c.toUpperCase()),
  latitude: z.number({ required_error: "Latitude missing" }),
  longitude: z.number({ required_error: "Longitude missing" }),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).optional(),
    city: z.string().trim().min(2).optional(),
    email: emailSchema.optional(),
    country: z
      .string()
      .trim()
      .length(2, "Use 2-letter country code")
      .transform((c) => c.toUpperCase())
      .optional(),
    latitude: z.coerce.number().optional(), // ← coerce
    longitude: z.coerce.number().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
};
