import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    access_token: {
      type: String,
    },
    provider_account_id: {
      type: String,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    provider: {
      type: String,
      default: "credentials",
    },
    repositories: [
      {
        name: {
          type: String,
        },
        full_name: {
          type: String,
        },
        webhook_status: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
