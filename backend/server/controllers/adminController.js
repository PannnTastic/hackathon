const db = require('../helper/connectionDB');

//Done
const createAdmin = async (req, res) => {
    try {
        const { email, password, name, role, idLocation } = req.body;

        const allowedRoles = {
            nasional: ['provinsi','kabupaten','kecamatan','kelurahan', 'adminTps', 'officerTps'],
            provinsi: ['kabupaten', 'kecamatan','kelurahan', 'adminTps', 'officerTps'],
            kabupaten: ['kecamatan', 'kelurahan', 'adminTps', 'officerTps'],
            kecamatan: ['kelurahan', 'adminTps', 'officerTps'],
            kelurahan: ['adminTps', 'officerTps'],
        };

        if (!allowedRoles[req.user.role]?.includes(role)) {
            return res.status(403).json({
                message: `Access denied. ${req.user.role} can only create admins with roles: ${allowedRoles[req.user.role].join(', ')}`,
            });
        }

        const existingAdmin = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingAdmin.length > 0) {
            return res.status(400).json({ message: 'Admin already exists.' });
        }
        
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [userResult] = await connection.query(
                'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
                [username, password, role]
            );

            const userId = userResult.insertId; 

            let detailQuery = '';
            let detailParams = [];
            if (role === 'national') {
                detailQuery = 'INSERT INTO nationalUsersDetail (idUser, name) VALUES (?, ?)';
                detailParams = [userId, name];
            } else if (role === 'province') {
                detailQuery = 'INSERT INTO provinceUsersDetail (idUser, name, idProvince) VALUES (?, ?, ?)';
                detailParams = [userId, name, idLocation];
            } else if (role === 'district') {
                detailQuery = 'INSERT INTO districtUsersDetail (idUser, name, idDistrict) VALUES (?, ?, ?)';
                detailParams = [userId, name, idLocation];
            } else if (role === 'sub_district') {
                detailQuery = 'INSERT INTO subDistrictUsersDetail (idUser, name, idSubDistrict) VALUES (?, ?, ?)';
                detailParams = [userId, name, idLocation];
            } else if (role === 'officerTps') {
                detailQuery = 'INSERT INTO officerTpsUserDetail (idUser, name, idTps) VALUES (?, ?, ?)';
                detailParams = [userId, name, idLocation];
            } else if (role === 'adminTps') {
                detailQuery = 'INSERT INTO adminTpsUserDetail (idUser, name, idTps) VALUES (?, ?, ?)';
                detailParams = [userId, name, idLocation];
            } else {
                throw new Error('Role tidak valid');
            }
            await connection.query(detailQuery, detailParams);
            await connection.commit();
            console.log('User dan detail berhasil dibuat.');
        } catch (error) {
            await connection.rollback();
            console.error('Gagal membuat user:', error.message);
            throw error;
        } finally {
            connection.release();
        }
        res.status(201).json({ message: 'Admin created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin.', error });
    }
};

const getAdmins = async (req, res) => {
    try {
        const admins = await db.query('SELECT id, username, nama, role FROM admin');

        res.status(200).json({ message: 'List of admins.', admins });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admins.', error });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, nama, role } = req.body;

        await db.query(
            'UPDATE admin SET username = ?, password = ?, nama = ?, role = ? WHERE id = ?',
            [username, password, nama, role, id]
        );

        res.status(200).json({ message: 'Admin updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin.', error });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM admin WHERE id = ?', [id]);

        res.status(200).json({ message: 'Admin deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting admin.', error });
    }
};

module.exports = {
    createAdmin,
    getAdmins,
    updateAdmin,
    deleteAdmin,
};
