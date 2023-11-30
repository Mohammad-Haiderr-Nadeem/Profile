const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');

const app = express();
app.use(
  cors({
    origin: ['http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true
  })
);
app.use(cookieParser());

const usersRoute = require('./routes/users');

app.use(express.json());
app.use('/', usersRoute);


const PORT = 8001;
app.listen(PORT, async () => {
  console.log('Server running on port 8000');
  try {
    await sequelize.authenticate();
    console.log('database connection has been established');
  } catch (err) {
    console.log('error in authentication')
  }
});
