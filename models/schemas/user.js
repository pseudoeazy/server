const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: "First Name is required",
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      trim: true,
      required: "Last Name is required",
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      trim: true,
      required: "Email is required",
      max: 255,
      min: 6,
    },
    password: {
      type: String,
      required: "Password is required",
      max: 1024,
      min: 6,
    },
    seller: {
      type: Boolean,
      default: false,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

UserSchema.virtual("fullName")
  .set(function (fullName) {
    const name = fullName.split(" ");
    this.firstName = name[0];
    this.lastName = name[1];
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

UserSchema.virtual("setInitials")
  .set(function (fullName) {
    const [firstName, lastName] = fullName.split(" ");
    this.initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
  })
  .get(function () {
    return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
  });

module.exports = mongoose.model("User", UserSchema);
