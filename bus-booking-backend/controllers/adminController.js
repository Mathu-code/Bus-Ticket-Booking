import User from "../models/User.js";
import Bus from "../models/Bus.js";
import Booking from "../models/Booking.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBuses = await Bus.countDocuments();

    const paidBookings = await Booking.find({ paymentStatus: "paid" });
    const totalPaidMoney = paidBookings.reduce(
      (sum, b) => sum + b.amount,
      0
    );

    // User registrations per month
    const users = await User.find();
    const userRegistrations = {};

    users.forEach(user => {
      const month = user.createdAt.toLocaleString("default", {
        month: "short",
        year: "numeric"
      });
      userRegistrations[month] = (userRegistrations[month] || 0) + 1;
    });

    // Bus status (simple example)
    const buses = await Bus.find();
    const busStatus = {
      Active: buses.length,
      Inactive: 0
    };

    res.json({
      totalUsers,
      totalBuses,
      totalPaidMoney,
      userRegistrations: Object.entries(userRegistrations).map(
        ([month, count]) => ({ month, count })
      ),
      busStatus
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
