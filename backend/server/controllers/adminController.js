const db = require('../helper/connectionDB');

// Create Admin
const createAdmin = async (req, res) => {
    const { email, password, name, targetRegionId } = req.body;
    const currentUserId = req.user.idUser; // Ambil dari token login (middleware auth)
    const { role } = req.query;
    
    const connection = await db.getConnection();
    try {
        // VALIDASI wilayah dan role
        await connection.query('CALL ValidateUserAccess(?, ?, ?)', [
            currentUserId,
            role,
            targetRegionId
        ]);

        // Lolos validasi → insert ke tabel `users`
        const [result] = await connection.query(`
            INSERT INTO users (email, password, role)
            VALUES (?, MD5(?), ?)`, [email, password, role]);

        const newUserId = result.insertId;

        // Insert ke tabel detail sesuai role
        if (role === 'province') {
            await connection.query(`
                INSERT INTO provinceUsersDetail (idUser, name, idProvince)
                VALUES (?, ?, ?)`, [newUserId, name, targetRegionId]);
        } else if (role === 'city') {
            await connection.query(`
                INSERT INTO cityUsersDetail (idUser, name, idCity)
                VALUES (?, ?, ?)`, [newUserId, name, targetRegionId]);
        } else if (role === 'district') {
            await connection.query(`
                INSERT INTO districtUsersDetail (idUser, name, idDistrict)
                VALUES (?, ?, ?)`, [newUserId, name, targetRegionId]);
        } else if (role === 'sub_district') {
            await connection.query(`
                INSERT INTO subDistrictUsersDetail (idUser, name, idSubDistrict)
                VALUES (?, ?, ?)`, [newUserId, name, targetRegionId]);
        } else if (role === 'adminTps') {
            await connection.query(`
                INSERT INTO adminTpsUserDetail (idUser, name, idTps)
                VALUES (?, ?, ?)`, [newUserId, name, targetRegionId]);
        } else if (role === 'officerTps') {
            await connection.query(`
                INSERT INTO officerTpsUserDetail (idUser, name, idTps)
                VALUES (?, ?, ?)`, [newUserId, name, targetRegionId]);
        }

        res.status(201).json({ message: 'User berhasil dibuat', idUser: newUserId });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message || 'Gagal membuat user' });
    } finally {
        connection.release();
    }
};

