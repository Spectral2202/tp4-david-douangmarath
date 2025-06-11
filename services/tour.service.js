const fs = require('fs');
const path = require('path');
const Tour = require('../models/tour.model');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../dev-data/data/tours-simple.json'))
);

// MongoDB Functions
const getAllToursMongo = async () => {
  console.log('getAllToursMongo');
  return await Tour.find();
};

const getTourByIdMongo = async (id) => {
  return await Tour.findById(id);
};

const createTourMongo = async (tourData) => {
  return await Tour.create(tourData);
};

const updateTourMongo = async (id, tourData) => {
  return await Tour.findByIdAndUpdate(id, tourData, {
    new: true,
    runValidators: true,
  });
};

const deleteTourMongo = async (id) => {
  return await Tour.findByIdAndDelete(id);
};

// JSON File Functions (temporary)
const getAllToursJSON = () => {
  console.log('getAllToursJSON');
  return tours;
};

const getTourByIdJSON = (id) => {
  return tours.find((tour) => tour.id === id);
};

const createTourJSON = (tourData) => {
  const newId = tours.length > 0 ? tours[tours.length - 1].id + 1 : 1;
  const newTour = Object.assign({ id: newId }, tourData);

  tours.push(newTour);
  saveToursJSON();

  return newTour;
};

const updateTourJSON = (id, tourData) => {
  const tour = tours.find((tour) => tour.id === id);
  if (!tour) return null;

  const updatedTour = Object.assign(tour, tourData);
  const index = tours.indexOf(tour);
  tours[index] = updatedTour;

  saveToursJSON();

  return updatedTour;
};

const deleteTourJSON = (id) => {
  const tour = tours.find((tour) => tour.id === id);
  if (!tour) return null;

  const index = tours.indexOf(tour);
  const deletedTour = tours.splice(index, 1)[0];

  saveToursJSON();

  return deletedTour;
};

const saveToursJSON = () => {
  fs.writeFileSync(
    path.join(__dirname, '../dev-data/data/tours-simple.json'),
    JSON.stringify(tours, null, 2)
  );
};

module.exports = {
  getAllTours:
    process.env.USE_MONGO === 'true' ? getAllToursMongo : getAllToursJSON,
  getTourById:
    process.env.USE_MONGO === 'true' ? getTourByIdMongo : getTourByIdJSON,
  createTour:
    process.env.USE_MONGO === 'true' ? createTourMongo : createTourJSON,
  updateTour:
    process.env.USE_MONGO === 'true' ? updateTourMongo : updateTourJSON,
  deleteTour:
    process.env.USE_MONGO === 'true' ? deleteTourMongo : deleteTourJSON,
};
