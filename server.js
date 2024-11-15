const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());

// Increase the request body size limit to 50MB (adjust as needed)
app.use(express.json({ limit: '50mb' }));  // Set limit to 50MB for JSON requests
app.use(express.urlencoded({ limit: '50mb', extended: true }));  // Handle URL-encoded data

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
