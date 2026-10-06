const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [admins] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
        if (admins.length === 0) return res.status(404).json({ error: 'Admin not found' });

        const admin = admins[0];
        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add middleware for admin verification for below routes if needed
router.get('/stats', async (req, res) => {
    try {
        const [studentCount] = await db.query('SELECT COUNT(*) as count FROM students');
        const [companyCount] = await db.query('SELECT COUNT(*) as count FROM companies');
        res.json({
            students: studentCount[0].count,
            companies: companyCount[0].count
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
