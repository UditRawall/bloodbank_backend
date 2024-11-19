import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["Admin", "Organization", "Donor", "Hospital"],
    },
    name: {
      type: String,
      required: function () {
        if (this.role === "Donor" || this.role === "Admin") {
          return true;
        }
        return false;
      },
    },
    organizationName: {
      type: String,
      required: function () {
        if (this.role === "Organization") {
          return true;
        }
        return false;
      },
    },
    hospitalName: {
      type: String,
      required: function () {
        if (this.role === "Hospital") {
          return true;
        }
        return false;
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone Number is required"],
    },
  },
  { timestamps: true }
);

// here 'Users' is the model name
const Users = mongoose.model("Users", userSchema);

export default Users;
