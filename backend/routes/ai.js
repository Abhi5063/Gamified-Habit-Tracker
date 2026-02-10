import express from 'express';
import { generateHabitInsights } from '../services/geminiService.js';
import Habit from '../models/Habit.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// @route   POST /api/ai/coach
// @desc    Generate AI insights for the user
// @access  Private
router.post('/coach', async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const habits = await Habit.find({ userId: req.userId });

        if (!habits || habits.length === 0) {
            return res.json({
                observation: "Welcome! Start by adding your first habit.",
                tip: "Start small. A 2-minute habit is better than no habit.",
                quote: "The journey of a thousand miles begins with a single step."
            });
        }

        const insights = await generateHabitInsights(habits, user.email.split('@')[0]);

        res.json(insights);
    } catch (error) {
        console.error('AI Route Error:', error);
        res.status(500).json({ message: 'Failed to generate insights' });
    }
});

export default router;
