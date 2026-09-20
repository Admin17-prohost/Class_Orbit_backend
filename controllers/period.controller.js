const Period = require("../models/period_model");

// CREATE PERIOD
const createPeriod = async (req, res) => {
    try {
        const {
            periodNumber,
            startTime,
            endTime,
            isBreak
        } = req.body;

        if (!periodNumber || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "periodNumber, startTime and endTime are required"
            });
        }

        const existingPeriod = await Period.findOne({
            where: {
                periodNumber
            }
        });

        if (existingPeriod) {
            return res.status(409).json({
                success: false,
                message: "Period number already exists"
            });
        }

        const period = await Period.create({
            periodNumber,
            startTime,
            endTime,
            isBreak: isBreak ?? false
        });

        return res.status(201).json({
            success: true,
            message: "Period created successfully",
            period
        });

    } catch (error) {
        console.error("Create Period Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create period",
            error: error.message
        });
    }
};


// GET ALL PERIODS
const getAllPeriods = async (req, res) => {
    try {

        const periods = await Period.findAll({
            order: [["periodNumber", "ASC"]]
        });

        return res.status(200).json({
            success: true,
            count: periods.length,
            periods
        });

    } catch (error) {
        console.error("Get Periods Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch periods",
            error: error.message
        });
    }
};


// UPDATE PERIOD
const updatePeriod = async (req, res) => {
    try {
        const { id } = req.params;

        const period = await Period.findByPk(id);

        if (!period) {
            return res.status(404).json({
                success: false,
                message: "Period not found"
            });
        }

        const {
            periodNumber,
            startTime,
            endTime,
            isBreak
        } = req.body;

        if (periodNumber !== undefined) {
            const duplicate = await Period.findOne({
                where: {
                    periodNumber,
                    id: {
                        [require("sequelize").Op.ne]: id
                    }
                }
            });

            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message: "Period number already exists"
                });
            }
        }

        await period.update({
            periodNumber: periodNumber ?? period.periodNumber,
            startTime: startTime ?? period.startTime,
            endTime: endTime ?? period.endTime,
            isBreak: isBreak ?? period.isBreak
        });

        return res.status(200).json({
            success: true,
            message: "Period updated successfully",
            period
        });

    } catch (error) {
        console.error("Update Period Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update period",
            error: error.message
        });
    }
};


// DELETE PERIOD
const deletePeriod = async (req, res) => {
    try {
        const { id } = req.params;

        const period = await Period.findByPk(id);

        if (!period) {
            return res.status(404).json({
                success: false,
                message: "Period not found"
            });
        }

        await period.destroy();

        return res.status(200).json({
            success: true,
            message: "Period deleted successfully"
        });

    } catch (error) {
        console.error("Delete Period Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete period",
            error: error.message
        });
    }
};


module.exports = {
    createPeriod,
    getAllPeriods,
    updatePeriod,
    deletePeriod
};