const db = require('../helper/connectionDB');

const createAdmin = async (req, res) => {
    try {
        const { email, password, name, role, idLocation } = req.body;
        const { role: creatorRole, wilayah } = req.user;

        // Cek apakah role user pembuat diperbolehkan membuat role yang diinginkan
        if (!allowedRoles[creatorRole]?.includes(role)) {
            return res.status(403).json({
                status: 403,
                message: `Access denied. ${creatorRole} can only create: ${allowedRoles[creatorRole].join(', ')}`,
            });
        }

        // Validasi ID lokasi berdasarkan role pembuat
        if (creatorRole !== 'national') {
            const locationStr = idLocation.toString();
            let creatorLocationStr;

            switch (creatorRole) {
                case 'province':
                    creatorLocationStr = wilayah.idProvince.toString();
                    if (locationStr.substring(0, 2) !== creatorLocationStr.substring(0, 2)) {
                        return res.status(403).json({ message: 'Location is not under your jurisdiction.' });
                    }
                    break;
                case 'city':
                    creatorLocationStr = wilayah.idCity.toString();
                    if (locationStr.substring(0, 4) !== creatorLocationStr.substring(0, 4)) {
                        return res.status(403).json({ message: 'Location is not under your jurisdiction.' });
                    }
                    break;
                case 'district':
                    creatorLocationStr = wilayah.idDistrict.toString();
                    if (locationStr.substring(0, 6) !== creatorLocationStr.substring(0, 6)) {
                        return res.status(403).json({ message: 'Location is not under your jurisdiction.' });
                    }
                    break;
                case 'sub_district':
                    creatorLocationStr = wilayah.idSubDistrict.toString();
                    if (locationStr.substring(0, 8) !== creatorLocationStr.substring(0, 8)) {
                        return res.status(403).json({ message: 'Location is not under your jurisdiction.' });
                    }
                    break;
            }
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
        res.status(500).json({ message: 'Error creating admin.', error });
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
            query += ` AND (
            pud.idProvince = ? OR 
            cud.idCity IN (SELECT idCity FROM city WHERE idProvince = ?) OR
            dud.idDistrict IN (SELECT idDistrict FROM district WHERE idCity IN (SELECT idCity FROM city WHERE idProvince = ?)) OR
            sdud.idSubDistrict IN (SELECT idSubDistrict FROM sub_district WHERE idDistrict IN (SELECT idDistrict FROM district WHERE idCity IN (SELECT idCity FROM city WHERE idProvince = ?)))
            )`;
            params.push(wilayah.idProvince, wilayah.idProvince, wilayah.idProvince, wilayah.idProvince);
        } else if (role === 'city') {
            query += ` AND (
            cud.idCity = ? OR
            dud.idDistrict IN (SELECT idDistrict FROM district WHERE idCity = ?) OR
            sdud.idSubDistrict IN (SELECT idSubDistrict FROM sub_district WHERE idDistrict IN (SELECT idDistrict FROM district WHERE idCity = ?))
            )`;
            params.push(wilayah.idCity, wilayah.idCity, wilayah.idCity);
        } else if (role === 'district') {
            query += ` AND (
            dud.idDistrict = ? OR
            sdud.idSubDistrict IN (SELECT idSubDistrict FROM sub_district WHERE idDistrict = ?)
            )`;
            params.push(wilayah.idDistrict, wilayah.idDistrict);
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
