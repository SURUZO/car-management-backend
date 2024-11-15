const express = require('express');
const Car = require('../models/Car');
const auth = require('../middleware/auth'); // Authentication middleware
const router = express.Router();

// POST - Add a new car
router.post('/', auth, async (req, res) => {
  const { title, description, tags, images, numberPlate, registrationNumber, color, lastServiceDate } = req.body;

  // Check if all required fields are provided
  if (!title || !description || !tags || !images || !numberPlate || !registrationNumber || !color || !lastServiceDate) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  const car = new Car({
    title,
    description,
    tags,
    images,
    numberPlate,
    registrationNumber,
    color,
    lastServiceDate,
    owner: req.user.id // The logged-in user's ID will be set as the owner of the car
  });

  try {
    const savedCar = await car.save(); // Save the car to the database
    res.status(201).json(savedCar); // Send the saved car as the response
  } catch (err) {
    console.error('Error adding car:', err);
    res.status(500).json({ message: 'Error saving the car.' });
  }
});

// GET - Get all cars for a user
router.get('/', auth, async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user.id });
    res.json(cars); // Return all the cars associated with the logged-in user
  } catch (err) {
    console.error('Error fetching cars:', err);
    res.status(500).json({ message: 'Error fetching cars.' });
  }
});

// GET - Get a specific car by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car || car.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Car not found or you do not have permission to access it' });
    }
    res.json(car); // Return the car details
  } catch (err) {
    console.error('Error fetching car:', err);
    res.status(500).json({ message: 'Error fetching car.' });
  }
});

// PUT - Update a car's information
router.put('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car || car.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Car not found or you do not have permission to update it' });
    }

    // Update the car with the new data
    Object.assign(car, req.body);
    await car.save();
    res.json(car); // Return the updated car
  } catch (err) {
    console.error('Error updating car:', err);
    res.status(500).json({ message: 'Error updating car.' });
  }
});

// DELETE - Delete a car
router.delete('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car || car.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Car not found or you do not have permission to delete it' });
    }

    await Car.deleteOne({ _id: car._id }); // Delete the car from the database
    res.json({ message: 'Car deleted' }); // Return a success message
  } catch (err) {
    console.error('Error deleting car:', err);
    res.status(500).json({ message: 'Error deleting car.' });
  }
});

module.exports = router;
