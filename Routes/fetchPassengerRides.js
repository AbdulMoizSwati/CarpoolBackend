const express = require("express");
const Booking = require("../Model/booking.js");
const Ride = require("../Model/postRide.js");
const router = express.Router();

// 📌 GET recent rides for a passenger
router.get("/:passengerId", async (req, res) => {
  const { passengerId } = req.params;

  try {
    // 1️⃣ Fetch all bookings of this passenger
    let bookings = await Booking.find({ passengerId })
      .sort({ createdAt: -1 }) // latest first
      .lean();

    // 2️⃣ Fetch ride details for each booking (manual populate)
    const rideIds = bookings.map((b) => b.rideId);
    const ridesMap = {};

    const rides = await Ride.find({ _id: { $in: rideIds } }).lean();

    // Convert rides to a map for quick lookup
    rides.forEach((ride) => {
      ridesMap[ride._id] = ride;
    });

    // 3️⃣ Merge ride details inside each booking
    const response = bookings.map((booking) => ({
      ...booking,
      rideDetails: ridesMap[booking.rideId] || null,
    }));

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching recent bookings:", err);
    res.status(500).json({ error: "Server error while fetching recent rides" });
  }
});

module.exports = router;
