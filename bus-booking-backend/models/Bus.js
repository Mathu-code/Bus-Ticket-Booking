import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  name: { type: String, required: true },
  route: { type: String, required: true }, // e.g., "Colombo-Kandy"
  departureTime: { type: String, required: true }, // e.g., "15:00"
  date: { type: String, required: true }, // e.g., "2024-06-01"
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  price: { type: Number, required: true },
  // Optional: list of booked seats (for seat selection)
  bookedSeats: [{ type: Number }],
});

export default mongoose.model("Bus", busSchema);
