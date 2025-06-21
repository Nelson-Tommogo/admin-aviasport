import Flight from '../models/Flight.js';

export const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find().populate('flightPlan');
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id).populate('flightPlan');
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    res.json(flight);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createFlight = async (req, res) => {
  try {
    const { flightNumber, startTime, endTime, result, multiplier, players, flightPlan } = req.body;
    if (multiplier === undefined) return res.status(400).json({ error: 'Multiplier is required' });
    const flight = new Flight({ flightNumber, startTime, endTime, result, multiplier, players, flightPlan });
    await flight.save();
    await flight.populate('flightPlan');
    res.status(201).json(flight);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    res.json(flight);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    res.json({ message: 'Flight deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 