const userService = require("../services/user.service");

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const id =
      process.env.USE_MONGO === "true"
        ? req.params.id
        : parseInt(req.params.id);
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const requiredFields = ["name", "email", "password", "passwordConfirm"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const newUser = await userService.createUser(req.body);

    res.status(201).json({
      status: "success",
      data: { user: newUser },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const id =
      process.env.USE_MONGO === "true"
        ? req.params.id
        : parseInt(req.params.id);

    const { password, passwordConfirm, ...filteredBody } = req.body;

    if (filteredBody.role && req.user.role !== "admin") {
      return res.status(403).json({
        status: "fail",
        message: "Only administrators can change user roles",
      });
    }

    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== id.toString()
    ) {
      return res.status(403).json({
        status: "fail",
        message: "You can only update your own profile",
      });
    }

    const updatedUser = await userService.updateUser(id, filteredBody);

    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id =
      process.env.USE_MONGO === "true"
        ? req.params.id
        : parseInt(req.params.id);

    if (req.user._id.toString() === id.toString()) {
      return res.status(400).json({
        status: "fail",
        message: "You cannot delete your own account",
      });
    }

    const deletedUser = await userService.deleteUser(id);

    if (!deletedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user._id);

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const updateMe = async (req, res) => {
  try {
    const { password, passwordConfirm, role, active, ...filteredBody } =
      req.body;

    const updatedUser = await userService.updateUser(
      req.user._id,
      filteredBody
    );

    res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const deleteMe = async (req, res) => {
  try {
    await userService.updateUser(req.user._id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
};
