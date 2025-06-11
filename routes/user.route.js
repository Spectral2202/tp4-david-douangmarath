const express = require("express");
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.get("/me", authController.verifyToken, userController.getMe);
router.patch("/me", authController.verifyToken, userController.updateMe);
router.delete("/me", authController.verifyToken, userController.deleteMe);

router
  .route("/")
  .get(
    authController.verifyToken,
    authController.checkRole("admin"),
    userController.getAllUsers
  )
  .post(
    authController.verifyToken,
    authController.checkRole("admin"),
    userController.createUser
  );

router
  .route("/:id")
  .get(authController.verifyToken, userController.getUser)
  .patch(authController.verifyToken, userController.updateUser)
  .delete(
    authController.verifyToken,
    authController.checkRole("admin"),
    userController.deleteUser
  );

module.exports = router;
