import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";

export const createBooking = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    const { busId, seats, amount, paymentIntentId, location } = req.body;
    const userId = req.user.userId;

    if (!busId || !seats || !amount || !paymentIntentId) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ msg: "Bus not found" });

    const booking = new Booking({
      user: userId,
      bus: busId,
      seats,
      amount,
      paymentIntentId,
      paymentStatus: "paid",
      status: "confirmed",
      location: {
        type: "Point",
        coordinates: location.coordinates,
        address: location.address,
      },
    });

    await booking.save();

    bus.bookedSeats.push(...seats);
    bus.availableSeats -= seats.length;
    await bus.save();

    res.status(201).json({ msg: "Booking created", booking });
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

