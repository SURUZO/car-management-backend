const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration: Allow only your frontend domain
const allowedOrigins = ['https://car-management-frontend-5wz7nq5xg-suruzos-projects.vercel.app/register'];  // Your frontend URL

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) { 
      // Allow requests from allowed origins or from the same origin (useful for development)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Include OPTIONS for preflight requests
  allowedHeaders: ['Content-Type', 'Authorization'],  // Headers allowed in requests
  credentials: true,  // Allow credentials if necessary
};

// Enable CORS with the specified options
app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests to support preflight checks
app.options('*', cors(corsOptions));  // Preflight CORS for all routes

// Increase the request body size limit to 50MB
app.use(express.json({ limit: '50mb' }));  
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/user');
const carRoutes = require('./routes/car');

// Set up routes
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
