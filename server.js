require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
app.use(express.json());

//Database
const sequelize = require("./config/db");

//Import All models
require("./models");

// Routes
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const deptRoutes = require("./routes/department.routes");
const subjectRoutes = require("./routes/subject.routes");
const staffRoutes = require("./routes/staff.routes");
const hodRoutes = require("./routes/hod.routes");
const officialRoutes = require("./routes/official.routes");
const classRoutes = require("./routes/class.routes");
const timebleRoutes = require("./routes/timetable.routes");
const periodRoutes = require("./routes/period.routes");
const dayOrderRoutes = require("./routes/dayOrder.routes");
const calendarRoutes = require("./routes/calendar.routes");




// APIs
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/department", deptRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/hod", hodRoutes);
app.use("/api/period", periodRoutes);
app.use("/api/official", officialRoutes);
app.use("/api/class", classRoutes);
app.use("/api/timetable", timebleRoutes);
app.use("/api/day-order", dayOrderRoutes);
app.use("/api/calendar", calendarRoutes);

// 🔥 Sync & authentication to Database
const startServer = async () => {
  try {
    //Check DB Connection
    await sequelize.authenticate();
    console.log("Database Connected....✅");

    // Sync all Models
    await sequelize.sync({alter: true});
    console.log("Database Synced...✅");

    //Start Server
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server Running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("❌ Database/Server Error: ", err);
  }
};


startServer();

module.exports = app;