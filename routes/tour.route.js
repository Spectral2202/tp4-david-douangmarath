const express = require('express');
const tourController = require('../controllers/tour.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/tour-stats')
  .get(authController.verifyToken, authController.restrictTo('admin', 'moderator'), tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(authController.verifyToken, authController.restrictTo('admin', 'moderator'), tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.verifyToken, authController.restrictTo('admin', 'moderator'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.verifyToken, authController.restrictTo('admin', 'moderator'), tourController.updateTour)
  .delete(authController.verifyToken, authController.checkRole('admin'), tourController.deleteTour);

module.exports = router;
