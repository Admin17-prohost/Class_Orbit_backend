const Subject = require("../models/subject_model");
const Department = require("../models/department_model");
const Staff = require("../models/staff_model");
const { Op } = require("sequelize");


// ======================================================
// CREATE SUBJECT
// ======================================================

const subjectCreate = async (req, res) => {
    try {

        const {
            subject_name,
            subject_code,
            semester,
            departmentID,
            staffID,
            weeklyPeriods
        } = req.body;


        // --------------------------------------------------
        // Basic Validation
        // --------------------------------------------------

        if (
            !subject_name?.trim() ||
            !subject_code?.trim() ||
            !departmentID
        ) {
            return res.status(400).json({
                success: false,
                message: "subject_name, subject_code and departmentID are required."
            });
        }


        // --------------------------------------------------
        // Weekly Period Validation
        // --------------------------------------------------

        const finalWeeklyPeriods = weeklyPeriods ?? 1;

        if (
            !Number.isInteger(Number(finalWeeklyPeriods)) ||
            Number(finalWeeklyPeriods) < 1 ||
            Number(finalWeeklyPeriods) > 10
        ) {
            return res.status(400).json({
                success: false,
                message: "weeklyPeriods must be between 1 and 10."
            });
        }


        // --------------------------------------------------
        // Format Values
        // --------------------------------------------------

        const formattedName = subject_name.trim();
        const formattedCode = subject_code.trim().toUpperCase();


        // --------------------------------------------------
        // Check Department
        // --------------------------------------------------

        const department = await Department.findByPk(departmentID);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }


        // --------------------------------------------------
        // Check Staff
        // --------------------------------------------------

        if (staffID) {

            const staff = await Staff.findByPk(staffID);

            if (!staff) {
                return res.status(404).json({
                    success: false,
                    message: "Staff not found."
                });
            }


            // Staff must belong to same department

            if (
                Number(staff.departmentID) !==
                Number(departmentID)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Staff does not belong to the selected department."
                });
            }
        }


        // --------------------------------------------------
        // Check Duplicate Subject
        // --------------------------------------------------

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


        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Subject name or subject code already exists...🤨"
            });
        }


        // --------------------------------------------------
        // Create Subject
        // --------------------------------------------------

        const subject = await Subject.create({

            subject_name: formattedName,

            subject_code: formattedCode,

            semester: semester ?? null,

            departmentID,

            staffID: staffID || null,

            weeklyPeriods: Number(finalWeeklyPeriods)
        });


        return res.status(201).json({
            success: true,
            message: "Successfully created Subject...😎",
            data: subject
        });


    } catch (error) {

        console.error("Subject Create Error:", error);

        return res.status(500).json({
            success: false,
            message: "Subject internal server error...😔"
        });
    }
};



// ======================================================
// UPDATE SUBJECT
// ======================================================

