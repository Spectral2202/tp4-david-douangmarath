const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const User = require('../models/user.model');

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

// Sample users with different roles
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    passwordConfirm: 'admin123',
    role: 'admin'
  },
  {
    name: 'Moderator User',
    email: 'moderator@example.com',
    password: 'moderator123',
    passwordConfirm: 'moderator123',
    role: 'moderator'
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user1234',
    passwordConfirm: 'user1234',
    role: 'user'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'user'
  }
];

const importData = async () => {
  try {
    await User.create(users);
    console.log('Données utilisateurs importées avec succès!');
    console.log('Utilisateurs créés:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
  } catch (err) {
    console.log("Erreur lors de l'importation des données utilisateurs:", err.message);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log(
      'Tous les utilisateurs ont été supprimés de la collection!'
    );
  } catch (err) {
    console.log('Erreur lors de la suppression des utilisateurs:', err.message);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log(
    'Argument invalide! Utilisez --import pour importer les utilisateurs ou --delete pour les supprimer.'
  );
  console.log('Exemple: node scripts/import-user-data.js --import');
  process.exit();
}