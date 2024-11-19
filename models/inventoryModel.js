import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    inventoryType: {
      type: String,
      required: [true, "Inventory type is required"],
      enum: ["In", "Out"],
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    email: {
      type: String,
      required: [true, "Donor/Hospital Email is required"],
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "Organization is required"],
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: function () {
        return this.inventoryType === "Out";
      },
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: function () {
        return this.inventoryType === "In";
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);
