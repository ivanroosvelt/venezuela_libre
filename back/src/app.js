const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const sequelize = require('./utils/database');
const rateLimiter = require('./middleware/rateLimiter');
const referenceRoutes = require('./routes/referenceRoutes');
const { swaggerUi, specs } = require('./config/swagger');

const app = express();

app.use(bodyParser.json());
app.use('/auth', rateLimiter, authRoutes);
app.use('/user', userRoutes);
app.use('/references', referenceRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorHandler);
sequelize
  .sync({ force: false })
  .then((result) => {
    console.log('Database connected!');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
