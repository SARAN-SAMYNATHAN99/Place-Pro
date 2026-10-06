const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
    try {
        const [[student]] = await db.query('SELECT domain FROM students WHERE id = ?', [req.userId]);
        const userDomain = student ? student.domain : 'All';
        const [materials] = await db.query('SELECT * FROM study_materials WHERE domain = ? OR domain = \'All\'', [userDomain]);
        res.json(materials);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/mock-interviews', verifyToken, async (req, res) => {
    try {
        const [[student]] = await db.query('SELECT domain FROM students WHERE id = ?', [req.userId]);
        const userDomain = student ? student.domain : 'All';
        const [interviews] = await db.query('SELECT * FROM mock_interviews WHERE domain = ? OR domain = \'All\'', [userDomain]);
        res.json(interviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
