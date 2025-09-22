
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name is too long"],
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minlength: [2, "Enter a valid city"],
      maxlength: [100, "City name is too long"],
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is missing"],
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is missing"],
    },

    country: {
      type: String,
      required: [true, "Country is required"],
      uppercase: true, 
      trim: true,
      minlength: [2, "Use 2-letter country code"],
      maxlength: [2, "Use 2-letter country code"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, 
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);


userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.createJWT = async function () {
  return await jwt.sign(
    { user_id: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

userSchema.methods.verifyPassword = async function (userPassword) {
  const isCorrectPassword = await bcrypt.compare(userPassword, this.password); 
  return isCorrectPassword;
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
