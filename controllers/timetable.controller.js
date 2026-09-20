const { Op } = require("sequelize");

const Timetable = require("../models/timetable_model");
const Class = require("../models/class_model");
const Subject = require("../models/subject_model");
const Staff = require("../models/staff_model");
const Department = require("../models/department_model");
const Period = require("../models/period_model");
const DayOrder = require("../models/dayOrder_model");


// =====================================================
// GENERATE TIMETABLE SLOTS
// =====================================================

const generateTimetableSlots = async (req, res) => {
    try {
        const { departmentID, classID } = req.body;

        if (!departmentID || !classID) {
            return res.status(400).json({
                success: false,
                message: "Department and Class are required...😔"
            });
        }

        const deptID = Number(departmentID);
        const clsID = Number(classID);

        // Check Department
        const department = await Department.findByPk(deptID);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found...🤨"
            });
        }

        // Check Class
        const classData = await Class.findByPk(clsID);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found...🤨"
            });
        }

        // Check Class belongs to Department
        if (Number(classData.departmentID) !== deptID) {
            return res.status(400).json({
                success: false,
                message: "Class does not belong to selected department...🤨"
            });
        }

        // Check existing timetable
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

        // Days
        const days = ["A", "B", "C", "D", "E", "F"];

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

        // Create 30 slots
        const createdSlots = await Timetable.bulkCreate(slots);

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


/// =====================================================
// ASSIGN SUBJECTS + STAFF
// =====================================================