const updatesubject = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            subject_name,
            subject_code,
            semester,
            departmentID,
            staffID,
            weeklyPeriods
        } = req.body;


        // --------------------------------------------------
        // Basic Validation
        // --------------------------------------------------

        if (
            !subject_name?.trim() ||
            !subject_code?.trim() ||
            !departmentID
        ) {
            return res.status(400).json({
                success: false,
                message: "subject_name, subject_code and departmentID are required."
            });
        }


        // --------------------------------------------------
        // Find Subject
        // --------------------------------------------------

        const subject = await Subject.findByPk(id);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found."
            });
        }


        // --------------------------------------------------
        // Weekly Period Validation
        // --------------------------------------------------

        const finalWeeklyPeriods =
            weeklyPeriods ?? subject.weeklyPeriods ?? 1;


        if (
            !Number.isInteger(Number(finalWeeklyPeriods)) ||
            Number(finalWeeklyPeriods) < 1 ||
            Number(finalWeeklyPeriods) > 10
        ) {
            return res.status(400).json({
                success: false,
                message: "weeklyPeriods must be between 1 and 10."
            });
        }


        // --------------------------------------------------
        // Find Department
        // --------------------------------------------------

        const department =
            await Department.findByPk(departmentID);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }


        // --------------------------------------------------
        // Format Values
        // --------------------------------------------------

        const formattedName =
            subject_name.trim();

        const formattedCode =
            subject_code.trim().toUpperCase();


        // --------------------------------------------------
        // Check Staff
        // --------------------------------------------------

        if (staffID) {

            const staff =
                await Staff.findByPk(staffID);


            if (!staff) {
                return res.status(404).json({
                    success: false,
                    message: "Staff not found."
                });
            }


            // Staff department validation

            if (
                Number(staff.departmentID) !==
                Number(departmentID)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Staff does not belong to the selected department."
                });
            }
        }


        // --------------------------------------------------
        // Check Duplicate Subject
        // --------------------------------------------------

        const existing = await Subject.findOne({

            where: {

                [Op.or]: [

                    {
                        subject_code:
                            formattedCode
                    },

                    {
                        subject_name:
                            formattedName,

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
                message:
                    "Subject name or code already exists."
            });
        }


        // --------------------------------------------------
        // Update Subject
        // --------------------------------------------------

        await subject.update({

            subject_name:
                formattedName,

            subject_code:
                formattedCode,

            semester:
                semester ?? null,

            departmentID,

            staffID:
                staffID || null,

            weeklyPeriods:
                Number(finalWeeklyPeriods)
        });


        return res.status(200).json({
            success: true,
            message:
                "Subject updated successfully...☺️",
            data: subject
        });


    } catch (error) {

        console.error(
            "Subject Update Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Subject internal server error...😔"
        });
    }
};



// ======================================================
// GET ALL SUBJECTS
// ======================================================

const getAllSubjects = async (req, res) => {

    try {

        const subjects =
            await Subject.findAll({

                include: [

                    {
                        model: Staff,

                        attributes: [
                            "id",
                            "name",
                            "username"
                        ]
                    },

                    {
                        model: Department,

                        attributes: [
                            "id",
                            "name",
                            "code"
                        ]
                    }
                ],

                order: [
                    ["id", "ASC"]
                ]
            });


        return res.status(200).json({

            success: true,

            count:
                subjects.length,

            data:
                subjects
        });


    } catch (error) {

        console.error(
            "All Subject Fetch Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Subject internal server error...😔"
        });
    }
};



// ======================================================
// GET SUBJECT BY ID
// ======================================================

const getSubject = async (req, res) => {

    try {

        const { id } =
            req.params;


        const subject =
            await Subject.findByPk(id, {

                include: [

                    {
                        model: Staff,

                        attributes: [
                            "id",
                            "name",
                            "username"
                        ]
                    },

                    {
                        model: Department,

                        attributes: [
                            "id",
                            "name",
                            "code"
                        ]
                    }
                ]
            });


        if (!subject) {

            return res.status(404).json({
                success: false,
                message:
                    "Subject is not found...🤨"
            });
        }


        return res.status(200).json({

            success: true,

            data:
                subject
        });


    } catch (error) {

        console.error(
            "Subject Fetch Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Subject internal server error...😔"
        });
    }
};



// ======================================================
// DELETE SUBJECT
// ======================================================

const delSubject = async (req, res) => {

    try {

        const { id } =
            req.params;


        const subject =
            await Subject.findByPk(id);


        if (!subject) {

            return res.status(404).json({
                success: false,
                message:
                    "Subject is not found...🤨"
            });
        }


        await subject.destroy();


        return res.status(200).json({

            success: true,

            message:
                "Successfully deleted the subject...☺️"
        });


    } catch (error) {

        console.error(
            "Subject Delete Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Subject internal server error...😔"
        });
    }
};



// ======================================================
// EXPORT
// ======================================================

module.exports = {

    subjectCreate,

    updatesubject,

    getAllSubjects,

    getSubject,

    delSubject
};