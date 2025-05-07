const db = require('../helper/connectionDB');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Cek user dari tabel 'users'
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Cek Password Dengan MD5 Hash
        const [pass] = await db.query('SELECT * FROM users WHERE password = ?', [password]);
        if (!pass) {
            return res.status(404).json({ message: 'username or password false.' });
        }
        

        // Mapping table detail berdasarkan role
        const roleTableMap = {
            national: 'nationalUsersDetail',
            province: 'provinceUsersDetail',
            city: 'cityUsersDetail',
            district: 'districtUsersDetail',
            sub_district: 'subdistrictUsersDetail',
            officerTps: 'officerTpsUserDetail',
            adminTps: 'adminTpsUserDetail',
        };

        const tableName = roleTableMap[user.role];
        if (!tableName) {
            return res.status(400).json({ message: 'Invalid user role.' });
        }

        // Query user details berdasarkan idUser
        const [details] = await db.query(`SELECT * FROM ?? WHERE idUser = ?`, [tableName, user.idUser]);
        const userDetails = details[0];

        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found.' });
        }

        // Membuat payload token
        const payload = {
            idUser: user.idUser,
            email: user.email,
            role: user.role,
        };

        // Menambahkan properti tambahan sesuai role
        if (userDetails.idProvince) payload.idProvince = userDetails.idProvince;
        if (userDetails.idCity) payload.idCity = userDetails.idCity;
        if (userDetails.idDistrict) payload.idDistrict = userDetails.idDistrict;
        if (userDetails.idSubdistrict) payload.idSubdistrict = userDetails.idSubdistrict;
        if (userDetails.idTps) payload.idTps = userDetails.idTps;

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({
            status: 200,
            message: 'Login successful.',
            token,
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

module.exports = { login };
