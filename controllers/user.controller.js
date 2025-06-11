const userService = require('../services/user.service');

const getAllUsers = (req, res) => {
  try {
    const users = userService.getAllUsers();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching users',
    });
  }
};

const getUser = (req, res) => {
  try {
    const user = userService.getUserById(parseInt(req.params.id));

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user',
    });
  }
};

const createUser = (req, res) => {
  try {
    const requiredFields = [
      'name',
      'email',
      'role',
      'active',
      'password',
      'photo',
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    const newUser = userService.createUser(req.body);

    res.status(201).json({
      status: 'success',
      data: { user: newUser },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating user',
    });
  }
};

const updateUser = (req, res) => {
  try {
    const updatedUser = userService.updateUser(
      parseInt(req.params.id),
      req.body
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating user',
    });
  }
};

const deleteUser = (req, res) => {
  try {
    const deletedUser = userService.deleteUser(parseInt(req.params.id));

    if (!deletedUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting user',
    });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
