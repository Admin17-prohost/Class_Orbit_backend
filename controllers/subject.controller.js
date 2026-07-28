
const Subject = require("../models/subject_model");
const Department = require("../models/department_model");
const Staff = require("../models/staff_model")
const { Op } = require("sequelize");



const subjectCreate = async (req, res) => {

    try{

    const { subject_name, subject_code, departmentID, staffID } = req.body;
   
    
    // Validation
    if (
        !subject_name?.trim() ||
        !subject_code?.trim() ||
        !departmentID
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    const formattedName = subject_name.trim();
    const formattedCode = subject_code.trim().toUpperCase();

    const department = await Department.findByPk(departmentID);
    if (!department) {
        return res.status(404).json({
            success: false,
            message: "Department not found."
        });
    }

    if(staffID){
        const staff = await Staff.findByPk(staffID);

        if (!staff){
            return res.status(404).json({
                success: false,
                message: "Staff not found."
            });
        }
        
        if(Number(staff.departmentID) !== Number(departmentID)){
            return res.status(400).json({
                success: false,
                message: "Staff does not belong to the selected department."
            });
        }
    }

    // Existing
    const existing = await Subject.findOne({
        where: {
            [Op.or]: [
                { 
                    subject_code: formattedCode 
                },
                {
                    subject_name: formattedName,
                    departmentID
                }
            ]
        }
    });
    
    if(existing){
        return res.status(409).json({
            success: false,
            message: "Subject name or subject code already exists...🤨"
        });
    }

    // Creating
    const subject = await Subject.create({ 
        subject_name: formattedName,
        subject_code: formattedCode,
        departmentID,
        staffID: staffID || null
    });

    return res.status(201).json({
        success: true,
        message: "Successfully create Subject...😎",
        data: subject
    });

    } catch (error) {
        console.error("Subject Create error: ", error);

        return res.status(500).json({
            success: false,
            message: "Subject Internal Server faild...😔"
        });
    }  
};

//Update subject
const updatesubject = async (req, res) => {
    try{
        const {id} = req.params;
        const { subject_name, subject_code, departmentID, staffID} = req.body;
        
        if(
        !subject_name?.trim() || 
        !subject_code?.trim() || 
        !departmentID 
    ){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

//Find Subject
        const subject = await Subject.findByPk(id);
        
        if (!subject) {
            return res.status(404).json({
            success: false,
            message: "Subject not found."
            });
        }

//find Department
        const department = await Department.findByPk(departmentID);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }

//Format

        const formattedName = subject_name.trim();
        const formattedCode = subject_code.trim().toUpperCase();
        if(staffID) {
            const staff = await Staff.findByPk(staffID);

            if(!staff) {
                return res.status(404).json({
                    success: false,
                    message: "Staff Not found."
                });
            }
        

//Check Staff Department

        if (Number(staff.departmentID) !== Number(departmentID)) {
                return res.status(400).json({
                    success: false,
                    message: "Staff does not belong to the selected department."
                });
            }
        } 

        const existing = await Subject.findOne({
             where: {
                [Op.or]: [
                    {
                        subject_code: formattedCode
                    },
                    {
                        subject_name: formattedName,
                        departmentID
                    }
                ],
                id: {
                    [Op.ne]: id
                }
            }
        });

        if (existing) {
            return res.status(409).json({
            success: false,
            message: "Subject name or code already exists."
            });
        }

        await subject.update({
            subject_name: formattedName,
            subject_code: formattedCode,
            departmentID,
            staffID: staffID || null
        });

        return res.status(200).json({
            success: true,
            message: "Subject updated successfully...☺️",
            data: subject
        });

    } catch(error){
        console.error("Subject Update error: ", error);

        return res.status(500).json({
            success: false,
            message: "Subject internal server error...😔"
        });
    }
};

// GET All Subject
const getAllSubjects = async (req, res) => {
    try{
        const subject = await Subject.findAll({
            include: [
        {
            model: Staff,
            attributes: ["id", "name", "username"]
        },
        {
            model: Department,
            attributes: ["id", "name", "code"]
        }
    ]
        });

        return res.status(200).json({
            success: true,
            count: subject.length,
            data: subject
        });

    } catch(error){
        console.error("All subject fetch Error: ", error);

        return res.status(500).json({
            success: false,
            message: "Subject internal server error...😔"
        });
    }
};

//get subject by ID
const getSubject = async (req, res) => {
    try{
        const {id} = req.params;

        const subject = await Subject.findByPk(id, {
            include: [
                {
                    model: Staff,
                    attributes: ["id", "name", "username"]
                },
                {
                    model: Department,
                    attributes: ["id", "name", "code"]
                }
            ]
        });

        if(!subject){
            return res.status(404).json({
                success: false,
                message: "Subject is not found...🤨"
            });
        }

        return res.status(200).json({
            success: true,
            data: subject
        });

    } catch(error){
        console.error("Subject Fetch Error: ", error);

        return res.status(500).json({
            success: false,
            message: "Subject internal server error...😔"
        });
    }
};



//Delete Subject.

const delSubject = async (req, res) => {
    
    try{
        const { id } = req.params;
        const subject = await Subject.findByPk(id);
        
        if(!subject){
            return res.status(404).json({
                success: false,
                message: "Subject is not found...🤨"
            });
        }
        
        await subject.destroy();

        return res.status(200).json({
            success: true,
            message: "Successfully Deleted the subject...☺️"
        });

    } catch(error) {
        console.error("subject Delete Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Subject internal server error...😔"
        });
    }
};

module.exports = {
    subjectCreate, 
    getAllSubjects,
    getSubject, 
    delSubject,
    updatesubject
};