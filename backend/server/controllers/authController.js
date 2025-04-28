const db = require('../helper/connectionDB');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const roleTableMap = {
            national: 'nationalUsersDetail',
            province: 'provinceUsersDetail',
            city: 'cityUsersDetail',
            district: 'districtUsersDetail',
            subdistrict: 'subdistrictUsersDetail',
            officerTps: 'officerTpsUserDetail',
            adminTps: 'adminTpsUserDetail',
        };

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const [rowsUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rowsUser[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const tableName = roleTableMap[user.role];
        if (!tableName) {
            return res.status(400).json({ message: 'Invalid user role.' });
        }

        const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE idUser = ?`, user.idUser);
        const userDetails = rows[0];
        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found.' });
        }

        const tokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        if (userDetails.role === 'province') {
            tokenPayload.idProvince = userDetails.idProvince;
        } else if (userDetails.role === 'city') {
            tokenPayload.idCity = userDetails.idCity;
        } else if (userDetails.role === 'district') {
            tokenPayload.idDistrict = userDetails.idDistrict;
        } else if (userDetails.role === 'subdistrict') {
            tokenPayload.idSubdistrict = user.idSubdistrict;
        } else if (userDetails.role === 'officerTps' || userDetails.role === 'adminTps') {
            tokenPayload.idTps = userDetails.idTps;
        }
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
        res.status(500).json({ message: 'Error during login.', error });
        console.error('Login error:', error);
    }
};

module.exports = {
    login,
};