// Read Admin
const readAdmin = async (req, res) => {
    const { role, wilayah } = req.user;
    const { idProvince, idCity, idDistrict, idSubDistrict, idTps, region } = req.query;

    try {
        // Validasi region
        const params = [region]; // region akan menjadi syarat pertama
        const allowedRegions = ['national','province', 'city', 'district', 'sub_district', 'adminTps', 'officerTps'];
        if (!region || !allowedRegions.includes(region)) {
            return res.status(400).json({ message: 'Parameter region wajib diisi dan harus valid' });
        }

        let query = `
        SELECT 
            users.idUser, users.email, users.role,
            COALESCE(nud.name, pud.name, cud.name, dud.name, sdud.name, atud.name, otud.name) AS name,
            CASE 
                WHEN users.role = 'national' THEN 'Nasional'
                WHEN users.role = 'province' THEN pr.name
                WHEN users.role = 'city' THEN ct.name
                WHEN users.role = 'district' THEN dt.name
                WHEN users.role = 'sub_district' THEN sd.name
                WHEN users.role = 'adminTps' THEN tps.name
                WHEN users.role = 'officerTps' THEN tps.name
                ELSE NULL
            END AS region_name
        FROM users
        LEFT JOIN nationalUsersDetail nud ON users.idUser = nud.idUser
        LEFT JOIN provinceUsersDetail pud ON users.idUser = pud.idUser
        LEFT JOIN cityUsersDetail cud ON users.idUser = cud.idUser
        LEFT JOIN districtUsersDetail dud ON users.idUser = dud.idUser
        LEFT JOIN subDistrictUsersDetail sdud ON users.idUser = sdud.idUser
        LEFT JOIN adminTpsUserDetail atud ON users.idUser = atud.idUser
        LEFT JOIN officerTpsUserDetail otud ON users.idUser = otud.idUser

        -- Join ke tabel referensi nama wilayah
        LEFT JOIN provinceData pr ON pud.idProvince = pr.idProvince
        LEFT JOIN cityData ct ON cud.idCity = ct.idCity
        LEFT JOIN districtData dt ON dud.idDistrict = dt.idDistrict
        LEFT JOIN subDistrictData sd ON sdud.idSubDistrict = sd.idSubDistrict
        LEFT JOIN tpsData tps ON atud.idTps = tps.idTps OR otud.idTps = tps.idTps
        
        WHERE users.role = ?
        `;

        // Hak akses berdasarkan role user
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

        // Tambahan filter query params (opsional)
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
            params.push(idTps, idTps);
        }

        const [results] = await db.query(query, params);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update Admin
const updateAdmin = async (req, res) => {
    const { email, password, name } = req.body;
    const userId = req.params.id; // ID user yang akan diperbarui
    const currentUserId = req.user.idUser; // ID user yang sedang login
    const { role, targetRegionId } = req.query; // Role yang diperlukan untuk validasi

    const connection = await db.getConnection();
    try {
        // VALIDASI wilayah dan role
        await connection.query('CALL ValidateUserAccess(?, ?, ?)', [
            currentUserId,
            role,
            targetRegionId
        ]);

        // Ambil data user saat ini dari database
        const [currentUserData] = await connection.query(`
            SELECT users.email, users.password, 
            COALESCE(pud.name, cud.name, dud.name, sdud.name, atud.name, otud.name) AS name
            FROM users
            LEFT JOIN provinceUsersDetail pud ON users.idUser = pud.idUser
            LEFT JOIN cityUsersDetail cud ON users.idUser = cud.idUser
            LEFT JOIN districtUsersDetail dud ON users.idUser = dud.idUser
            LEFT JOIN subDistrictUsersDetail sdud ON users.idUser = sdud.idUser
            LEFT JOIN adminTpsUserDetail atud ON users.idUser = atud.idUser
            LEFT JOIN officerTpsUserDetail otud ON users.idUser = otud.idUser
            WHERE users.idUser = ?`, [userId]);

        if (currentUserData.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        const currentData = currentUserData[0];

        // Cek apakah data yang ingin diupdate sama dengan data di database
        if (currentData.email === email && currentData.password === password && currentData.name === name) {
            return res.status(400).json({ message: 'Tidak ada perubahan data yang dilakukan' });
        }

        // Update data user
        await connection.query(`
            UPDATE users 
            SET email = ?, password = ? 
            WHERE idUser = ?`, [email, password, userId]);

        // Update detail sesuai role
        if (role === 'province') {
            await connection.query(`
                UPDATE provinceUsersDetail 
                SET name = ?, idProvince = ? 
                WHERE idUser = ?`, [name, targetRegionId, userId]);
        } else if (role === 'city') {
            await connection.query(`
                UPDATE cityUsersDetail 
                SET name = ?, idCity = ? 
                WHERE idUser = ?`, [name, targetRegionId, userId]);
        } else if (role === 'district') {
            await connection.query(`
                UPDATE districtUsersDetail 
                SET name = ?, idDistrict = ? 
                WHERE idUser = ?`, [name, targetRegionId, userId]);
        } else if (role === 'sub_district') {
            await connection.query(`
                UPDATE subDistrictUsersDetail 
                SET name = ?, idSubDistrict = ? 
                WHERE idUser = ?`, [name, targetRegionId, userId]);
        } else if (role === 'adminTps') {
            await connection.query(`
                UPDATE adminTpsUserDetail 
                SET name = ?, idTps = ? 
                WHERE idUser = ?`, [name, targetRegionId, userId]);
        } else if (role === 'officerTps') {
            await connection.query(`
                UPDATE officerTpsUserDetail 
                SET name = ?, idTps = ? 
                WHERE idUser = ?`, [name, targetRegionId, userId]);
        }

        res.status(200).json({ message: 'User berhasil diperbarui' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message || 'Gagal memperbarui data user' });
    } finally {
        connection.release();
    }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
    const userId = req.params.id;
    const currentUserId = req.user.idUser;
    const { role, targetRegionId } = req.query;

    const connection = await db.getConnection();
    try {
        // VALIDASI wilayah dan role
        await connection.query('CALL ValidateUserAccess(?, ?, ?)', [
            currentUserId,
            role,
            targetRegionId
        ]);

        // Cek apakah user dengan ID tersebut ada
        const [userExists] = await connection.query('SELECT idUser FROM users WHERE idUser = ?', [userId]);
        if (userExists.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        // Hapus detail sesuai role
        if (role === 'province') {
            await connection.query(`
                DELETE FROM provinceUsersDetail WHERE idUser = ?`, [userId]);
        } else if (role === 'city') {
            await connection.query(`
                DELETE FROM cityUsersDetail WHERE idUser = ?`, [userId]);
        } else if (role === 'district') {
            await connection.query(`
                DELETE FROM districtUsersDetail WHERE idUser = ?`, [userId]);
        } else if (role === 'sub_district') {
            await connection.query(`
                DELETE FROM subDistrictUsersDetail WHERE idUser = ?`, [userId]);
        } else if (role === 'adminTps') {
            await connection.query(`
                DELETE FROM adminTpsUserDetail WHERE idUser = ?`, [userId]);
        } else if (role === 'officerTps') {
            await connection.query(`
                DELETE FROM officerTpsUserDetail WHERE idUser = ?`, [userId]);
        }

        // Hapus data user
        await connection.query('DELETE FROM users WHERE idUser = ?', [userId]);

        res.status(200).json({ message: 'User berhasil dihapus' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message || 'Gagal menghapus user' });
    } finally {
        connection.release();
    }
};

module.exports = {
    createAdmin,
    readAdmin,
    updateAdmin,
    deleteAdmin,
};
