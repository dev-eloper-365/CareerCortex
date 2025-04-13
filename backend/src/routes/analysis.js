const express = require('express');
const router = express.Router();
const Analysis = require('../models/Analysis');

// Get latest analysis
router.get('/user/analysis', async (req, res) => {
  try {
    // Find the most recent analysis without requiring a specific user
    const analysis = await Analysis.findOne()
      .sort({ timestamp: -1 })
      .select({
        'analysis.skills': 1,
        'analysis.career1': 1,
        'analysis.career2': 1,
        'analysis.career3': 1,
        '_id': 0
      });

    if (!analysis) {
      return res.status(404).json({ message: 'No analysis found' });
    }

    // Send the analysis data
    res.json(analysis);

  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a test route to create sample data
router.post('/test/create-analysis', async (req, res) => {
  try {
    const sampleAnalysis = new Analysis({
      chatId: '507f1f77bcf86cd799439011', // Sample ObjectId
      userId: '507f1f77bcf86cd799439012', // Sample ObjectId
      timestamp: new Date().toISOString(),
      analysis: {
        skills: {
          tech: 85,
          communication: 75,
          problem_solving: 90,
          creativity: 80,
          leadership: 70
        },
        career1: {
          title: "Software Developer",
          description: "Develops software applications and systems"
        },
        career2: {
          title: "Data Scientist",
          description: "Analyzes data and creates ML models"
        },
        career3: {
          title: "Product Manager",
          description: "Manages product development lifecycle"
        }
      }
    });

    await sampleAnalysis.save();
    res.status(201).json({ message: 'Sample analysis created', data: sampleAnalysis });
  } catch (error) {
    console.error('Error creating sample analysis:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;