const assignSubjectsToTimetable = async (req, res) => {
    try {

        const { departmentID, classID } = req.body;

        // --------------------------------------------------
        // 1. Validate Request
        // --------------------------------------------------

        if (!departmentID || !classID) {
            return res.status(400).json({
                success: false,
                message: "departmentID and classID are required"
            });
        }


        // --------------------------------------------------
        // 2. Check Department
        // --------------------------------------------------

        const department = await Department.findByPk(departmentID);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }


        // --------------------------------------------------
        // 3. Check Class
        // --------------------------------------------------

        const classData = await student.findByPk(classID);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }


        // --------------------------------------------------
        // 4. Check Class → Department
        // --------------------------------------------------

        if (
            Number(classData.departmentID) !==
            Number(departmentID)
        ) {
            return res.status(400).json({
                success: false,
                message: "Class does not belong to this department"
            });
        }


        // --------------------------------------------------
        // 5. Get Empty Timetable Slots
        // --------------------------------------------------

        const slots = await Timetable.findAll({
            where: {
                classID,
                departmentID,
                subjectID: null,
                staffID: null
            },
            order: [
                ["day", "ASC"],
                ["period", "ASC"]
            ]
        });


        if (slots.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No empty timetable slots available"
            });
        }


        // --------------------------------------------------
        // 6. Get Department Subjects
        // --------------------------------------------------

        const subjects = await Subject.findAll({
            where: {
                departmentID
            },
            order: [
                ["id", "ASC"]
            ]
        });


        if (subjects.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No subjects found for this department"
            });
        }


        // --------------------------------------------------
        // 7. Get ALL Staff Once
        // --------------------------------------------------

        const staffs = await Staff.findAll({
            where: {
                departmentID
            },
            order: [
                ["id", "ASC"]
            ]
        });


        // --------------------------------------------------
        // 8. Create Subject → Staff Mapping
        // --------------------------------------------------

        const staffMap = {};

        for (const staff of staffs) {

            const subjectID = staff.subjectID;

            if (!subjectID) {
                continue;
            }

            if (!staffMap[subjectID]) {
                staffMap[subjectID] = [];
            }

            staffMap[subjectID].push(staff);
        }


        // --------------------------------------------------
        // 9. Create Subject Pool
        // --------------------------------------------------

        const subjectPool = [];

        for (const subject of subjects) {

            const weeklyPeriods =
                Number(subject.weeklyPeriods || 1);

            for (let i = 0; i < weeklyPeriods; i++) {

                subjectPool.push(subject);

            }
        }


        // --------------------------------------------------
        // 10. Check Required Periods
        // --------------------------------------------------

        if (subjectPool.length > slots.length) {

            return res.status(400).json({
                success: false,
                message: "Insufficient timetable slots",
                requiredPeriods: subjectPool.length,
                availableSlots: slots.length
            });

        }


        // --------------------------------------------------
        // 11. Subject Distribution Tracker
        // --------------------------------------------------

        const subjectDayCount = {};

        for (const subject of subjects) {

            subjectDayCount[subject.id] = {};

        }


        // --------------------------------------------------
        // 12. Staff Assignment Tracker
        // --------------------------------------------------

        const staffPeriodMap = new Set();


        // --------------------------------------------------
        // 13. Result Arrays
        // --------------------------------------------------

        const assignedSlots = [];

        const skippedSubjects = [];

        const subjectAssignedCount = {};


        for (const subject of subjects) {

            subjectAssignedCount[subject.id] = 0;

        }


        // ==================================================
        // 14. ASSIGN SUBJECTS
        // ==================================================

        for (const subject of subjectPool) {

            const subjectID = subject.id;

            const subjectStaff =
                staffMap[subjectID] || [];


            // --------------------------------------------------
            // No Staff
            // --------------------------------------------------

            if (subjectStaff.length === 0) {

                skippedSubjects.push({
                    subjectID: subject.id,
                    subjectName: subject.subject_name,
                    reason: "No staff assigned for this subject"
                });

                continue;
            }


            let assigned = false;


            // --------------------------------------------------
            // Sort slots based on subject distribution
            // --------------------------------------------------

            const sortedSlots = [...slots]
                .filter(slot => slot.subjectID === null)
                .sort((a, b) => {

                    const aCount =
                        subjectDayCount[subjectID][a.day] || 0;

                    const bCount =
                        subjectDayCount[subjectID][b.day] || 0;

                    return aCount - bCount;

                });


            // --------------------------------------------------
            // Try Every Slot
            // --------------------------------------------------

            for (const slot of sortedSlots) {

                const day = slot.day;

                const period = slot.period;


                // ----------------------------------------------
                // Same subject same day restriction
                // ----------------------------------------------

                const sameDayCount =
                    subjectDayCount[subjectID][day] || 0;


                /*
                 * If subject has <= 5 weekly periods,
                 * try to keep only ONE period per day.
                 *
                 * If subject requires more than 5 periods,
                 * second period on a day is allowed.
                 */

                const weeklyPeriods =
                    Number(subject.weeklyPeriods || 1);


                const maxPerDay =
                    weeklyPeriods <= 5 ? 1 : 2;


                if (sameDayCount >= maxPerDay) {
                    continue;
                }


                // ----------------------------------------------
                // Find available staff
                // ----------------------------------------------

                let selectedStaff = null;


                /*
                 * Select the staff who is not already
                 * teaching another class at this period.
                 */

                for (const staff of subjectStaff) {

                    const staffKey =
                        `${staff.id}-${day}-${period}`;


                    if (
                        !staffPeriodMap.has(staffKey)
                    ) {

                        selectedStaff = staff;

                        break;
                    }
                }


                // No staff available for this slot
                if (!selectedStaff) {
                    continue;
                }


                // ----------------------------------------------
                // Assign Slot
                // ----------------------------------------------

                await slot.update({
                    subjectID: subject.id,
                    staffID: selectedStaff.id
                });


                // ----------------------------------------------
                // Update Trackers
                // ----------------------------------------------

                subjectDayCount[subjectID][day] =
                    (subjectDayCount[subjectID][day] || 0) + 1;


                const staffKey =
                    `${selectedStaff.id}-${day}-${period}`;


                staffPeriodMap.add(staffKey);


                subjectAssignedCount[subjectID]++;


                // ----------------------------------------------
                // Save Result
                // ----------------------------------------------

                assignedSlots.push({

                    slotID: slot.id,

                    day: day,

                    period: period,

                    subjectID: subject.id,

                    subjectName: subject.subject_name,

                    staffID: selectedStaff.id

                });


                assigned = true;

                break;
            }


            // --------------------------------------------------
            // Subject couldn't be assigned
            // --------------------------------------------------

            if (!assigned) {

                skippedSubjects.push({

                    subjectID: subject.id,

                    subjectName: subject.subject_name,

                    reason:
                        "No suitable slot or staff available"

                });

            }

        }


        // ==================================================
        // 15. CHECK SUBJECT COMPLETION
        // ==================================================

        const incompleteSubjects = [];


        for (const subject of subjects) {

            const required =
                Number(subject.weeklyPeriods || 1);

            const assigned =
                subjectAssignedCount[subject.id];


            if (assigned < required) {

                incompleteSubjects.push({

                    subjectID: subject.id,

                    subjectName: subject.subject_name,

                    requiredPeriods: required,

                    assignedPeriods: assigned,

                    remainingPeriods:
                        required - assigned

                });

            }

        }


        // ==================================================
        // 16. Remaining Slots
        // ==================================================

        const remainingPeriods =
            slots.length - assignedSlots.length;


        // ==================================================
        // 17. Final Response
        // ==================================================

        return res.status(200).json({

            success: true,

            message:
                "Timetable subjects assigned successfully",

            classID,

            departmentID,

            totalSlots:
                slots.length,

            assignedPeriods:
                assignedSlots.length,

            remainingPeriods,

            assignedSlots,

            skippedSubjects,

            incompleteSubjects

        });


    } catch (error) {

        console.error(
            "Assign Timetable Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to assign subjects",

            error:
                error.message

        });

    }
};


