const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        const [users] = await db.query('SELECT name, email, placement_readiness, daily_goal, domain FROM students WHERE id = ?', [req.userId]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        
        // Fetch recent scores
        const [recentScores] = await db.query('SELECT type, score, date FROM results WHERE student_id = ? ORDER BY date DESC LIMIT 5', [req.userId]);
        
        // Fetch daily test count to calculate goal percent
        const today = new Date().toISOString().slice(0, 10);
        const [todayResults] = await db.query('SELECT COUNT(*) as cnt FROM results WHERE student_id = ? AND DATE(date) = ?', [req.userId, today]);
        const testCount = todayResults[0].cnt || 0;
        const goalPercent = Math.min(testCount * 33, 100); // 33% per test taken today

        // 1. Readiness is directly tied to goal completion
        const readiness = goalPercent;

        // 2. Eligible Companies dynamically scales with goal completion
        const userDomain = users[0].domain || 'All';
        const [allCompanies] = await db.query('SELECT name, package FROM companies WHERE domain = ? OR domain = \'All\'', [userDomain]);
        const eligibleCount = goalPercent === 0 ? 0 : Math.ceil((goalPercent / 100) * allCompanies.length);
        const companies = allCompanies.slice(0, eligibleCount);

        // 3. Leaderboard Rank dynamically improves with goal completion (Rank 120 -> Rank 1)
        const rank = 120 - Math.floor((goalPercent / 100) * 119);

        // 3. Fetch real-time upcoming events from Unstop API
        const https = require('https');
        const fetchUnstopEvents = () => {
            return new Promise((resolve, reject) => {
                https.get('https://unstop.com/api/public/opportunity/search-result?opportunity=hackathons&page=1&per_page=5', (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        try {
                            const parsed = JSON.parse(data);
                            resolve(parsed.data.data || []);
                        } catch (e) {
                            resolve([]); // Fallback to empty
                        }
                    });
                }).on('error', () => resolve([])); // Fallback on error
            });
        };
        const unstopEvents = await fetchUnstopEvents();

        res.json({
            user: { ...users[0], placement_readiness: readiness },
            recentScores,
            companiesEligibleCount: companies.length,
            companiesEligibleList: companies,
            goalPercent: Math.floor(goalPercent),
            upcomingTests: unstopEvents.length || 0,
            unstopEvents, // Send live events to frontend
            leaderboardPosition: rank
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Unified Submit Result Endpoint
router.post('/submit-result', verifyToken, async (req, res) => {
    try {
        const { type, score } = req.body;
        await db.query('INSERT INTO results (student_id, type, score) VALUES (?, ?, ?)', [req.userId, type, score]);
        res.json({ message: 'Result recorded successfully', success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get detailed progress data
router.get('/progress', verifyToken, async (req, res) => {
    try {
        // All results
        const [results] = await db.query('SELECT type, score, date FROM results WHERE student_id = ? ORDER BY date DESC', [req.userId]);
        
        // Metrics
        let totalXP = 0;
        let codingCount = 0;
        let mockCount = 0;
        let aptitudeCount = 0;
        let aptitudeTotalScore = 0;

        results.forEach(r => {
            totalXP += r.score;
            if(r.type === 'Coding Challenge') codingCount++;
            if(r.type === 'Mock Interview') mockCount++;
            if(r.type === 'Aptitude Test') {
                aptitudeCount++;
                aptitudeTotalScore += r.score;
            }
        });

        const aptitudeAccuracy = aptitudeCount === 0 ? 0 : Math.round(aptitudeTotalScore / aptitudeCount);

        res.json({
            metrics: {
                totalXP,
                codingCount,
                mockCount,
                aptitudeAccuracy
            },
            history: results
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update student domain
router.put('/domain', verifyToken, async (req, res) => {
    try {
        const { domain } = req.body;
        if (!domain) return res.status(400).json({ error: 'Domain is required' });
        await db.query('UPDATE students SET domain = ? WHERE id = ?', [domain, req.userId]);
        res.json({ message: 'Domain updated successfully', success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
