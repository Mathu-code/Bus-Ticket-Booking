// ...existing code...
import Bus from "../models/Bus.js";

// Create Bus (Admin)
export const createBus = async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    res.status(201).json(bus);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all buses (with optional route/date/search filter)
export const getBuses = async (req, res) => {
  try {
    const { route, date, search } = req.query; // Add 'search' query parameter
    const filter = {};

    if (route) filter.route = route;
    // Note: If 'date' in your DB is a Date object, you might need to adjust this filter for precise date range queries.
    // For direct string comparison if 'date' is stored as a specific string format (e.g., 'YYYY-MM-DD').
    if (date) filter.date = date;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } }, // Case-insensitive search on bus name
        { route: { $regex: search, $options: 'i' } }, // Case-insensitive search on route
        { status: { $regex: search, $options: 'i' } },// Case-insensitive search on status
      ];
    }

    const buses = await Bus.find(filter);
    res.json(buses);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get Bus by ID
export const getBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ msg: "Bus not found" });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update bus
export const updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bus) return res.status(404).json({ msg: "Bus not found" });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete bus
export const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ msg: "Bus not found" });
    res.json({ msg: "Bus deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};