// =====================================================
// GET TIMETABLE BY CLASS
// =====================================================

const getTimetableByClass = async (req, res) => {
    try {

        const { classID } = req.params;

        const clsID = Number(classID);

        if (!clsID) {
            return res.status(400).json({
                success: false,
                message: "Valid Class ID is required...😔"
            });
        }

        // Check Class
        const classData = await Class.findByPk(clsID);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found...🤨"
            });
        }

        // Get timetable
        const timetable = await Timetable.findAll({
            where: {
                classID: clsID
            },
            order: [
                ["day", "ASC"],
                ["period", "ASC"]
            ]
        });

        if (timetable.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No timetable found for this class...🤨"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Timetable fetched successfully...🚀",
            count: timetable.length,
            data: timetable
        });

    } catch (error) {

        console.error("Get Timetable By Class Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};


// =====================================================
// GET TIMETABLE BY DEPARTMENT
// =====================================================

const getTimetableByDepartment = async (req, res) => {
    try {

        const { departmentID } = req.params;

        const deptID = Number(departmentID);

        if (!deptID) {
            return res.status(400).json({
                success: false,
                message: "Valid Department ID is required...😔"
            });
        }

        // Check Department
        const department = await Department.findByPk(deptID);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found...🤨"
            });
        }

        // Get timetable
        const timetable = await Timetable.findAll({
            where: {
                departmentID: deptID
            },
            order: [
                ["day", "ASC"],
                ["period", "ASC"]
            ]
        });

        if (timetable.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No timetable found for this department...🤨"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Department timetable fetched successfully...🚀",
            count: timetable.length,
            data: timetable
        });

    } catch (error) {

        console.error("Get Department Timetable Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};

// =====================================================
// UPDATE TIMETABLE SLOT
// =====================================================

const updateTimetableSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const { subjectID, staffID } = req.body;

        const slotID = Number(id);

        if (!slotID) {
            return res.status(400).json({
                success: false,
                message: "Valid Timetable Slot ID is required...😔"
            });
        }

        if (!subjectID || !staffID) {
            return res.status(400).json({
                success: false,
                message: "Subject and Staff are required...😔"
            });
        }

        const subID = Number(subjectID);
        const stfID = Number(staffID);

        // ---------------------------------------------
        // 1. FIND TIMETABLE SLOT
        // ---------------------------------------------

        const slot = await Timetable.findByPk(slotID);

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Timetable slot not found...🤨"
            });
        }

        // ---------------------------------------------
        // 2. FIND CLASS
        // ---------------------------------------------

        const classData = await Class.findByPk(slot.classID);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class assigned to this timetable slot was not found...🤨"
            });
        }

        // ---------------------------------------------
        // 3. CLASS → DEPARTMENT VALIDATION
        // ---------------------------------------------

        if (
            Number(classData.departmentID) !==
            Number(slot.departmentID)
        ) {
            return res.status(400).json({
                success: false,
                message: "Class and timetable department do not match...🤨"
            });
        }

        // ---------------------------------------------
        // 4. FIND SUBJECT
        // ---------------------------------------------

        const subject = await Subject.findByPk(subID);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found...🤨"
            });
        }

        // ---------------------------------------------
        // 5. SUBJECT → DEPARTMENT VALIDATION
        // ---------------------------------------------

        if (
            Number(subject.departmentID) !==
            Number(slot.departmentID)
        ) {
            return res.status(400).json({
                success: false,
                message: "Subject does not belong to this department...🤨"
            });
        }

        // ---------------------------------------------
        // 6. FIND STAFF
        // ---------------------------------------------

        const staff = await Staff.findByPk(stfID);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found...🤨"
            });
        }

        // ---------------------------------------------
        // 7. STAFF → DEPARTMENT VALIDATION
        // ---------------------------------------------

        if (
            Number(staff.departmentID) !==
            Number(slot.departmentID)
        ) {
            return res.status(400).json({
                success: false,
                message: "Staff does not belong to this department...🤨"
            });
        }

        // ---------------------------------------------
        // 8. STAFF → SUBJECT VALIDATION
        // ---------------------------------------------

        if (Number(staff.subjectID) !== subID) {
            return res.status(400).json({
                success: false,
                message: "Selected staff is not assigned to this subject...🤨"
            });
        }

        // ---------------------------------------------
        // 9. STAFF TIME CONFLICT
        // ---------------------------------------------

        const staffConflict = await Timetable.findOne({
            where: {
                staffID: stfID,
                day: slot.day,
                period: slot.period
            }
        });

        if (
            staffConflict &&
            Number(staffConflict.id) !== slotID
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Staff is already assigned to another class at this day and period...⚠️"
            });
        }

        // ---------------------------------------------
        // 10. CLASS SLOT CONFLICT
        // ---------------------------------------------

        const classConflict = await Timetable.findOne({
            where: {
                classID: slot.classID,
                day: slot.day,
                period: slot.period
            }
        });

        if (
            classConflict &&
            Number(classConflict.id) !== slotID
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "This class already has another timetable slot at this day and period...⚠️"
            });
        }

        // ---------------------------------------------
        // 11. UPDATE SLOT
        // ---------------------------------------------

        await slot.update({
            subjectID: subID,
            staffID: stfID
        });

        // ---------------------------------------------
        // 12. SUCCESS RESPONSE
        // ---------------------------------------------

        return res.status(200).json({
            success: true,
            message: "Timetable slot updated successfully...🚀",
            data: slot
        });

    } catch (error) {

        console.error("Update Timetable Slot Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};

// =====================================================
// DELETE TIMETABLE SLOT
// =====================================================

const deleteTimetableSlot = async (req, res) => {
    try {
        const { id } = req.params;

        const slotID = Number(id);

        if (!slotID) {
            return res.status(400).json({
                success: false,
                message: "Valid Timetable Slot ID is required...😔"
            });
        }

        // Find timetable slot
        const slot = await Timetable.findByPk(slotID);

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Timetable slot not found...🤨"
            });
        }

        // Delete slot
        await slot.destroy();

        return res.status(200).json({
            success: true,
            message: "Timetable slot deleted successfully...🗑️",
            deletedSlotID: slotID
        });

    } catch (error) {

        console.error("Delete Timetable Slot Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};

// =====================================================
// CLEAR TIMETABLE BY CLASS
// =====================================================

const clearTimetableByClass = async (req, res) => {
    try {
        const { classID } = req.params;

        const clsID = Number(classID);

        if (!clsID) {
            return res.status(400).json({
                success: false,
                message: "Valid Class ID is required...😔"
            });
        }

        // Check Class
        const classData = await Class.findByPk(clsID);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found...🤨"
            });
        }

        // Find timetable slots
        const timetable = await Timetable.findAll({
            where: {
                classID: clsID
            }
        });

        if (timetable.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No timetable found for this class...🤨"
            });
        }

        // Delete all timetable slots
        const deletedCount = await Timetable.destroy({
            where: {
                classID: clsID
            }
        });

        return res.status(200).json({
            success: true,
            message: "Class timetable cleared successfully...🗑️",
            classID: clsID,
            deletedCount
        });

    } catch (error) {

        console.error("Clear Timetable Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error...😔"
        });
    }
};

