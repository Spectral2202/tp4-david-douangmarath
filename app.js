const express = require('express');
const path = require('path');
const userRouter = require('./routes/user.route');
const tourRouter = require('./routes/tour.route');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log('--------------------------------');
  console.log('Requête entrante:');
  console.log(`  Méthode: ${req.method}`);
  console.log(`  URL: ${req.url}`);
  console.log(`  Path: ${req.path}`);
  console.log(`  Params:`, req.params);
  console.log(`  Query: `, req.query);
  console.log(`  Query type: ${typeof req.query}`);
  console.log(`  Query keys: ${Object.keys(req.query).join(', ')}`);
  console.log('--------------------------------');
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.get('/route', function (req, res) {
  res.send('Réponse à la requête GET à /route');
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

const connectString =
  process.env.NODE_ENV === 'development'
    ? process.env.LOCAL_DATABASE
    : process.env.MONGODB_ATLAS;

mongoose
  .connect(connectString)
  .then(() => {
    console.log(
      `Connection to MongoDB has succeeded !! Using: ${
        process.env.NODE_ENV || 'production'
      } environment`
    );
  })
  .catch((err) => {
    console.log('Connection to MongoDB has failed:', err.message);
  });
