const Setting = require("../models/Setting");

exports.createSetting = async (req, res) => {
  try {
    const setting = await Setting.create(req.body);

    res.status(201).json({
      message: "Settings created successfully",
      setting,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create settings",
      error: error.message,
    });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Settings fetched successfully",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const setting = await Setting.findByPk(req.params.id);

    if (!setting) {
      return res.status(404).json({ message: "Settings not found" });
    }

    await setting.update(req.body);

    res.json({
      message: "Settings updated successfully",
      setting,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update settings",
      error: error.message,
    });
  }
};