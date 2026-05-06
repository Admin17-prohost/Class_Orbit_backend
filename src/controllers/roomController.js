const Room = require("../models/Room");

exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, capacity, department, status } = req.body;

    const existingRoom = await Room.findOne({
      where: { roomNumber },
    });

    if (existingRoom) {
      return res.status(400).json({
        message: "Room number already exists",
      });
    }

    const room = await Room.create({
      roomNumber,
      roomType,
      capacity,
      department,
      status,
    });

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create room",
      error: error.message,
    });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Rooms fetched successfully",
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch rooms",
      error: error.message,
    });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.json({
      message: "Room fetched successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch room",
      error: error.message,
    });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, capacity, department, status } = req.body;

    const room = await Room.findByPk(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (roomNumber && roomNumber !== room.roomNumber) {
      const existingRoom = await Room.findOne({
        where: { roomNumber },
      });

      if (existingRoom) {
        return res.status(400).json({
          message: "Room number already exists",
        });
      }
    }

    await room.update({
      roomNumber: roomNumber || room.roomNumber,
      roomType: roomType || room.roomType,
      capacity: capacity || room.capacity,
      department: department || room.department,
      status: status || room.status,
    });

    res.json({
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update room",
      error: error.message,
    });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    await room.destroy();

    res.json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete room",
      error: error.message,
    });
  }
};