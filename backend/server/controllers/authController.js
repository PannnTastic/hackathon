const db = require('../helper/connectionDB');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password wajib diisi.' });
        }

        const query = 'CALL sp_auth_login(?, ?)';
        const [rows] = await db.execute(query, [email, password]);
        console.log(rows.fieldCount)
        if (rows.fieldCount === 0) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }

        const user = rows[0][0];
        const payload = {
            idUser: user.idUser,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            status: 200,
            message: 'Login berhasil.',
            token,
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};

module.exports = { login };