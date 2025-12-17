import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";
import User from "../models/User.js"; // Import User model to get user email and username
import { sendBookingConfirmationEmail } from "../utils/emailService.js"; // Import email service
import { generateBookingPdf } from "../utils/pdfGenerator.js"; // Import PDF generator
// Removed 'import { Readable } from 'stream';' as it's no longer needed for PDF generation


export const createBooking = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    const { busId, seats, amount, paymentIntentId, location } = req.body;
    const userId = req.user.userId;

    // Enhanced validation for location
    if (!busId || !seats || !amount || !paymentIntentId || !location || !location.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2 || !location.address) {
      return res.status(400).json({ msg: "Missing or invalid required fields for booking or location" });
    }

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ msg: "Bus not found" });

    // Ensure we have user details for email
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found for booking" });

    // Check seat availability before creating booking
    if (seats.some(seat => bus.bookedSeats.includes(seat))) {
      return res.status(400).json({ msg: "One or more seats already booked" });
    }
    if (bus.availableSeats < seats.length) {
      return res.status(400).json({ msg: "Not enough seats available" });
    }

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
        coordinates: location.coordinates, // [longitude, latitude]
        address: location.address,
      },
    });

    await booking.save();

    // Update bus seats
    bus.bookedSeats.push(...seats);
    bus.availableSeats -= seats.length;
    await bus.save();

    // --- Start: New code for PDF and Email ---

    // Prepare booking details for PDF generation
    // IMPORTANT: Adjust these fields based on your actual User and Bus model schemas
    const bookingDetailsForPdf = {
      _id: booking._id.toString(), // Convert ObjectId to string
      userName: user.name,     // Assuming 'name' field in User model
      userEmail: user.email,       // Assuming 'email' field in User model
      busName: bus.name,           // Assuming 'name' field in Bus model    
      busRoute: bus.route,         // Assuming 'route' field in Bus model
      busDepartureTime: bus.departureTime, // Assuming 'departureTime' in Bus model
      seats: booking.seats,
      amount: booking.amount,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      location: booking.location,
      createdAt: booking.createdAt,
    };

    // Generate PDF Buffer by listening to the PDFDocument instance's events
    const pdfBuffer = await new Promise((resolve, reject) => {
      const doc = generateBookingPdf(bookingDetailsForPdf); // Get the PDFDocument instance
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));
      // doc.end() is called inside generateBookingPdf, which triggers the 'data' and 'end' events.
    });

    // Send email with PDF attachment
    const emailSubject = `Your Bus Ticket Booking Confirmation - ID: ${booking._id}`;
    const emailHtmlContent = `
      <h1>Booking Confirmed!</h1>
      <p>Dear ${user.name},</p>
      <p>Your bus ticket booking has been successfully confirmed with the following details:</p>
      <ul>
        <li><b>Booking ID:</b> ${booking._id}</li>
        <li><b>Bus:</b> ${bus.name} </li>
        <li><b>Route:</b> ${bus.route}</li>
        <li><b>Seats:</b> ${seats.join(', ')}</li>
        <li><b>Total Amount Paid:</b> Rs. ${amount.toFixed(2)}</li>
        <li><b>Departure Location:</b> ${location.address}</li>
      </ul>
      <p>Please find your detailed booking confirmation attached as a PDF to this email.</p>
      <p>Thank you for booking with us!</p>
      <p>Best regards,<br>The BusGo Team</p>
    `;

    // Await the email sending to ensure it's attempted
    await sendBookingConfirmationEmail(
      user.email,
      emailSubject,
      emailHtmlContent,
      [{
        filename: `Booking_Confirmation_${booking._id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      }]
    );

    // --- End: New code for PDF and Email ---

    res.status(201).json({ msg: "Booking created and confirmation email sent", booking });
  } catch (err) {
    console.error("Booking creation error:", err);
    // Be careful not to expose sensitive error details in production
    res.status(500).json({ msg: "Error creating booking or sending confirmation: " + err.message });
  }
};

// Book Ticket - This endpoint seems to be a duplicate of createBooking for booking flow,
// consider consolidating or clarifying its purpose. If it's for initial booking
// without payment, it might not need the email/PDF logic.
export const bookTicket = async (req, res) => {
  try {
    const { busId, seats, amount, location } = req.body;
    const userId = req.user.userId;

    if (!location || !location.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2 || !location.address) {
      return res.status(400).json({ msg: "Missing or invalid location details" });
    }

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
    console.error("Book Ticket error:", err); // Added console.error for consistency
    res.status(500).json({ msg: err.message });
  }
};

// Get user bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).populate("bus");
    res.json(bookings);
  } catch (err) {
    console.error("Get My Bookings error:", err); // Added console.error for consistency
    res.status(500).json({ msg: err.message });
  }
};