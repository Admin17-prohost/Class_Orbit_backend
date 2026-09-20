const { Op } = require("sequelize");
const DayOrder = require("../models/dayOrder_model");

// CREATE
const createDayOrder = async (req, res) => {
    try {
        const {
            dayOrder,
            date,
            isWorkingDay,
            reason
        } = req.body;

        if (!dayOrder || !date) {
            return res.status(400).json({
                success: false,
                message: "dayOrder and date are required"
            });
        }

        // Check duplicate date
        const existingDate = await DayOrder.findOne({
            where: { date }
        });

        if (existingDate) {
            return res.status(409).json({
                success: false,
                message: "Day order already exists for this date"
            });
        }

        const newDayOrder = await DayOrder.create({
            dayOrder,
            date,
            isWorkingDay: isWorkingDay ?? true,
            reason: reason ?? null
        });

        return res.status(201).json({
            success: true,
            message: "Day order created successfully",
            dayOrder: newDayOrder
        });

    } catch (error) {
        console.error("Create Day Order Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create day order",
            error: error.message
        });
    }
};


// GET ALL
const getAllDayOrders = async (req, res) => {
    try {
        const dayOrders = await DayOrder.findAll({
            order: [["date", "ASC"]]
        });

        return res.status(200).json({
            success: true,
            count: dayOrders.length,
            dayOrders
        });

    } catch (error) {
        console.error("Get Day Orders Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch day orders",
            error: error.message
        });
    }
};


// GET TODAY
const getTodayDayOrder = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];

        const dayOrder = await DayOrder.findOne({
            where: {
                date: today
            }
        });

        if (!dayOrder) {
            return res.status(404).json({
                success: false,
                message: "No day order configured for today"
            });
        }

        return res.status(200).json({
            success: true,
            dayOrder
        });

    } catch (error) {
        console.error("Get Today Day Order Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch today's day order",
            error: error.message
        });
    }
};


// UPDATE
const updateDayOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const dayOrder = await DayOrder.findByPk(id);

        if (!dayOrder) {
            return res.status(404).json({
                success: false,
                message: "Day order not found"
            });
        }

        const {
            date,
            dayOrder: newDayOrder,
            isWorkingDay,
            reason
        } = req.body;

        // Check duplicate date
        if (date && date !== dayOrder.date) {
            const duplicateDate = await DayOrder.findOne({
                where: {
                    date,
                    id: {
                        [Op.ne]: id
                    }
                }
            });

            if (duplicateDate) {
                return res.status(409).json({
                    success: false,
                    message: "Another day order already exists for this date"
                });
            }
        }

        await dayOrder.update({
            date: date ?? dayOrder.date,
            dayOrder: newDayOrder ?? dayOrder.dayOrder,
            isWorkingDay:
                isWorkingDay ?? dayOrder.isWorkingDay,
            reason: reason ?? dayOrder.reason
        });

        return res.status(200).json({
            success: true,
            message: "Day order updated successfully",
            dayOrder
        });

    } catch (error) {
        console.error("Update Day Order Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update day order",
            error: error.message
        });
    }
};


// DELETE
const deleteDayOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const dayOrder = await DayOrder.findByPk(id);

        if (!dayOrder) {
            return res.status(404).json({
                success: false,
                message: "Day order not found"
            });
        }

        await dayOrder.destroy();

        return res.status(200).json({
            success: true,
            message: "Day order deleted successfully"
        });

    } catch (error) {
        console.error("Delete Day Order Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete day order",
            error: error.message
        });
    }
};


module.exports = {
    createDayOrder,
    getAllDayOrders,
    getTodayDayOrder,
    updateDayOrder,
    deleteDayOrder
};