//======================================================
// resetTimetable
//======================================================

const resetTimetableByClass = async (req, res) => {
    try {
        const { classID } = req.params;

        // Check class
        const classData = await student.findByPk(classID);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        // Reset subject and staff assignments
        const [updatedCount] = await Timetable.update(
            {
                subjectID: null,
                staffID: null
            },
            {
                where: {
                    classID: classID
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Timetable reset successfully",
            resetSlots: updatedCount
        });

    } catch (error) {
        console.error("Reset Timetable Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to reset timetable",
            error: error.message
        });
    }
};

//======================================================
// get weekly timetable
//======================================================
const getWeeklyTimetable = async (req, res) => {
    try {

        const { classID } = req.params;


        // --------------------------------------------------
        // Check Class
        // --------------------------------------------------

        const classData = await student.findByPk(classID);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }


        // --------------------------------------------------
        // Get Timetable
        // --------------------------------------------------

        const timetable = await Timetable.findAll({

            where: {
                classID
            },

            include: [

                {
                    model: Subject,

                    attributes: [
                        "id",
                        "subject_name",
                        "subject_code",
                        "semester",
                        "weeklyPeriods"
                    ]
                },

                {
                    model: Staff,

                    attributes: [
                        "id",
                        "name",
                        "username"
                    ]
                }
            ],

            order: [
                ["period", "ASC"]
            ]
        });


        // --------------------------------------------------
        // Get Period Configuration
        // --------------------------------------------------

        const periods = await Period.findAll({

            order: [
                ["periodNumber", "ASC"]
            ]
        });


        // --------------------------------------------------
        // Day Structure
        // --------------------------------------------------

        const days = ["A", "B", "C", "D", "E", "F"];

        const weeklyTimetable = {};


        days.forEach(day => {

            weeklyTimetable[day] = {};

            periods.forEach(period => {

                weeklyTimetable[day][
                    period.periodNumber
                ] = null;

            });

        });


        // --------------------------------------------------
        // Fill Timetable
        // --------------------------------------------------

        timetable.forEach(slot => {

            const periodData = periods.find(
                period =>
                    period.periodNumber === slot.period
            );


            weeklyTimetable[slot.day][slot.period] = {

                slotID: slot.id,

                period: slot.period,

                timing: periodData
                    ? {
                        startTime:
                            periodData.startTime,

                        endTime:
                            periodData.endTime,

                        isBreak:
                            periodData.isBreak
                    }
                    : null,

                subject: slot.Subject
                    ? {
                        id:
                            slot.Subject.id,

                        name:
                            slot.Subject.subject_name,

                        code:
                            slot.Subject.subject_code
                    }
                    : null,

                staff: slot.Staff
                    ? {
                        id:
                            slot.Staff.id,

                        name:
                            slot.Staff.name,

                        username:
                            slot.Staff.username
                    }
                    : null
            };

        });


        // --------------------------------------------------
        // Response
        // --------------------------------------------------

        return res.status(200).json({

            success: true,

            class: {
                id: classData.id,

                username:
                    classData.username,

                year:
                    classData.year,

                semester:
                    classData.semester
            },

            days,

            timetable:
                weeklyTimetable
        });


    } catch (error) {

        console.error(
            "Weekly Timetable Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch weekly timetable",

            error:
                error.message
        });
    }
};

