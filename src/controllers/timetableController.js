const Timetable = require("../models/Timetable");
const SubjectAllocation = require("../models/SubjectAllocation");

const WEEKLY_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
const CYCLE_DAYS = ["A", "B", "C", "D", "E", "F"];

const getDaysByMode = (mode) => {
  return mode === "cycle" ? CYCLE_DAYS : WEEKLY_DAYS;
};

const hasConflict = async ({
  classId,
  staffId,
  roomId,
  day,
  period,
  excludeId = null,
}) => {
  const slots = await Timetable.findAll({
    where: { day, period, status: "active" },
  });

  return slots.some((slot) => {
    if (excludeId && slot.id === Number(excludeId)) return false;

    return (
      slot.classId === Number(classId) ||
      slot.staffId === Number(staffId) ||
      slot.roomId === Number(roomId)
    );
  });
};

exports.generateTimetable = async (req, res) => {
  try {
    const { classId } = req.params;
    const {
      timetableMode = "weekly",
      periodsPerDay = 6,
      dayCount = 5,
    } = req.body;

    const days = getDaysByMode(timetableMode).slice(0, dayCount);

    const allocations = await SubjectAllocation.findAll({
      where: {
        classId,
        status: "active",
      },
    });

    if (allocations.length === 0) {
      return res.status(404).json({
        message: "No subject allocations found for this class",
      });
    }

    await Timetable.destroy({ where: { classId } });

    const sortedAllocations = [...allocations].sort((a, b) => {
      if (a.subjectType === "practical" && b.subjectType !== "practical") {
        return -1;
      }
      if (a.subjectType !== "practical" && b.subjectType === "practical") {
        return 1;
      }
      return b.weeklyHours - a.weeklyHours;
    });

    const createdSlots = [];
    const pendingSubjects = [];

    for (const allocation of sortedAllocations) {
      let remainingHours = allocation.weeklyHours;
      let attempts = 0;
      let dayIndex = 0;

      while (remainingHours > 0 && attempts < 500) {
        const day = days[dayIndex % days.length];
        const blockSize =
          allocation.subjectType === "practical" && remainingHours >= 2
            ? 2
            : 1;

        let placed = false;

        for (let period = 1; period <= periodsPerDay; period++) {
          if (period + blockSize - 1 > periodsPerDay) continue;

          let conflict = false;

          for (let offset = 0; offset < blockSize; offset++) {
            const currentPeriod = period + offset;

            const slotConflict = await hasConflict({
              classId: allocation.classId,
              staffId: allocation.staffId,
              roomId: allocation.roomId,
              day,
              period: currentPeriod,
            });

            const sameSubjectSameDay = await Timetable.findOne({
              where: {
                classId: allocation.classId,
                subjectId: allocation.subjectId,
                day,
              },
            });

            if (
              slotConflict ||
              (allocation.subjectType !== "practical" && sameSubjectSameDay)
            ) {
              conflict = true;
              break;
            }
          }

          if (!conflict) {
            for (let offset = 0; offset < blockSize; offset++) {
              const slot = await Timetable.create({
                classId: allocation.classId,
                subjectId: allocation.subjectId,
                staffId: allocation.staffId,
                roomId: allocation.roomId,
                timetableMode,
                day,
                period: period + offset,
                subjectType: allocation.subjectType,
              });

              createdSlots.push(slot);
            }

            remainingHours -= blockSize;
            placed = true;
            break;
          }
        }

        dayIndex++;
        attempts++;

        if (!placed && attempts > 200) break;
      }

      if (remainingHours > 0) {
        pendingSubjects.push({
          subjectId: allocation.subjectId,
          pendingHours: remainingHours,
        });
      }
    }

    res.status(201).json({
      message:
        pendingSubjects.length > 0
          ? "Timetable generated with pending hours"
          : "Timetable generated successfully",
      createdCount: createdSlots.length,
      pendingSubjects,
      timetable: createdSlots,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate timetable",
      error: error.message,
    });
  }
};

exports.getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.findAll({
      order: [
        ["classId", "ASC"],
        ["day", "ASC"],
        ["period", "ASC"],
      ],
    });

    res.json({
      message: "Timetables fetched successfully",
      count: timetables.length,
      timetables,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch timetables",
      error: error.message,
    });
  }
};

