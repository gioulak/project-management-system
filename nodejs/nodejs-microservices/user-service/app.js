require('dotenv').config();
const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");


//importing the routes
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const adminRouter = require('./routes/admin');

require('./config/database');

//port on which the server will run
const port = process.env.PORT || 8080;

const app = express();
app.use(cors());
//adding middleware to parse the cookies and more
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        service: 'User Service',
        timestamp: new Date().toISOString()
    });
});

//routes
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin/', adminRouter);

//404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path
    });
});

//error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

app.listen(port, () => {
    console.log(`User service listening on port ${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
});