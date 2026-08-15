const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const Hod = require("../models/hod_model");
const Department = require("../models/department_model");


// Create a new HOD

const hodCreate = async (req, res) => {
    try {
        const { name, username, password, departmentID, role } = req.body;
        


        //required Filled validation
        if(!name || !username || !password || !departmentID || !role) {
            return res.status(400).json({
                success: false,
                message: "please fill all required filed"
            });
        };

        //Check Department existence
        const department = await Department.findByPk(departmentID);
        if(!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        //Check if username already exists
        const existingHod = await Hod.findOne({ where: { username } });
        if(existingHod) {
            return res.status(409).json({
                success: false,
                message: "Username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hod = await Hod.create({
            name,
            username,
            password: hashedPassword,
            departmentID,
            role
        });
        
        res.status(201).json({ 
            success: true,
            message: "HOD created successfully", 
            data: hod
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Internal server error: ${error.message}`
        });
    }
};

// Get all HODs

const hodGetAll = async (req, res) => {
    try{
        const hods = await Hod.findAll({
            attributes: {
                exclude: ['password']
            },
            include: [
                {
                    model: Department,
                    attributes: ['id', 'name', 'code']
                }
            ]
        });
        res.status(200).json({
            success: true,
            message: "HODs retrieved successfully",
            count: hods.length,
            data: hods
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

//get HOD by ID

const getHodbyId = async (req, res) => {
    try {
        const { id } = req.params;
        const hod = await Hod.findByPk(id, {
            attributes: {
                exclude: ['password']
            },
            include: [
                {
                    model: Department,
                    attributes: ['id', 'name', 'code']
                }
            ]
        });
        if (!hod) {
            return res.status(404).json({
                success: false,
                message: "HOD not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "HOD retrieved successfully",
            data: hod
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

// Update HOD by ID
const hodUpdate = async (req, res) => {
    try{
        const { id } = req.params;
        const { name, username, password, departmentID, role } = req.body;
        
        //required Filled validation
        if(!name?.trim() || !username?.trim() || !departmentID || !role) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled"
            });
        }

        // Check if HOD exists
        const hod = await Hod.findByPk(id);
        if (!hod) {
            return res.status(404).json({
                success: false,
                message: "HOD not found"
            });
        }
        // Check if Department exists
        const department = await Department.findByPk(departmentID);
        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        // Check if username already exists for another HOD
        const existingHod = await Hod.findOne({ where: { username, id: { [Sequelize.Op.not]: id } } });
        if (existingHod) {
            return res.status(409).json({
                success: false,
                message: "Username already exists"
            });
        }

        let hashedPassword = hod.password; 

        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update the HOD
        await hod.update({ 
            name, 
            username, 
            password: hashedPassword, 
            departmentID, 
            role 
        });

        await hod.reload({
            attributes: {
                exclude: ['password']
            },
            include: [
                {
                    model: Department,
                    attributes: ['id', 'name', 'code']
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: "HOD updated successfully",
            data: hod
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

// Delete HOD by ID
const hodDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const hod = await Hod.findByPk(id);

        // Check if HOD exists
        if (!hod) {
            return res.status(404).json({
                success: false,
                message: "HOD not found"
            });
        }
        // Delete the HOD
        await hod.destroy();
        res.status(200).json({
            success: true,
            message: "HOD deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

module.exports = {
    hodCreate,
    hodGetAll,
    getHodbyId,
    hodUpdate,
    hodDelete
};