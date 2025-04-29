const db = require('../helper/connectionDB');

const createAdmin = async (req, res) => {
    try {
        const { email, password, name, role, idLocation } = req.body;
        const { role: creatorRole, wilayah } = req.user; // Mengambil role dan wilayah dari user

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
            }else if (role === 'city') {
                detailQuery = 'INSERT INTO cityUsersDetail (idUser, name, idCity) VALUES (?, ?, ?)';
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
        const { role, wilayah } = req.user;  // Mengambil role dan wilayah dari user
        const { idProvince, idCity, idDistrict, idSubDistrict, idTps } = req.query;  // Parameter query

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
        // console.log(await db.query(query))
        const params = [];

        // Role restriction untuk Provinsi, Kota, Kecamatan, Kelurahan, dan TPS
        if (role === 'province') {
            query += ` AND (
            pud.idProvince = ? OR 
            cud.idCity IN (SELECT idCity FROM cityData WHERE idProvince = ?) OR
            dud.idDistrict IN (SELECT idDistrict FROM districtData WHERE idCity IN (SELECT idCity FROM cityData WHERE idProvince = ?)) OR
            sdud.idSubDistrict IN (SELECT idSubDistrict FROM subDistrictData WHERE idDistrict IN (SELECT idDistrict FROM districtData WHERE idCity IN (SELECT idCity FROM cityData WHERE idProvince = ?)))
            )`;
            params.push(wilayah.idProvince, wilayah.idProvince, wilayah.idProvince, wilayah.idProvince);
        } else if (role === 'city') {
            query += ` AND (
            cud.idCity = ? OR
            dud.idDistrict IN (SELECT idDistrict FROM districtData WHERE idCity = ?) OR
            sdud.idSubDistrict IN (SELECT idSubDistrict FROM subDistrictData WHERE idDistrict IN (SELECT idDistrict FROM districtData WHERE idCity = ?))
            )`;
            params.push(wilayah.idCity, wilayah.idCity, wilayah.idCity);
        } else if (role === 'district') {
            query += ` AND (
            dud.idDistrict = ? OR
            sdud.idSubDistrict IN (SELECT idSubDistrict FROM subDistrictData WHERE idDistrict = ?)
            )`;
            params.push(wilayah.idDistrict, wilayah.idDistrict);
        } else if (role === 'sub_district') {
            query += ` AND sdud.idSubDistrict = ?`;
            params.push(wilayah.idSubDistrict);
        
        }

        // Filter berdasarkan query params untuk fleksibilitas pencarian
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
        if (idTps) {
            query += ` AND (atud.idTps = ? OR otud.idTps = ?)`;
            params.push(idTps, idTps); // Memastikan admin dan petugas TPS hanya melihat TPS yang sama
        }

        // Menjalankan query untuk mengambil data sesuai dengan role dan wilayah pengguna
        const [results] = await db.query(query, params);
        

        res.json(results);  // Mengirimkan hasil query sebagai response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const { idUser } = req.params; // ambil ID user dari URL
        const { email, name, role } = req.body;
        const dynamicIdKey = Object.keys(req.user).find(
            key => key.startsWith('id') && key !== 'idUser'
        );
        const dynamicIdValue = req.user[dynamicIdKey];

        // hanya bisa update tergantung administrator
        const { role: userRole, wilayah } = req.user; // Mengambil role dan wilayah dari user
        if (userRole !== 'national') {
            const locationStr = dynamicIdValue.toString();
            let creatorLocationStr;

            switch (userRole) {
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

        // Cari user yang mau di-update
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [idUser]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const currentRole = user[0].role;

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
                await connection.query(`UPDATE ${detailTable} SET name = ?, ${dynamicIdKey} =  WHERE idUser = ?`, [name, dynamicIdValue, idUser]);
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
