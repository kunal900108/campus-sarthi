const express = require('express');
const router = express.Router();

// Sample events data (replace with DB model if needed)
const sampleEvents = [
  {
    _id: '1',
    title: 'TCS Placement Drive',
    department: 'All Branches',
    venue: 'Auditorium',
    startDate: new Date('2026-04-10'),
    status: 'upcoming'
  },
  {
    _id: '2',
    title: 'Resume Building Workshop',
    department: 'CSE / IT',
    venue: 'Seminar Hall',
    startDate: new Date('2026-04-05'),
    status: 'upcoming'
  },
  {
    _id: '3',
    title: 'Mock Interview Session',
    department: 'All Branches',
    venue: 'Lab Block 3',
    startDate: new Date('2026-03-30'),
    status: 'completed'
  }
];

// @route  GET /api/events
// @access Public
router.get('/', (req, res) => {
  res.json(sampleEvents);
});

module.exports = router;
