const sequelize = require("../config/db");

const admin = require("./admin_model");
const hod = require("./hod_model");
const staff = require("./staff_model");
const official = require("./official_model"); 
const student = require("./class_model");
const department = require("./department_model");
const subject = require("./subject_model");
const timetable = require("./timetable_model");

// Relationships

//department - HOD
department.hasOne(hod, { foreignKey: "departmentID" });
hod.belongsTo(department, { foreignKey: "departmentID" });

//department - staff
department.hasMany(staff, { foreignKey: "departmentID" });
staff.belongsTo(department, { foreignKey: "departmentID" });

//department - subject
department.hasMany(subject, { foreignKey: "departmentID" });
subject.belongsTo(department, { foreignKey: "departmentID" });

//department - classLogin
department.hasMany(student, { foreignKey: "departmentID" });
student.belongsTo(department, { foreignKey: "departmentID" });

//subject - staff
subject.belongsTo(staff, { foreignKey: "staffID" });
staff.hasMany(subject, { foreignKey: "staffID" });

// Department - Timetable
department.hasMany(timetable, { foreignKey: "departmentID" });
timetable.belongsTo(department, { foreignKey: "departmentID" });

// Class - Timetable
student.hasMany(timetable, { foreignKey: "classID" });
timetable.belongsTo(student, { foreignKey: "classID" });

// Subject - Timetable
subject.hasMany(timetable, { foreignKey: "subjectID" });
timetable.belongsTo(subject, { foreignKey: "subjectID" });

// Staff - Timetable
staff.hasMany(timetable, { foreignKey: "staffID" });
timetable.belongsTo(staff, { foreignKey: "staffID" });

module.exports = {
    sequelize,
    admin,
    hod,
    staff,
    official,
    student,
    department,
    subject,
    timetable,
};