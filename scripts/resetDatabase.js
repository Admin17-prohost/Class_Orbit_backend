require("dotenv").config();

const sequelize = require("../config/db");

const resetDatabase = async () => {
  try {
    console.log("🔄 Starting database reset...");

    // Connect to database
    await sequelize.authenticate();
    console.log("Database Connected...✅");

    // Drop all tables
    await sequelize.drop();
    console.log("All tables dropped...🗑️");

    // Recreate all tables
    await sequelize.sync();
    console.log("All tables recreated...✅");

    console.log("🎉 Database reset completed successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Database reset failed:");
    console.error(error);

    process.exit(1);
  }
};

resetDatabase();