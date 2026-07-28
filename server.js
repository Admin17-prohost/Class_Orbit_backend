require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

//Database
const sequelize = require("./config/db");

//Import All models
require("./models");

// Routes
  const authRoutes = require("./routes/auth.routes");
  const deptRoutes = require("./routes/department.routes");
  const subjectRoutes = require("./routes/subject.routes");

// APIs
  app.use("/api/auth", authRoutes);
  app.use("/api/department", deptRoutes);
  app.use("/api/subject", subjectRoutes);

// 🔥 Sync & authentication to Database
const startServer = async() => {
  try{
    //Check DB Connection
    await sequelize.authenticate();
    console.log("Database Connected....✅");

    // Sync all Models
    await sequelize.sync();
    console.log("Database Synced...✅");

    //Start Server
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server Running on port ${process.env.PORT}`);
    });
  } catch(err){
    console.error("❌ Database/Server Error: ", err);
  }
};

startServer();    

module.exports = app;