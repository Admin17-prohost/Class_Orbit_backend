const bycrpt = require("bcrypt");
const sequelize = require("../config/db");
const Admin = require("../models/admin_model");

const createAdmin = async () => {
    try {
        await sequelize.authenticate();

        const hashedPassword = await bycrpt.hash("Admin@123", 10);

        await Admin.create({
            name: "Admin",
            username: "admin",
            password: hashedPassword,
            role: "ADMIN"
        });

        const existingAdmin = await Admin.findOne({
             where: { username: "admin" }
        });

        if (existingAdmin) {
            console.log("⚠️ Admin already exists.");
            process.exit();
        }


        console.log("Admin user created successfully.");
        process.exit();
    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    }
};


createAdmin();