//======================================================
// gettoday timetable
//======================================================
const getTodayTimetable = async (req, res) => {
    try {

        const { classID } = req.params;


        // --------------------------------------------------
        // Check Class
        // --------------------------------------------------

        const classData = await student.findByPk(classID);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }


        // --------------------------------------------------
        // Get Today's Date - India Time
        // --------------------------------------------------

        const today = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Kolkata"
        }).format(new Date());


        // --------------------------------------------------
        // Find Day Order
        // --------------------------------------------------

        const dayOrderData = await DayOrder.findOne({
            where: {
                date: today
            }
        });


        if (!dayOrderData) {
            return res.status(404).json({
                success: false,
                message: "Day order not configured for today",
                date: today
            });
        }


        // --------------------------------------------------
        // Holiday / Non-working Day
        // --------------------------------------------------

        if (!dayOrderData.isWorkingDay) {

            return res.status(200).json({
                success: true,
                date: today,
                dayOrder: dayOrderData.dayOrder,
                workingDay: false,
                reason: dayOrderData.reason,
                timetable: []
            });
        }


        // --------------------------------------------------
        // Get Timetable
        // --------------------------------------------------

        const timetable = await Timetable.findAll({

            where: {
                classID,
                day: dayOrderData.dayOrder
            },

            include: [

                {
                    model: Subject,
                    attributes: [
                        "id",
                        "subject_name",
                        "subject_code",
                        "semester",
                        "weeklyPeriods"
                    ]
                },

                {
                    model: Staff,
                    attributes: [
                        "id",
                        "name",
                        "username"
                    ]
                }
            ],

            order: [
                ["period", "ASC"]
            ]
        });


        // --------------------------------------------------
        // Get Period Timing
        // --------------------------------------------------

        const periods = await Period.findAll({
            order: [
                ["periodNumber", "ASC"]
            ]
        });


        // --------------------------------------------------
        // Attach Period Timing
        // --------------------------------------------------

        const result = timetable.map(slot => {

            const periodData = periods.find(
                p =>
                    p.periodNumber === slot.period
            );


            return {

                slotID: slot.id,

                day: slot.day,

                period: slot.period,

                timing: periodData
                    ? {
                        startTime:
                            periodData.startTime,

                        endTime:
                            periodData.endTime,

                        isBreak:
                            periodData.isBreak
                    }
                    : null,

                subject: slot.Subject
                    ? {
                        id:
                            slot.Subject.id,

                        name:
                            slot.Subject.subject_name,

                        code:
                            slot.Subject.subject_code
                    }
                    : null,

                staff: slot.Staff
                    ? {
                        id:
                            slot.Staff.id,

                        name:
                            slot.Staff.name,

                        username:
                            slot.Staff.username
                    }
                    : null
            };
        });


        // --------------------------------------------------
        // Response
        // --------------------------------------------------

        return res.status(200).json({

            success: true,

            date: today,

            dayOrder:
                dayOrderData.dayOrder,

            workingDay: true,

            class: {
                id: classData.id,
                username: classData.username,
                year: classData.year,
                semester: classData.semester
            },

            timetable: result
        });


    } catch (error) {

        console.error(
            "Today Timetable Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch today's timetable",
            error: error.message
        });
    }
};

//======================================================
// EXPORT
// =====================================================

module.exports = {
    generateTimetableSlots,
    assignSubjectsToTimetable,
    getTimetableByClass,
    getTimetableByDepartment,
    updateTimetableSlot,
    deleteTimetableSlot,
    clearTimetableByClass,
    resetTimetableByClass,
    getWeeklyTimetable,
    getTodayTimetable
};
    