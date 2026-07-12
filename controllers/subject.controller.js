
const Subject = require("../models/subject_model");
const Department = require("../models/department_model");
const { Op } = require("sequelize");


// Subject-Create
const subjectCreate = async (req, res) => {

    try{

    const { subject_name, subject_code, departmentID } = req.body;
   

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
    
    const department = await Department.findByPk(departmentID);
    if (!department) {
        return res.status(404).json({
            success: false,
            message: "Department not found."
        });
    }

    // Existing

    const existing = await Subject.findOne({
        where: {
            [Op.or]: [
                {subject_name},
                {subject_code}
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
    const subject = await Subject.create({ subject_name, subject_code, departmentID});

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

// GET All Subject

const getAllSubjects = async (req, res) => {
    try{
        const subject = await Subject.findAll();

        return res.status(200).json({
            success: true,
            count: subject.length,
            data: subject
        });

    } catch(error){
        console.error("All subject fetch Error: ", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error..😔"
        });
    }
};

//get subject by ID
const getSubject = async (req, res) => {
    try{
        const {id} = req.params;

        const subject = await Subject.findByPk(id);

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
            message: "Internal Server Error..😔"
        });
    }
};

//Update subject

const updatesubject = async (req, res) => {
    try{
        const {id} = req.params;
        const { subject_name, subject_code, departmentID} = req.body;
        
        

        if(!subject_name || !subject_code || !departmentID){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const subject = await Subject.findByPk(id);
        const department = await Department.findByPk(departmentID);

        if (!subject) {
            return res.status(404).json({
            success: false,
            message: "Subject not found."
            });
        }

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }

        const existing = await Subject.findOne({
            where: {
                [Op.or]: [
                    { subject_name },
                    { subject_code }
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
            subject_name,
            subject_code,
            departmentID
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
            message: "Internal Server Error..😔"
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
            message: "Internal Server Error..😔"
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