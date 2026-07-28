const Department = require("../models/department_model");
const { Op } = require("sequelize");

//Create Department

const createDept = async (req, res) => {
    try {
        const { name, code } = req.body;

        //validation

        if(!name?.trim()|| !code?.trim()){
            return res.status(400).json({
                success:false,
                message: "Department name and code are required."
            });
        }

        //Check Existing Department

        const existingDepartment = await Department.findOne({
            where: {
                [Op.or]: [
                    { name: name.trim() },
                    { code: code.trim().toUpperCase() }
                ]
            }
        });

        if (existingDepartment) {
            return res.status(409).json({
                success: false,
                message: "Department already exists...😒"
            });
        }
        //Create 
        const department = await Department.create({
            name: name.trim(),
            code: code.trim().toUpperCase()
        });

        return res.status(201).json({
            success: true,
            message: "Department create successfully",
            data: department
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error in department...😔"
        });
    }
};

// Get All Department

const getAllDept = async (req, res) => {
    try{
        const department = await Department.findAll();

        return res.status(200).json({
            success: true,
            count: department.length,
            data: department
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
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
            success: false,
            message: "Department Not found....😔!"
        });
    }
    return res.status(200).json({
        success: true,
        message: "Department successfully Fetch....☺️",
        department
    });

    } catch(error) {
        console.error(error);
        
        return res.status(500).json({
            success: false,
            message: "Server Error in department...😔!"
        });
    }
};
 //Update Department

 const updateDept = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, code} = req.body;

        //Validation
        if(!name?.trim() || !code?.trim() ){
            return res.status(400).json({
                success: false,
                message: "Department name and code are required."
            });
        }

        //find department
        const department = await Department.findByPk(id);

        if(!department) {
            return res.status(404).json({
                success: false,
                message: "Department Not Found"
            });
        }

        const formattedName = name.trim();
        const formattedCode = code.trim().toUpperCase();

        //Check Duplicate
        const existingDepartment = await Department.findOne({
            where: {
                [Op.or]:[
                    { name: formattedName },
                    { code: formattedCode }
                ],
                id: {
                    [Op.ne]: id
                }
            }
        });

        if(existingDepartment){
            return res.status(409).json({
                success: false,
                message: "Department name or code already exists."
            });
        }

        //Update
        await department.update({
            name: formattedName,
            code: formattedCode
        });

        return res.status(200).json({
            success: true,
            message: "Department Updated successfully....☺️",
            data: department
        });
        
    } catch (error){
        console.error("Department Update Error: ",error);

        return res.status(500).json({
            success: false,
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
                success: false,
                message: "Department Not found...😔"
            });
        }

        await department.destroy();

        return res.status(200).json({
            success: true,
            message: "Department Deleted successfully...☺️"
        });

    } catch (error) {
        console.error("Department Delete Error: ", error);

        return res.status(500).json({
            success: false,
            message: "Server Error in department...😔"
        });
    }
 };

module.exports = { createDept, getAllDept, getDept, updateDept, deleteDept };