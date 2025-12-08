import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";

// Create booking after payment
export const createBooking = async (req, res) => {
  try {
    const { busId, seats, amount, paymentIntentId, location } = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!busId || !seats || !amount || !paymentIntentId) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ msg: "Invalid seats selection" });
    }

    if (!location) {
      return res.status(400).json({ msg: "Location is required" });
    }

    // Verify bus exists
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ msg: "Bus not found" });
    }

    // Check seat availability
    const unavailableSeats = seats.filter(seat => bus.bookedSeats.includes(seat));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ msg: `Seats ${unavailableSeats.join(", ")} are not available` });
    }

    // Create booking with location
    const booking = new Booking({
      user: userId,
      bus: busId,
      seats,
      amount,
      paymentIntentId,
      status: "confirmed",
      paymentStatus: "paid",
      location: {
        type: "Point",
        coordinates: location.coordinates, // [lng, lat]
        address: location.address
      }
    });

    await booking.save();

    // Update bus booked seats
    bus.bookedSeats.push(...seats);
    bus.availableSeats -= seats.length;
    await bus.save();

    res.status(201).json({ msg: "Booking created successfully", booking });
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Book Ticket
export const bookTicket = async (req, res) => {
  try {
    const { busId, seats, amount, location } = req.body;
    const userId = req.user.userId;

    // Check bus exists
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ msg: "Bus not found" });

    // Check seats available
    if (seats.some(seat => bus.bookedSeats.includes(seat)))
      return res.status(400).json({ msg: "One or more seats already booked" });

    if (bus.availableSeats < seats.length)
      return res.status(400).json({ msg: "Not enough seats available" });

    // Update bus seats
    bus.bookedSeats.push(...seats);
    bus.availableSeats -= seats.length;
    await bus.save();

    // Create booking
    const booking = new Booking({
      user: userId,
      bus: busId,
      seats,
      amount,
      location: {
        type: "Point",
        coordinates: location.coordinates,
        address: location.address
      }
    });
    await booking.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get user bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).populate("bus");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

