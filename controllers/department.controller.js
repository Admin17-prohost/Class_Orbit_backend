const Department = require("../models/department_model");


//Create Department

const createDept = async (req, res) => {
    try {
        const { name, code } = req.body;

        //validation

        if(!name){
            return res.status(400).json({
                Success:false,
                message: "Department name is required....🤨"
            });
        }

        //Check Existing Department

        const existingDepartment = await Department.findOne({
            where: { name, code }
        });

        if (existingDepartment) {
            return res.status(409).json({
                Success: false,
                message: "Department already exists...😒"
            });
        }
        //Create 
        const department = await Department.create({
            name, code
        });

        return res.status(201).json({
            Success: true,
            message: "Department create successfully",
            data: department
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            Success: false,
            message: "Server Error in department...😔"
        });
    }
};

// Get All Department

const getAllDept = async (req, res) => {
    try{
        const department = await Department.findAll();

        return res.status(200).json({
            Success: true,
            Count: department.length,
            data: department
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            Success: false,
            message: "Server Error in department...😔"
        });
    }
};

// get Dept by id

const getDept = async (req, res) => {
    try{
    const {id} = req.params;

    const department = await Department.findByPk(id);

    if(!department){
        return res.status(404).json({
            Success: false,
            message: "Department Not found....😔!"
        });
    }
    return res.status(200).json({
        Success: true,
        message: "Department Successfully Fetch....☺️",
        department
    });

    } catch(error) {
        console.error(error);
        
        return res.status(500).json({
            Success: false,
            message: "Server Error in department...😔!"
        });
    }
};
 //Update Department

 const updateDept = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, code} = req.body;

        const department = await Department.findByPk(id);

        if(!department) {
            return res.status(404).json({
                Success: false,
                message: "Department Not Found"
            });
        }

        department.name = name;
        department.code = code;

        await department.save();
        return res.status(200).json({
            Success: true,
            message: "Department Updated Successfully....☺️",
            data: department
        });
        
    } catch (error){
        console.error(error);

        return res.status(500).json({
            Success: false,
            message: "Server Error in department...😔"
        });
    }
 };

 // Delete Department

 const deleteDept = async (req, res) =>{
    try{
        const { id } = req.params;
        const department = await Department.findByPk(id);

        if(!department) {
            return res.status(404).json({
                Success: false,
                message: "Department Not found...😔"
            });
        }

        await department.destroy();

        return res.status(200).json({
            Success: true,
            message: "Department Deleted Successfully...☺️"
        });

    } catch {
        console.error(error);

        return res.status(500).json({
            Success: false,
            message: "Server Error in department...😔"
        });
    }
 };

module.exports = { createDept, getAllDept, getDept, updateDept, deleteDept };