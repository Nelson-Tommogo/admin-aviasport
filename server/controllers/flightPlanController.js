import FlightPlan from '../models/FlightPlan.js';

export const getAllFlightPlans = async (req, res) => {
  try {
    const plans = await FlightPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFlightPlanById = async (req, res) => {
  try {
    const plan = await FlightPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'FlightPlan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createFlightPlan = async (req, res) => {
  try {
    const plan = new FlightPlan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateFlightPlan = async (req, res) => {
  try {
    const plan = await FlightPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ error: 'FlightPlan not found' });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteFlightPlan = async (req, res) => {
  try {
    const plan = await FlightPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ error: 'FlightPlan not found' });
    res.json({ message: 'FlightPlan deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 