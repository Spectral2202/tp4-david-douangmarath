const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post(
  "/signup-admin",
  authController.protect,
  authController.restrictTo("admin"),
  authController.signupAdmin
);

module.exports = router;
