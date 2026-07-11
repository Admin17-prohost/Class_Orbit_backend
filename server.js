require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

const sequelize = require("./config/db");

// Routes
  const adminRoutes = require("./routes/admin.routes");
  const deptRoutes = require("./routes/department.routes");
// Api
  app.use("/api/admin", adminRoutes);
  app.use("/api/department", deptRoutes);

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