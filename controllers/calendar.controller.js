const Calendar = require("../models/calendar_model");

// CREATE
const createCalendar = async (req, res) => {
  try {
    const { date, type, description } = req.body;

    if (!date || !type) {
      return res.status(400).json({
        success: false,
        message: "Date and type are required",
      });
    }

    const existing = await Calendar.findOne({
      where: { date },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Calendar entry already exists for this date",
      });
    }

    const calendar = await Calendar.create({
      date,
      type,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Calendar entry created successfully",
      data: calendar,
    });
  } catch (error) {
    console.error("Calendar Create Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create calendar entry",
      error: error.message,
    });
  }
};

// GET ALL
const getAllCalendar = async (req, res) => {
  try {
    const calendars = await Calendar.findAll({
      order: [["date", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: calendars,
    });
  } catch (error) {
    console.error("Calendar Get Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch calendar",
      error: error.message,
    });
  }
};

// GET ONE
const getCalendarById = async (req, res) => {
  try {
    const calendar = await Calendar.findByPk(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: "Calendar entry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: calendar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch calendar entry",
      error: error.message,
    });
  }
};

// UPDATE
const updateCalendar = async (req, res) => {
  try {
    const { date, type, description } = req.body;

    const calendar = await Calendar.findByPk(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: "Calendar entry not found",
      });
    }

    await calendar.update({
      date,
      type,
      description,
    });

    res.status(200).json({
      success: true,
      message: "Calendar entry updated successfully",
      data: calendar,
    });
  } catch (error) {
    console.error("Calendar Update Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update calendar entry",
      error: error.message,
    });
  }
};

// DELETE
const deleteCalendar = async (req, res) => {
  try {
    const calendar = await Calendar.findByPk(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: "Calendar entry not found",
      });
    }

    await calendar.destroy();

    res.status(200).json({
      success: true,
      message: "Calendar entry deleted successfully",
    });
  } catch (error) {
    console.error("Calendar Delete Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete calendar entry",
      error: error.message,
    });
  }
};

module.exports = {
  createCalendar,
  getAllCalendar,
  getCalendarById,
  updateCalendar,
  deleteCalendar,
};