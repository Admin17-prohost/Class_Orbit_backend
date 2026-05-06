const Notification = require("../models/Notification");
const Timetable = require("../models/Timetable");

exports.createNotification = async (req, res) => {
  try {
    const { title, message, targetRole, targetUserId, type } = req.body;

    const notification = await Notification.create({
      title,
      message,
      targetRole,
      targetUserId,
      type,
    });

    res.status(201).json({
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create notification",
      error: error.message,
    });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        status: "active",
      },
      order: [["createdAt", "DESC"]],
    });

    const filtered = notifications.filter((item) => {
      return (
        item.targetRole === "all" ||
        item.targetRole === req.user.role ||
        item.targetUserId === req.user.id
      );
    });

    res.json({
      message: "Notifications fetched successfully",
      count: filtered.length,
      notifications: filtered,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update notification",
      error: error.message,
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    await notification.destroy();

    res.json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

exports.getTodayClassAlerts = async (req, res) => {
  try {
    const { day } = req.query;

    if (!day) {
      return res.status(400).json({
        message: "Day is required. Example: MON or A",
      });
    }

    let whereCondition = {
      day,
      status: "active",
    };

    if (req.user.role === "staff") {
      whereCondition.staffId = req.user.id;
    }

    const alerts = await Timetable.findAll({
      where: whereCondition,
      order: [["period", "ASC"]],
    });

    res.json({
      message: "Today class alerts fetched successfully",
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch class alerts",
      error: error.message,
    });
  }
};