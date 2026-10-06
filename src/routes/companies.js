const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
    try {
        const [[student]] = await db.query('SELECT domain FROM students WHERE id = ?', [req.userId]);
        const userDomain = student ? student.domain : 'All';

        const [companies] = await db.query('SELECT * FROM companies WHERE domain = ? OR domain = \'All\'', [userDomain]);
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const [companies] = await db.query('SELECT * FROM companies WHERE id = ?', [req.params.id]);
        if (companies.length === 0) return res.status(404).json({ error: 'Company not found' });
        res.json(companies[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
