const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/db");

//-------------Models--------------------//
const User = require("./models/User");
const HOD = require("./models/HOD");
const Staff = require("./models/Staff");
const Department = require("./models/Department");
const ClassRoom = require("./models/ClassRoom");
const Subject = require("./models/Subject");
const Room = require("./models/Room");
const SubjectAllocation = require("./models/SubjectAllocation");
const Timetable = require("./models/Timetable");
const Document = require("./models/Document");
const Setting = require("./models/Setting");
const Notification = require("./models/Notification");

//-------------Routes--------------------//
const authRoutes = require("./routes/authRoutes");
const hodRoutes = require("./routes/hodRoutes");
const staffRoutes = require("./routes/staffRoutes");
const userRoutes = require("./routes/userRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const classRoutes = require("./routes/classRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const roomRoutes = require("./routes/roomRoutes");
const subjectAllocationRoutes = require("./routes/subjectAllocationRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const documentRoutes = require("./routes/documentRoutes");
const settingRoutes = require("./routes/settingRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


const app = express();

app.use(cors());
app.use(express.json());

//-------------APIs--------------------//
app.get("/", (req, res) => {
  res.send("Class Orbit Backend Running... 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/hods", hodRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/subject-allocations", subjectAllocationRoutes);
app.use("/api/timetables", timetableRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(async () => {
    console.log("Database connected successfully ✅");

    await sequelize.sync({ alter: true });
    console.log("Database synced 🔃");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });