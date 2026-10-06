const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/aptitude', verifyToken, async (req, res) => {
    try {
        const [[student]] = await db.query('SELECT domain FROM students WHERE id = ?', [req.userId]);
        const userDomain = student ? student.domain : 'All';
        const [questions] = await db.query('SELECT id, category, question, option_a, option_b, option_c, option_d, correct_answer, difficulty FROM aptitude_questions WHERE domain = ? OR domain = \'All\'', [userDomain]);
        res.json(questions); // Not sending correct answers for test mode
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/coding', verifyToken, async (req, res) => {
    try {
        const [[student]] = await db.query('SELECT domain FROM students WHERE id = ?', [req.userId]);
        const userDomain = student ? student.domain : 'All';
        const [questions] = await db.query('SELECT * FROM coding_questions WHERE domain = ? OR domain = \'All\'', [userDomain]);
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
