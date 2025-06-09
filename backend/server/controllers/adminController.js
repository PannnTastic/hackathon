const db = require('../helper/connectionDB');

exports.createUser = async (req, res) => {
    const actorIdUser = req.user.idUser;
    const { email, password, name, role, assignmentId } = req.body;

    if (!email || !password || !name || !role || !assignmentId) {
        return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }

    try {
        const query = 'CALL sp_users_create(?, ?, ?, ?, ?, ?)';
        await db.execute(query, [actorIdUser, email, password, name, role, assignmentId]);
        res.status(201).json({ message: 'Pengguna berhasil dibuat.' });
    } catch (error) {
        const DBMesssage = error.message.split('1644: ')[1] || 'Gagal membuat pengguna.';
        res.status(500).json({ message: error.message || DBMesssage });
    }
};

exports.getAllUsers = async (req, res) => {
    const actorIdUser = req.user.idUser;
    const {
        includeSubordinates = true,
        name, email, role,
        idProvince, idCity, idDistrict, idSubDistrict,
        provinceName, cityName, districtName, subDistrictName
    } = req.query;

    try {
        const query = 'CALL sp_users_read_complex(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const [rows] = await db.execute(query, [
            actorIdUser, includeSubordinates,
            name || null, email || null, role || null,
            idProvince || null, idCity || null, idDistrict || null, idSubDistrict || null,
            provinceName || null, cityName || null, districtName || null, subDistrictName || null
        ]);
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error saat mengambil data pengguna:', error.message);
        res.status(500).json({ message: 'Gagal mengambil data pengguna.' });
    }
};

// UPDATE - Memanggil sp_users_update
exports.updateUser = async (req, res) => {
    const actorIdUser = req.user.idUser;
    const targetIdUser = req.params.id;
    const { email, name, password, status } = req.body;

    try {
        const query = 'CALL sp_users_update(?, ?, ?, ?, ?, ?)';
        await db.execute(query, [actorIdUser, targetIdUser, email || null, name || null, password || null, status || null]);
        res.status(200).json({ message: 'Pengguna berhasil diperbarui.' });
    } catch (error) {
        console.error(`Error saat memperbarui pengguna ID ${targetIdUser}:`, error.message);
        const DBMesssage = error.message.split('1644: ')[1] || 'Gagal memperbarui pengguna.';
        res.status(500).json({ message: DBMesssage });
    }
};

// DELETE - Memanggil sp_users_delete
exports.deleteUser = async (req, res) => {
    const actorIdUser = req.user.idUser;
    const targetIdUser = req.params.id;

    try {
        // PERUBAHAN: Ganti nama SP yang dipanggil
        const query = 'CALL sp_users_disable(?, ?)';
        await db.execute(query, [actorIdUser, targetIdUser]);
        res.status(204).send(); // Tetap gunakan 204, karena dari sisi API, resource 'hilang'
    } catch (error) {
        console.error(`Error saat menonaktifkan pengguna ID ${targetIdUser}:`, error.message);
        const DBMesssage = error.message.split('1644: ')[1] || 'Gagal menonaktifkan pengguna.';
        res.status(500).json({ message: DBMesssage });
    }
};
