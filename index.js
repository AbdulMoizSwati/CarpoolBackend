const express = require("express");
const Connect = require("./connection/connection.js");
const signup = require("./Routes/SignUpRoute.js");
const bcrypt = require("bcrypt");
const User = require("./Model/LoginModel.js");
const loginRouter = require("./Routes/login.js");
const RidePoster = require("./Routes/postRide.js");
const FetchPendingRideRouter = require("./Routes/GetPendngRides.js");
const updateProfile  = require("./Routes/UpdateRoute.js");
const availableRides = require("./Routes/fetchAllRides.js");
const BookRideByPassenger = require("./Routes/BookingRideByPassenger.js");
require('dotenv').config();

const port = process.env.PORT || 8001 ;




const app = express();
Connect();

// Middleware to parse JSONs
app.use(express.json());

// ✅ Log every incoming request
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} request received on ${req.url}`);
  next();
});

// -----------------------------
// Signup Route
// -----------------------------
app.use("/api/users/signup",signup);
app.use("/api/users/login",loginRouter);
app.use("/api/users/postRide",RidePoster);
app.use("/api/users/pendingrides",FetchPendingRideRouter);
app.use("/api/users", updateProfile);
app.use("/api/availabeRides",availableRides);
app.use("/api/BookRide",BookRideByPassenger);



  
 

app.listen(port, () => {
  console.log(`🚀 Server is listening on the port:${port}`);
});
