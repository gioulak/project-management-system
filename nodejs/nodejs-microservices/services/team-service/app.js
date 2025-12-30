require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//import database connection
const connectDB = require('./config/database');

//import routes
const teamRoutes = require('./routes/team');

const port = process.env.PORT || 8081;
const app =  express();

//connect to mongodb
connectDB();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//health check
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'Team Service',
    timestamp: new Date().toISOString()
  });
});

//routes
app.use('/api/teams', teamRoutes);

//404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    type: 'error'
  });
});

//error handler
app.use ((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    type: 'error'
  });
});

app.listen(port, () => {
  console.log(`Team Service listening on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});