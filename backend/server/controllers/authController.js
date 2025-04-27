const db = require('../helper/connectionDB');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const [user] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Validate password
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
        res.status(500).json({ message: 'Error during login.', error });
    }
};

module.exports = {
    login,
};
