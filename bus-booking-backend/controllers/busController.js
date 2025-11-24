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

// Get all buses (with optional route/date filter)
export const getBuses = async (req, res) => {
  try {
    const { route, date } = req.query;
    const filter = {};
    if (route) filter.route = route;
    if (date) filter.date = date;
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
