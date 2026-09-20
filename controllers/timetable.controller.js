const Timetable = require("../models/timetable_model");
const Class = require("../models/class_model");
const Subject = require("../models/subject_model");
const Staff = require("../models/staff_model");
const Department = require("../models/department_model");

// Generate 30 empty timetable slots
const generateTimetableSlots = async (req, res) => {
    try {
        const { departmentID, classID } = req.body;

        // 1. Required fields validation
        if (!departmentID || !classID) {
            return res.status(400).json({
                success: false,
                message: "Department and Class are required...😔"
            });
        }

        // Convert IDs to Number
        const deptID = Number(departmentID);
        const clsID = Number(classID);

        // 2. Check Department
        const department = await Department.findByPk(deptID);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found...🤨"
            });
        }

        // 3. Check Class
        const classData = await Class.findByPk(clsID);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found...🤨"
            });
        }

        // 4. Check Class belongs to Department
        if (Number(classData.departmentID) !== deptID) {
            return res.status(400).json({
                success: false,
                message: "Class does not belong to selected department...🤨"
            });
        }

        // 5. Check existing timetable
        const existingSlots = await Timetable.findAll({
            where: {
                departmentID: deptID,
                classID: clsID
            }
        });

        if (existingSlots.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Timetable slots already exist for this class...🤨",
                count: existingSlots.length
            });
        }

        // 6. Default days
        const days = ["A", "B", "C", "D", "E", "F"];

        // 7. Generate 30 slots
        const slots = [];

        for (const day of days) {
            for (let period = 1; period <= 5; period++) {
                slots.push({
                    day,
                    period,
                    startTime: null,
                    endTime: null,
                    classID: clsID,
                    subjectID: null,
                    staffID: null,
                    departmentID: deptID
                });
            }
        }

        // 8. Bulk create
        const createdSlots = await Timetable.bulkCreate(slots);

        // 9. Response
        return res.status(201).json({
            success: true,
            message: "30 timetable slots generated successfully...🚀",
            count: createdSlots.length,
            data: createdSlots
        });

    } catch (error) {
        console.error("Timetable Slot Generation Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};


// Assign subjects and staff to timetable
const assignSubjectsToTimetable = async (req, res) => {
    try {
        const { departmentID, classID } = req.body;

        // 1. Validation
        if (!departmentID || !classID) {
            return res.status(400).json({
                success: false,
                message: "Department and Class are required...😔"
            });
        }

        const deptID = Number(departmentID);
        const clsID = Number(classID);

        // 2. Check Department
        const department = await Department.findByPk(deptID);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found...🤨"
            });
        }

        // 3. Check Class
        const classData = await Class.findByPk(clsID);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found...🤨"
            });
        }

        // 4. Check Class belongs to Department
        if (Number(classData.departmentID) !== deptID) {
            return res.status(400).json({
                success: false,
                message: "Class does not belong to selected department...🤨"
            });
        }

        // 5. Get timetable slots
        const slots = await Timetable.findAll({
            where: {
                departmentID: deptID,
                classID: clsID
            },
            order: [
                ["day", "ASC"],
                ["period", "ASC"]
            ]
        });

        if (slots.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No timetable slots found. Generate slots first...🤨"
            });
        }

        // 6. Get subjects
        const subjects = await Subject.findAll({
            where: {
                departmentID: deptID
            },
            order: [["id", "ASC"]]
        });

        if (subjects.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No subjects found for this department...🤨"
            });
        }

        // 7. Track assigned subjects
        const assignedSubjectIDs = new Set();

        // 8. Get all timetable records of department
        const allTimetables = await Timetable.findAll({
            where: {
                departmentID: deptID
            }
        });

        // 9. Assign subjects
        const assigned = [];

        for (const slot of slots) {

            // Stop if all subjects assigned
            if (assignedSubjectIDs.size >= subjects.length) {
                break;
            }

            // Skip occupied slot
            if (slot.subjectID || slot.staffID) {
                continue;
            }

            // Find next unassigned subject
            const subject = subjects.find(
                item => !assignedSubjectIDs.has(item.id)
            );

            if (!subject) {
                break;
            }

            // Find staff for subject
            const staff = await Staff.findOne({
                where: {
                    subjectID: subject.id,
                    departmentID: deptID
                }
            });

            if (!staff) {
                continue;
            }

            // Check staff conflict
            const staffConflict = allTimetables.find(item =>
                Number(item.staffID) === Number(staff.id) &&
                item.day === slot.day &&
                item.period === slot.period &&
                Number(item.classID) !== clsID
            );

            if (staffConflict) {
                continue;
            }

            // Assign subject + staff
            await slot.update({
                subjectID: subject.id,
                staffID: staff.id
            });

            assignedSubjectIDs.add(subject.id);
            assigned.push(slot);
        }

        // 10. Check result
        if (assigned.length === 0) {
            return res.status(409).json({
                success: false,
                message:
                    "Unable to assign subjects. No suitable staff or slots found...😔"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Subjects and staff assigned successfully...🚀",
            assignedCount: assigned.length,
            totalSubjects: subjects.length,
            remainingSubjects:
                subjects.length - assignedSubjectIDs.size,
            data: assigned
        });

    } catch (error) {
        console.error(
            "Subject Staff Assignment Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};


module.exports = {
    generateTimetableSlots,
    assignSubjectsToTimetable
};