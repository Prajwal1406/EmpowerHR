const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db.js");
const employeedb = require("./models/Employee.js");
const employeeRoutes = require("./routes/employeeRoutes");
const app = express();
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/employees", employeeRoutes);

connectDb();

app.get("/", (req, res) => {
  res.send("Backend is Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
