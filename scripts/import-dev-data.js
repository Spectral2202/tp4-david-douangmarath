const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const Tour = require('../models/tour.model');

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const connectString =
  process.env.NODE_ENV === 'development'
    ? process.env.LOCAL_DATABASE
    : process.env.MONGODB_ATLAS;

mongoose
  .connect(connectString)
  .then(() => {
    console.log(
      `Connexion à MongoDB réussie ! Environnement: ${
        process.env.NODE_ENV || 'production'
      }`
    );
  })
  .catch((err) => {
    console.log('Échec de connexion à MongoDB:', err.message);
    process.exit(1);
  });

const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../dev-data/data/tours-simple.json'),
    'utf-8'
  )
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Données importées avec succès dans la collection natours!');
  } catch (err) {
    console.log("Erreur lors de l'importation des données:", err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log(
      'Toutes les données ont été supprimées de la collection natours!'
    );
  } catch (err) {
    console.log('Erreur lors de la suppression des données:', err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log(
    'Argument invalide! Utilisez --import pour importer les données ou --delete pour les supprimer.'
  );
  process.exit();
}
