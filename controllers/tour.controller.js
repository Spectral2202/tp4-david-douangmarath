const tourService = require('../services/tour.service');
const APIFeatures = require('../utils/api-features');
const Tour = require('../models/tour.model');

const aliasTopTours = (req, res, next) => {
  req.query = {
    limit: '5',
    sort: 'price,-ratingsAverage',
    fields: 'name,price,ratingsAverage,summary,difficulty',
  };

  next();
};

const getAllTours = async (req, res) => {
  try {
    let query;

    if (process.env.USE_MONGO === 'true') {
      const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      query = await features.query;
    } else {
      query = await tourService.getAllTours();
    }

    res.status(200).json({
      status: 'success',
      results: query.length,
      data: { tours: query },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const id =
      process.env.USE_MONGO === 'true'
        ? req.params.id
        : parseInt(req.params.id);
    const tour = await tourService.getTourById(id);

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const requiredFields = [
      'name',
      'duration',
      'maxGroupSize',
      'difficulty',
      'price',
      'summary',
      'description',
      'imageCover',
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    const newTour = await tourService.createTour(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const id =
      process.env.USE_MONGO === 'true'
        ? req.params.id
        : parseInt(req.params.id);
    const updatedTour = await tourService.updateTour(id, req.body);

    if (!updatedTour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { tour: updatedTour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const id =
      process.env.USE_MONGO === 'true'
        ? req.params.id
        : parseInt(req.params.id);
    const deletedTour = await tourService.deleteTour(id);

    if (!deletedTour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numToursStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: {
          month: '$_id'
        }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numToursStarts: -1 }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
