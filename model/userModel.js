const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    trim: true,
    maxlength: [40, "Name can be maximum of 40 length"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "invalid email"],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: {
      values: ["user", "guide", "lead-guide", "admin"],
      message: "Invalid user role must be either suer,guide,lead-guide,admin",
    },
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password can be minimum of 08 length"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candiatePassword,
  userPassword,
) {
  return await bcrypt.compare(candiatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JwtTimestamp < changedTimestamp; // 100 < 200
  }

  // false means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