exports.getTimetableByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const timetable = await Timetable.findAll({
      where: { classId },
      order: [
        ["day", "ASC"],
        ["period", "ASC"],
      ],
    });

    res.json({
      message: "Class timetable fetched successfully",
      count: timetable.length,
      timetable,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch class timetable",
      error: error.message,
    });
  }
};

exports.updateTimetableSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectId, staffId, roomId, day, period, subjectType } = req.body;

    const slot = await Timetable.findByPk(id);

    if (!slot) {
      return res.status(404).json({
        message: "Timetable slot not found",
      });
    }

    const conflict = await hasConflict({
      classId: slot.classId,
      staffId: staffId || slot.staffId,
      roomId: roomId || slot.roomId,
      day: day || slot.day,
      period: period || slot.period,
      excludeId: id,
    });

    if (conflict) {
      return res.status(400).json({
        message:
          "Conflict found: same class/staff/room already assigned in this slot",
      });
    }

    await slot.update({
      subjectId: subjectId || slot.subjectId,
      staffId: staffId || slot.staffId,
      roomId: roomId || slot.roomId,
      day: day || slot.day,
      period: period || slot.period,
      subjectType: subjectType || slot.subjectType,
    });

    res.json({
      message: "Timetable slot updated successfully",
      slot,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update timetable slot",
      error: error.message,
    });
  }
};

exports.moveTimetableSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { day, period } = req.body;

    const slot = await Timetable.findByPk(id);

    if (!slot) {
      return res.status(404).json({
        message: "Timetable slot not found",
      });
    }

    const conflict = await hasConflict({
      classId: slot.classId,
      staffId: slot.staffId,
      roomId: slot.roomId,
      day,
      period,
      excludeId: id,
    });

    if (conflict) {
      return res.status(400).json({
        message:
          "Conflict found: same class/staff/room already assigned in target slot",
      });
    }

    slot.day = day;
    slot.period = period;
    await slot.save();

    res.json({
      message: "Timetable slot moved successfully",
      slot,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to move timetable slot",
      error: error.message,
    });
  }
};

exports.deleteTimetableSlot = async (req, res) => {
  try {
    const slot = await Timetable.findByPk(req.params.id);

    if (!slot) {
      return res.status(404).json({
        message: "Timetable slot not found",
      });
    }

    await slot.destroy();

    res.json({
      message: "Timetable slot deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete timetable slot",
      error: error.message,
    });
  }
};

exports.clearClassTimetable = async (req, res) => {
  try {
    const { classId } = req.params;

    await Timetable.destroy({
      where: { classId },
    });

    res.json({
      message: "Class timetable cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear class timetable",
      error: error.message,
    });
  }
};


exports.checkStaffAvailability = async (req, res) => {
  try {
    const { staffId, day, period } = req.query;

    const slot = await Timetable.findOne({
      where: {
        staffId,
        day,
        period,
        status: "active",
      },
    });

    if (slot) {
      return res.json({
        status: "busy",
        message: "Staff is busy in this period",
        slot,
      });
    }

    res.json({
      status: "free",
      message: "Staff is free in this period",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to check staff availability",
      error: error.message,
    });
  }
};

exports.getStaffFullDaySchedule = async (req, res) => {
  try {
    const { staffId, day } = req.query;

    const schedule = await Timetable.findAll({
      where: {
        staffId,
        day,
        status: "active",
      },
      order: [["period", "ASC"]],
    });

    res.json({
      message: "Staff full day schedule fetched successfully",
      count: schedule.length,
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch staff schedule",
      error: error.message,
    });
  }
};

exports.checkClassHour = async (req, res) => {
  try {
    const { classId, day, period } = req.query;

    const slot = await Timetable.findOne({
      where: {
        classId,
        day,
        period,
        status: "active",
      },
    });

    if (slot) {
      return res.json({
        status: "class",
        message: "Class hour found",
        slot,
      });
    }

    res.json({
      status: "free",
      message: "Free hour for this class",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to check class hour",
      error: error.message,
    });
  }
};

exports.getClassFullDaySchedule = async (req, res) => {
  try {
    const { classId, day } = req.query;

    const schedule = await Timetable.findAll({
      where: {
        classId,
        day,
        status: "active",
      },
      order: [["period", "ASC"]],
    });

    res.json({
      message: "Class full day schedule fetched successfully",
      count: schedule.length,
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch class schedule",
      error: error.message,
    });
  }
};