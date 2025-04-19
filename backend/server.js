const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const assetRoutes = require('./routes/assets');
const activityRoutes = require('./routes/activities');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes); // <-- Now assets will use /api/assets
app.use('/api/activities', activityRoutes);
app.use('/api/activities', activityRoutes);



// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));