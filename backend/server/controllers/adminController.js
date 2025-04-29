const db = require('../helper/connectionDB');


// Pisahkan Checking Role ke Middlware
const allowedRoles = {
    national: ['province', 'city', 'district', 'sub_district', 'adminTps', 'officerTps'],
    province: ['city', 'district', 'sub_district', 'adminTps', 'officerTps'],
    city: ['district', 'sub_district', 'adminTps', 'officerTps'],
    district: ['sub_district', 'adminTps', 'officerTps'],
    sub_district: ['adminTps', 'officerTps'],
};

const createAdmin = async (req, res) => {
    try {
        const { email, password, name, role, idLocation } = req.body;

        // Cek apakah role user pembuat diperbolehkan membuat role yang diinginkan
        if (!allowedRoles[req.user.role]?.includes(role)) {
            return res.status(403).json({
                status: 403,
                message: `Access denied. ${req.user.role} can only create: ${allowedRoles[req.user.role].join(', ')}`,
            });
        }

        // Cek apakah email sudah terdaftar
        const [existingAdmin] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingAdmin.length > 0) {
            return res.status(400).json({ message: 'Admin or Officer already exists.' });
        }


        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Insert ke tabel users
            const [userResult] = await connection.query(
                'INSERT INTO users (email, password, role) VALUES (?, MD5(?), ?)',
                [email, password, role]
            );
            const userId = userResult.insertId;

            // Insert ke tabel detail sesuai role
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
            } else if (role === 'subdistrict') {
                detailQuery = 'INSERT INTO subDistrictUsersDetail (idUser, name, idSubDistrict) VALUES (?, ?, ?)';
                detailParams = [userId, name, idLocation];
            } else if (role === 'adminTps') {
                detailQuery = 'INSERT INTO adminTpsUserDetail (idUser, name, idTps) VALUES (?, ?, ?)';
                detailParams = [userId, name, idLocation];
            } else if (role === 'officerTps') {
                detailQuery = 'INSERT INTO officerTpsUserDetail (idUser, name, idTps) VALUES (?, ?, ?)';
                detailParams = [userId, name, idLocation];
            } else {
                throw new Error('Invalid role.');
            }

            await connection.query(detailQuery, detailParams);
            await connection.commit();
            res.status(201).json({ message: 'Admin created successfully.' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin.', error: error.message });
    }
};



const getAdmin = async (req, res) => {
    try {
        const { role, wilayah } = req.user;
        const { idProvince, idCity, idDistrict, idSubDistrict } = req.query;
    
        let query = `
        SELECT users.idUser, users.email, users.role, 
                COALESCE(nud.name, pud.name, cud.name, dud.name, sdud.name, atud.name, otud.name) AS name
        FROM users
        LEFT JOIN nationalUsersDetail nud ON users.idUser = nud.idUser
        LEFT JOIN provinceUsersDetail pud ON users.idUser = pud.idUser
        LEFT JOIN cityUsersDetail cud ON users.idUser = cud.idUser
        LEFT JOIN districtUsersDetail dud ON users.idUser = dud.idUser
        LEFT JOIN subDistrictUsersDetail sdud ON users.idUser = sdud.idUser
        LEFT JOIN adminTpsUserDetail atud ON users.idUser = atud.idUser
        LEFT JOIN officerTpsUserDetail otud ON users.idUser = otud.idUser
        WHERE 1=1
        `;
    
        const params = [];
    
        // Role restriction
        if (role === 'province') {
        query += ` AND pud.idProvince = ?`;
        params.push(wilayah.idProvince);
        } else if (role === 'city') {
        query += ` AND cud.idCity = ?`;
        params.push(wilayah.idCity);
        } else if (role === 'district') {
        query += ` AND dud.idDistrict = ?`;
        params.push(wilayah.idDistrict);
        } else if (role === 'sub_district') {
        query += ` AND sdud.idSubDistrict = ?`;
        params.push(wilayah.idSubDistrict);
        }
    
        // Filter dari query params
        if (idProvince) {
        query += ` AND pud.idProvince = ?`;
        params.push(idProvince);
        }
        if (idCity) {
        query += ` AND cud.idCity = ?`;
        params.push(idCity);
        }
        if (idDistrict) {
        query += ` AND dud.idDistrict = ?`;
        params.push(idDistrict);
        }
        if (idSubDistrict) {
        query += ` AND sdud.idSubDistrict = ?`;
        params.push(idSubDistrict);
        }
    
        const [results] = await db.query(query, params);
    
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const { idUser } = req.params; // ambil ID user dari URL
        const { email, name, role, idLocation } = req.body;

        // Cari user yang mau di-update
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [idUser]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const currentRole = user[0].role;

        // Cek apakah role user pembuat diperbolehkan mengubah role user target
        if (!allowedRoles[req.user.role]?.includes(currentRole)) {
            return res.status(403).json({ message: `Access denied to update ${currentRole}` });
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Update email dan role di tabel users
            await connection.query('UPDATE users SET email = ?, role = ? WHERE id = ?', [email, role, idUser]);

            // Update detail tergantung role
            let detailTable = '';
            if (currentRole === 'national') detailTable = 'nationalUsersDetail';
            else if (currentRole === 'province') detailTable = 'provinceUsersDetail';
            else if (currentRole === 'district') detailTable = 'districtUsersDetail';
            else if (currentRole === 'subdistrict') detailTable = 'subDistrictUsersDetail';
            else if (currentRole === 'adminTps') detailTable = 'adminTpsUserDetail';
            else if (currentRole === 'officerTps') detailTable = 'officerTpsUserDetail';
            else throw new Error('Invalid role.');

            // Update ke tabel detail
            if (['national'].includes(currentRole)) {
                await connection.query(`UPDATE ${detailTable} SET name = ? WHERE idUser = ?`, [name, idUser]);
            } else {
                await connection.query(`UPDATE ${detailTable} SET name = ?, idLocation = ? WHERE idUser = ?`, [name, idLocation, idUser]);
            }

            await connection.commit();
            res.status(200).json({ message: 'Admin updated successfully.' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin.', error: error.message });
    }
};


const deleteAdmin = async (req, res) => {
    try {
        const { idUser } = req.params;

        // Cari user
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [idUser]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const currentRole = user[0].role;

        // Cek apakah role user pembuat diperbolehkan menghapus user target
        if (!allowedRoles[req.user.role]?.includes(currentRole)) {
            return res.status(403).json({ message: `Access denied to delete ${currentRole}` });
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Delete dari tabel detail
            let detailTable = '';
            if (currentRole === 'national') detailTable = 'nationalUsersDetail';
            else if (currentRole === 'province') detailTable = 'provinceUsersDetail';
            else if (currentRole === 'district') detailTable = 'districtUsersDetail';
            else if (currentRole === 'subdistrict') detailTable = 'subDistrictUsersDetail';
            else if (currentRole === 'adminTps') detailTable = 'adminTpsUserDetail';
            else if (currentRole === 'officerTps') detailTable = 'officerTpsUserDetail';
            else throw new Error('Invalid role.');

            await connection.query(`DELETE FROM ${detailTable} WHERE idUser = ?`, [idUser]);

            // Delete dari tabel users
            await connection.query('DELETE FROM users WHERE id = ?', [idUser]);

            await connection.commit();
            res.status(200).json({ message: 'Admin deleted successfully.' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting admin.', error: error.message });
    }
};


module.exports = {
    createAdmin,
    getAdmin,
    updateAdmin,
    deleteAdmin,
};
