const express = require('express');
const router = express.Router();

// Sample notices data (replace with DB model if needed)
const sampleNotices = [
  {
    _id: '1',
    title: 'Academic Calendar 2026-27',
    description: 'Updated academic schedule for the upcoming year',
    fileUrl: null,
    createdAt: new Date('2026-03-01')
  },
  {
    _id: '2',
    title: 'Placement Drive Schedule',
    description: 'Upcoming company visits and placement opportunities',
    fileUrl: null,
    createdAt: new Date('2026-03-10')
  },
  {
    _id: '3',
    title: 'Placement Eligibility Criteria',
    description: 'Detailed guidelines for the upcoming recruitment season',
    fileUrl: null,
    createdAt: new Date('2026-03-15')
  }
];

// @route  GET /api/notices
// @access Public
router.get('/', (req, res) => {
  res.json(sampleNotices);
});

module.exports = router;
