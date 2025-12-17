import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  seats: [{ type: Number, required: true }],
  status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["paid", "failed"], default: "paid" },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    },
    address: { type: String }
  }
}, { timestamps: true });

bookingSchema.index({ location: "2dsphere" });

export default mongoose.model("Booking", bookingSchema);

