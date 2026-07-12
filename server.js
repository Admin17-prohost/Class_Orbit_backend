require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

const sequelize = require("./config/db");

// Routes
  const authRoutes = require("./routes/auth.routes");
  const deptRoutes = require("./routes/department.routes");
  const subjectRoutes = require("./routes/subject.routes");
// Api
  app.use("/api/auth", authRoutes);
  app.use("/api/department", deptRoutes);
  app.use("/api/subject", subjectRoutes);

// 🔥 Sync & authentication to Database

sequelize.authenticate()
.then(()=> console.log("Database Connected...✅"))
.catch(err => console.log("Database Connected faild...❌"));

require("./models");

  sequelize.sync() 
    .then(() => {
        console.log("✅ Database synced");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => { console.log(`🚀 Server Running on port ${PORT}`); 
      
      });
        
    })
    .catch((err) => {
        console.error("❌ Sync error:", err);
    });

    

module.exports = app;