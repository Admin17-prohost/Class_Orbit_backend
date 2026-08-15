const bcrypt = require("bcrypt");
const Class = require("../models/class_model");
const Department = require("../models/department_model");
const { Op } = require("sequelize");

// ==========================================
// CREATE CLASS / STUDENT LOGIN
// ==========================================

const classCreate = async (req, res) => {
    try {
        const {
            username,
            password,
            year,
            semester,
            departmentId,
            role
        } = req.body;

        // Required fields validation
        if (
            !username?.trim() ||
            !password ||
            !year ||
            !semester ||
            !departmentId
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields are required...😔"
            });
        }

        // Check Department
        const department = await Department.findByPk(departmentId);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found...🤨"
            });
        }

        // Check username
        const existingClass = await Class.findOne({
            where: { username }
        });

        if (existingClass) {
            return res.status(409).json({
                success: false,
                message: "Username already exists...🤨"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create
        const newClass = await Class.create({
            username,
            password: hashedPassword,
            year,
            semester,
            departmentId,
            role: role || "STUDENT"
        });

        // Remove password from response
        const classData = newClass.toJSON();
        delete classData.password;

        return res.status(201).json({
            success: true,
            message: "Class login created successfully...🙂",
            data: classData
        });

    } catch (error) {
        console.error("Class Create Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};


// ==========================================
// GET ALL CLASS LOGINS
// ==========================================

const classGetAll = async (req, res) => {
    try {

        const classes = await Class.findAll({
            attributes: {
                exclude: ["password"]
            },
            include: [
                {
                    model: Department,
                    attributes: ["id", "name", "code"]
                }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Class logins retrieved successfully...🙂",
            count: classes.length,
            data: classes
        });

    } catch (error) {
        console.error("Class Get All Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};


// ==========================================
// GET CLASS BY ID
// ==========================================

const classGetById = async (req, res) => {
    try {

        const { id } = req.params;

        const classData = await Class.findByPk(id, {
            attributes: {
                exclude: ["password"]
            },
            include: [
                {
                    model: Department,
                    attributes: ["id", "name", "code"]
                }
            ]
        });

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class login not found...🤨"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Class login retrieved successfully...🙂",
            data: classData
        });

    } catch (error) {
        console.error("Class Get By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};


// ==========================================
// UPDATE CLASS LOGIN
// ==========================================

const classUpdate = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            username,
            password,
            year,
            semester,
            departmentId,
            role
        } = req.body;

        // Required validation
        if (
            !username?.trim() ||
            !year ||
            !semester ||
            !departmentId
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields are required...😔"
            });
        }

        // Find class
        const classData = await Class.findByPk(id);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class login not found...🤨"
            });
        }

        // Check department
        const department = await Department.findByPk(departmentId);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found...🤨"
            });
        }

        // Check duplicate username
        const existingClass = await Class.findOne({
            where: {
                username,
                id: {
                    [Op.ne]: id
                }
            }
        });

        if (existingClass) {
            return res.status(409).json({
                success: false,
                message: "Username already exists...🤨"
            });
        }

        // Keep old password
        let hashedPassword = classData.password;

        // Hash only if new password provided
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update
        await classData.update({
            username,
            password: hashedPassword,
            year,
            semester,
            departmentId,
            role: role || classData.role
        });

        // Reload without password
        await classData.reload({
            attributes: {
                exclude: ["password"]
            },
            include: [
                {
                    model: Department,
                    attributes: ["id", "name", "code"]
                }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Class login updated successfully...🙂",
            data: classData
        });

    } catch (error) {
        console.error("Class Update Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};


// ==========================================
// DELETE CLASS LOGIN
// ==========================================

const classDelete = async (req, res) => {
    try {

        const { id } = req.params;

        const classData = await Class.findByPk(id);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class login not found...🤨"
            });
        }

        await classData.destroy();

        return res.status(200).json({
            success: true,
            message: "Class login deleted successfully...🙂"
        });

    } catch (error) {
        console.error("Class Delete Error:", error);

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
    classCreate,
    classGetAll,
    classGetById,
    classUpdate,
    classDelete
};