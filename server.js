const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes');
require('dotenv').config({ path: './config/.env' });
require('./config/db');
const app = express();




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/api/user', userRoutes);

// server
app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on port ' + (process.env.PORT || 5000));
});