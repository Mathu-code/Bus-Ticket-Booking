import mongoose from "mongoose";
import dotenv from "dotenv";
import Bus from "./models/Bus.js";

// Load .env variables
dotenv.config();

// Use env variable instead of hardcoded URL
const MONGO_URI = process.env.MONGO_URI;

// 2. Sample Data (same as before)
const buses = [
  {
    name: "SuperLine Express",
    route: "Colombo-Kandy",
    departureTime: "15:00",
    date: "2024-06-01",
    totalSeats: 45,
    availableSeats: 30,
    price: 1200,
    bookedSeats: [5, 8, 12, 13, 20]
  },
  {
    name: "BlueLine Travels",
    route: "Galle-Colombo",
    departureTime: "09:30",
    date: "2024-06-02",
    totalSeats: 50,
    availableSeats: 40,
    price: 900,
    bookedSeats: [2, 10]
  },
  {
    name: "Mountain Rider",
    route: "Kandy-Nuwara Eliya",
    departureTime: "07:00",
    date: "2024-06-01",
    totalSeats: 40,
    availableSeats: 38,
    price: 700,
    bookedSeats: [1, 3]
  },
  {
    name: "Night Rider Express",
    route: "Colombo-Jaffna",
    departureTime: "22:00",
    date: "2024-06-03",
    totalSeats: 55,
    availableSeats: 50,
    price: 2500,
    bookedSeats: [6, 14, 18, 35, 40]
  },
  {
    name: "Eagle Express",
    route: "Colombo-Galle",
    departureTime: "06:00",
    date: "2024-06-05",
    totalSeats: 49,
    availableSeats: 42,
    price: 1100,
    bookedSeats: [4, 7]
  },
  {
    name: "GreenLine Travels",
    route: "Negombo-Colombo",
    departureTime: "08:15",
    date: "2024-06-05",
    totalSeats: 44,
    availableSeats: 40,
    price: 350,
    bookedSeats: [1, 12]
  },
  {
    name: "RedArrow Intercity",
    route: "Colombo-Kataragama",
    departureTime: "23:30",
    date: "2024-06-06",
    totalSeats: 52,
    availableSeats: 47,
    price: 2300,
    bookedSeats: [10, 11, 12, 18, 30]
  },
  {
    name: "SkyBus Premium",
    route: "Colombo-Trincomalee",
    departureTime: "21:00",
    date: "2024-06-04",
    totalSeats: 50,
    availableSeats: 45,
    price: 2600,
    bookedSeats: [5, 9, 22]
  },
  {
    name: "CityLink Comfort",
    route: "Kandy-Colombo",
    departureTime: "13:00",
    date: "2024-06-03",
    totalSeats: 45,
    availableSeats: 44,
    price: 1200,
    bookedSeats: [15]
  },
  {
    name: "SilverJet Express",
    route: "Badulla-Colombo",
    departureTime: "05:00",
    date: "2024-06-02",
    totalSeats: 48,
    availableSeats: 40,
    price: 1900,
    bookedSeats: [2, 7, 8, 14, 21, 34]
  },
  {
    name: "Northway Travels",
    route: "Jaffna-Colombo",
    departureTime: "20:15",
    date: "2024-06-04",
    totalSeats: 55,
    availableSeats: 48,
    price: 2700,
    bookedSeats: [16, 17, 18, 25, 28, 34]
  },
  {
    name: "HillCountry Express",
    route: "Colombo-Nuwara Eliya",
    departureTime: "09:00",
    date: "2024-06-03",
    totalSeats: 45,
    availableSeats: 42,
    price: 1500,
    bookedSeats: [8, 19, 22]
  },
  {
    name: "OceanView Travels",
    route: "Matara-Colombo",
    departureTime: "07:45",
    date: "2024-06-04",
    totalSeats: 50,
    availableSeats: 47,
    price: 1000,
    bookedSeats: [3, 6, 9]
  },
  {
    name: "SunRise Express",
    route: "Kurunegala-Colombo",
    departureTime: "06:30",
    date: "2024-06-02",
    totalSeats: 40,
    availableSeats: 37,
    price: 700,
    bookedSeats: [4, 18, 20]
  }
];

// 3. Seed Function
async function seedData() {
  try {
    if (!MONGO_URI) {
      console.error("❌ MONGO_URI is missing in .env file!");
      return;
    }

    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected!");

    await Bus.deleteMany({});
    console.log("Old bus data removed.");

    await Bus.insertMany(buses);
    console.log("New bus data inserted successfully!");

    mongoose.connection.close();
    console.log("Connection Closed.");
  } catch (err) {
    console.error("Error seeding data:", err);
    mongoose.connection.close();
  }
}

seedData();
