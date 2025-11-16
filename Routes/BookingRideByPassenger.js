const express = require("express");
const Booking = require("../Model/bookingModel.js");
const Ride = require("../Model/postRide.js");
const router = express.Router();

// ----------------------------
// POST a new booking
// ----------------------------
router.post("/", async (req, res) => {
  try {
    let { rideId, passengerId, passengerName, seatsBooked } = req.body;

    if (!rideId || !passengerId || !passengerName || !seatsBooked) {
      return res.status(400).json({ error: "All fields are required" });
    }

    seatsBooked = Number(seatsBooked);

    // Find the ride
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ error: "Ride not found" });

    // Check seat availability
    if (ride.availableSeats < seatsBooked) {
      return res.status(400).json({ error: "Not enough seats available" });
    }

    // Check if user already booked this ride
    let existingBooking = await Booking.findOne({ rideId, passengerId });

    if (existingBooking) {
      // User already has a booking → increment seats
      existingBooking.seatsBooked += seatsBooked;
      await existingBooking.save();
    } else {
      // Create a new booking
      existingBooking = new Booking({
        rideId,
        driverId: ride.driverId,
        driverName: ride.driverName,
        passengerId,
        passengerName,
        seatsBooked,
        pricePerSeat: ride.pricePerSeat,
      });

      await existingBooking.save();
    }

    // Update available seats
    ride.availableSeats -= seatsBooked;
    if (ride.availableSeats === 0) ride.rideStatus = "completed";
    await ride.save();

    res.status(201).json({
      message: existingBooking ? "Seats updated in your booking" : "Booking successful",
      booking: existingBooking,
    });

  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Server error while booking ride" });
  }
});


// ----------------------------
// GET all bookings of a passenger
// ----------------------------
router.get("/passenger/:passengerId", async (req, res) => {
  try {
    const passengerId = req.params.passengerId;
    const bookings = await Booking.find({ passengerId })
      .sort({ createdAt: -1 })
      .populate("rideId"); // add ride details
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching bookings" });
  }
});

// ----------------------------
// GET all bookings of a driver
// ----------------------------
router.get("/driver/:driverId", async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const bookings = await Booking.find({ driverId })
      .sort({ createdAt: -1 })
      .populate("rideId");
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching bookings" });
  }
});

module.exports = router;
