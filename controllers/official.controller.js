const bcrypt = require("bcrypt");
const Official = require("../models/official_model");
const { Op } = require("sequelize");

// ==========================================
// CREATE OFFICIAL
// ==========================================

const officialCreate = async (req, res) => {
    try {
        const { name, username, password, role } = req.body;

        // Required fields validation
        if (
            !name?.trim() ||
            !username?.trim() ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required...😔"
            });
        }

        // Check if username already exists
        const existingOfficial = await Official.findOne({
            where: { username }
        });

        if (existingOfficial) {
            return res.status(409).json({
                success: false,
                message: "Username already exists...🤨"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Official
        const official = await Official.create({
            name,
            username,
            password: hashedPassword,
            role
        });

        // Remove password from response
        const officialData = official.toJSON();
        delete officialData.password;

        return res.status(201).json({
            success: true,
            message: "Official created successfully...🙂",
            data: officialData
        });

    } catch (error) {
        console.error("Official Create Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};


// ==========================================
// GET ALL OFFICIALS
// ==========================================

const officialGetAll = async (req, res) => {
    try {
        const officials = await Official.findAll({
            attributes: {
                exclude: ["password"]
            }
        });

        return res.status(200).json({
            success: true,
            message: "Officials retrieved successfully...🙂",
            count: officials.length,
            data: officials
        });

    } catch (error) {
        console.error("Official Get All Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};


// ==========================================
// GET OFFICIAL BY ID
// ==========================================

const officialGetById = async (req, res) => {
    try {
        const { id } = req.params;

        const official = await Official.findByPk(id, {
            attributes: {
                exclude: ["password"]
            }
        });

        if (!official) {
            return res.status(404).json({
                success: false,
                message: "Official not found...🤨"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Official retrieved successfully...🙂",
            data: official
        });

    } catch (error) {
        console.error("Official Get By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};


// ==========================================
// UPDATE OFFICIAL
// ==========================================

const officialUpdate = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            username,
            password,
            role
        } = req.body;

        // Required fields validation
        if (
            !name?.trim() ||
            !username?.trim() ||
            !role
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled...😔"
            });
        }

        // Check Official exists
        const official = await Official.findByPk(id);

        if (!official) {
            return res.status(404).json({
                success: false,
                message: "Official not found...🤨"
            });
        }

        // Check duplicate username
        const existingOfficial = await Official.findOne({
            where: {
                username,
                id: {
                    [Op.ne]: id
                }
            }
        });

        if (existingOfficial) {
            return res.status(409).json({
                success: false,
                message: "Username already exists...🤨"
            });
        }

        // Keep old password if new password not provided
        let hashedPassword = official.password;

        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update Official
        await official.update({
            name,
            username,
            password: hashedPassword,
            role
        });

        // Reload without password
        await official.reload({
            attributes: {
                exclude: ["password"]
            }
        });

        return res.status(200).json({
            success: true,
            message: "Official updated successfully...🙂",
            data: official
        });

    } catch (error) {
        console.error("Official Update Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};


// ==========================================
// DELETE OFFICIAL
// ==========================================

const officialDelete = async (req, res) => {
    try {
        const { id } = req.params;

        // Find Official
        const official = await Official.findByPk(id);

        if (!official) {
            return res.status(404).json({
                success: false,
                message: "Official not found...🤨"
            });
        }

        // Delete
        await official.destroy();

        return res.status(200).json({
            success: true,
            message: "Official deleted successfully...🙂"
        });

    } catch (error) {
        console.error("Official Delete Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    officialCreate,
    officialGetAll,
    officialGetById,
    officialUpdate,
    officialDelete
};