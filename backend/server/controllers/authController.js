const db = require('../helper/connectionDB');
const jwt = require('jsonwebtoken');

//done
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Check if the user exists
        const [user] = await db.query('SELECT * FROM users WHERE users = ?', [email]);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Validate password
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        if(user.role === 'national'){
            const [national] = await db.query('SELECT * FROM nationalUsersDetail WHERE idUser = ?', [user.id]);
            if (!national) {
                return res.status(404).json({ message: 'National user details not found.' });
            }
        }else if(user.role === 'province'){
            const [province] = await db.query('SELECT * FROM provinceUsersDetail WHERE idUser = ?', [user.id]);
            if (!province) {
                return res.status(404).json({ message: 'Province user details not found.' });
            }
        }else if(user.role === 'city'){
            const [city] = await db.query('SELECT * FROM cityUsersDetail WHERE idUser = ?', [user.id]);
            if (!city) {
                return res.status(404).json({ message: 'City user details not found.' });
            }
        }else if(user.role === 'district'){
            const [district] = await db.query('SELECT * FROM districtUsersDetail WHERE idUser = ?', [user.id]);
            if (!district) {
                return res.status(404).json({ message: 'District user details not found.' });
            }
        }else if(user.role === 'subdistrict'){
            const [subdistrict] = await db.query('SELECT * FROM subdistrictUsersDetail WHERE idUser = ?', [user.id]);
            if (!subdistrict) {
                return res.status(404).json({ message: 'Subdistrict user details not found.' });
            }
        }else if(user.role === 'officerTps'){
            const [officerTps] = await db.query('SELECT * FROM officerTpsUserDetail WHERE idUser = ?', [user.id]);
            if (!officerTps) {
                return res.status(404).json({ message: 'Officer TPS user details not found.' });
            }
        }else if(user.role === 'adminTps'){
            const [officerKp] = await db.query('SELECT * FROM adminTpsUserDetail WHERE idUser = ?', [user.id]);
            if (!officerKp) {
                return res.status(404).json({ message: 'Admin Tps user details not found.' });
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                idProvince: user.role === 'province' ? user.idProvince : null,
                idCity: user.role === 'city' ? user.idCity : null,
                idDistrict: user.role === 'district' ? user.idDistrict : null,
                idSubdistrict: user.role === 'subdistrict' ? user.idSubdistrict : null,
                idTps: user.role === 'officerTps' || 'adminTps' ? user.idTps : null,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
        res.status(500).json({ message: 'Error during login.', error });
        console.error('Login error:', error);
    }
};

module.exports = {
    login,
};