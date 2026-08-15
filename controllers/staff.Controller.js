const bcrypt = require("bcrypt");

const Staff = require("../models/staff_model");
const Subject = require("../models/subject_model");
const Department = require("../models/department_model");

const staffCreate = async (req, res) => {

   try{
        
    const {name, username, password, departmentID, subjectID, role } = req.body;
    
    //Required fields validation
    if (!name || !username || !password || !departmentID || !subjectID || !role){
        return res.status(400).json({
            success: false,
            message: "All fields are required...😔"
        });
    }

    //Check Department and Subject existence
    const department = await Department.findByPk(departmentID);
    if(!department){
        return res.status(404).json({
            success: false,
            message: "Department not found...🤨"
        });
    }

    const subject = await Subject.findByPk(subjectID);
    if(!subject){
        return res.status(404).json({
            success: false,
            message: "Subject not found...🤨"
        });
    }

    //Check Subuject belongs to Department
    if (subject.departmentID !== departmentID) {
        return res.status(400).json({
            success: false,
            message: "Selected subject does not belong to the selected department...🤨"
        });
    }
    
    //Check if username already exists
    const existingStaff = await Staff.findOne({ where: { username } });
    if (existingStaff) {
        return res.status(409).json({
            success: false,
            message: "Username already exists...🤨"
        });
    }

    //Hash password and create staff
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStaff = await Staff.create({
        name,
        username,
        password: hashedPassword,
        departmentID, 
        subjectID,
        role
    });

    return res.status(201).json({
        success: true,
        message: "Staff created successfully...🙂",
        data: newStaff
    });

} catch(error) {
    console.error("Staff creating error",error)
    return res.status(500).json({
        success: false,
        message: "Internal server error...😔"
    });
}
}

//Get all staff
const staffGetAll = async (req, res) => {
    try {
        const staff = await Staff.findAll({

            attributes: {
              exclude: ["password"]  
            },

            include: [
                {
                    model: Department,
                    attributes: ['id', 'name', 'code']
                },
                {
                    model: Subject,
                    attributes: ['id', 'subject_name', 'subject_code']
                }
            ]
        });
        return res.status(200).json({
            success: true,
            message: "Staff retrieved successfully...🙂",
            count: staff.length,
            data: staff
        });
    } catch (error) {
        console.error("Error retrieving staff", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};

//Get staff by ID
const staffGetById = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findByPk(id, {
            attributes: { exclude: ["password"] },
            include: [
                {
                    model: Department,
                    attributes: ['id', 'name', 'code']
                },
                {
                    model: Subject,
                    attributes: ['id', 'subject_name', 'subject_code']
                }
            ]
        });

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found...🤨"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Staff retrieved successfully...🙂",
            data: staff
        });

    } catch (error) {
        console.error("Error retrieving staff", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
}

//Update staff
const staffUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, password, departmentID, subjectID } = req.body;

        // Required fields validation
        if(!name?.trim() || !username?.trim() || !departmentID || !subjectID ){
            return res.status(400).json({
                success: false,
                message: "All fields are required...😔"
            });
        }

        // Find staff by ID
        const staff = await Staff.findByPk(id);
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found...🤨"
            });
        }

        // Check Department and Subject existence
        const department = await Department.findByPk(departmentID);
        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found...🤨"
            });
        }

        const subject = await Subject.findByPk(subjectID);
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found...🤨"
            });
        }

        // Check if subject belongs to department
        if (subject.departmentID !== departmentID) {
            return res.status(400).json({
                success: false,
                message: "Selected subject does not belong to the selected department...🤨"
            });
        }

        // Check if username already exists (excluding the current staff member)
        const existingStaff = await Staff.findOne({ 
            where: { 
                username,
                id: {
                    [Op.ne]: id
                }
            }
        });

        if (existingStaff) {
            return res.status(409).json({
                success: false,
                message: "Username already exists...🤨"
            });
        }

        // Hash password if provided
        let hashedPassword = staff.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update staff
        await staff.update({
            name,
            username,
            password: hashedPassword,
            departmentID,
            subjectID,
        });

        await staff.reload({
            attributes: { 
                exclude: ["password"] 
            },
            include: [
                {
                    model: Department,
                    attributes: ['id', 'name', 'code']
                },
                {
                    model: Subject,
                    attributes: ['id', 'subject_name', 'subject_code']
                }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Staff updated successfully...🙂",
            data: staff
        });

    } catch (error) {
        console.error("Error updating staff", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
}

//Delete staff
const staffDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findByPk(id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found...🤨"
            });
        }

        await staff.destroy();

        return res.status(200).json({
            success: true,
            message: "Staff deleted successfully...🙂"
        });

    } catch (error) {
        console.error("Error deleting staff", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }

};

module.exports = { 
    staffCreate,
    staffGetAll,
    staffGetById,
    staffUpdate,
    staffDelete
};