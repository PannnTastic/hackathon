const jwt = require('jsonwebtoken');
const db = require('../helper/connectionDB');
const handleDbError = require('../helper/dbErrorHandler');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }
    try {
        const query = 'CALL sp_auth_login(?, ?)';
        const [rows] = await db.execute(query, [email, password]);

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
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            status: 200,
            message: 'Login berhasil.',
            token,
        });
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};