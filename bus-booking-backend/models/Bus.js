import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  name: { type: String, required: true },
  route: { type: String, required: true }, // e.g., "Colombo-Kandy"
  departureTime: { type: String, required: true }, // e.g., "15:00" (HH:MM format)
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        // Get today's date at the start of the day (midnight UTC)
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Set to start of current day in UTC

        // Get the value's date at the start of the day (midnight UTC)
        const busDate = new Date(value);
        busDate.setUTCHours(0, 0, 0, 0); // Set to start of the bus date in UTC

        // A bus date must be today or in the future
        return busDate >= today;
      },
      message: props => `The bus date (${props.value.toISOString().split('T')[0]}) must be today or a future date.`
    }
  },
  totalSeats: { type: Number, required: true, min: 1 },
  // Removed 'availableSeats' as a stored field. It will now be a virtual property.
  price: { type: Number, required: true, min: 0 },
  // Optional: list of booked seats (for seat selection)
  bookedSeats: [{ type: Number, default: [] }], // Ensure it defaults to an empty array
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
  toJSON: { virtuals: true }, // Ensure virtuals are included when converting to JSON
  toObject: { virtuals: true } // Ensure virtuals are included when converting to object
});

// Virtual property for availableSeats
busSchema.virtual('availableSeats').get(function() {
  // 'this' refers to the current bus document
  return this.totalSeats - this.bookedSeats.length;
});

export default mongoose.model("Bus", busSchema);