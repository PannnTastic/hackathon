const db = require('../helper/connectionDB');

exports.createTps = async (req, res) => {
    const actorIdUser = req.user.idUser;
    const { name, idSubDistrict } = req.body;

    if (!name || !idSubDistrict) {
        return res.status(400).json({ message: 'Nama TPS dan ID Kelurahan wajib diisi.' });
    }

    try {
        const query = 'CALL sp_tps_create(?, ?, ?, @new_id, @message)';
        await db.execute(query, [actorIdUser, name, idSubDistrict]);
        
        const [[result]] = await db.execute('SELECT @new_id AS new_id, @message AS message');

        if (result.new_id) {
            res.status(201).json({ id: result.new_id, message: result.message });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        const DBMesssage = error.message.split('1644: ')[1] || 'Gagal membuat TPS.';
        res.status(403).json({ message: error.message || DBMesssage });
    }
};

exports.readAllTps = async (req, res) => {
    const actorIdUser = req.user.idUser;
    const { 
        name, idSubDistrict, idDistrict, idCity, idProvince, 
        limit = 10, offset = 0 
    } = req.query;

    try {
        const query = 'CALL sp_tps_read(?, ?, ?, ?, ?, ?, ?, ?)';
        const [rows] = await db.execute(query, [
            actorIdUser,
            name || null,
            idSubDistrict || null,
            idDistrict || null,
            idCity || null,
            idProvince || null,
            parseInt(limit),
            parseInt(offset)
        ]);
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error saat membaca data TPS:', error.message);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};

// READ (by ID) - Memanggil sp_tps_read_by_id
exports.readTpsById = async (req, res) => {
    const actorIdUser = req.user.idUser;
    const targetIdTps = req.params.id;

    try {
        const query = 'CALL sp_tps_read_by_id(?, ?)';
        const [rows] = await db.execute(query, [actorIdUser, targetIdTps]);
        
        if (rows[0].length === 0) {
            return res.status(404).json({ message: 'TPS tidak ditemukan atau Anda tidak memiliki akses.' });
        }
        res.status(200).json(rows[0][0]);
    } catch (error) {
        const DBMesssage = error.message.split('1644: ')[1] || 'Gagal mengambil data TPS.';
        res.status(403).json({ message: DBMesssage });
    }
};

exports.updateTps = async (req, res) => {
    const actorIdUser = req.user.idUser;
    const targetIdTps = req.params.id;
    const { name, idSubDistrict } = req.body;

    if (!name && !idSubDistrict) {
        return res.status(400).json({ message: 'Setidaknya satu field (name atau idSubDistrict) harus diisi.' });
    }

    try {
        const query = 'CALL sp_tps_update(?, ?, ?, ?)';
        await db.execute(query, [actorIdUser, targetIdTps, name || null, idSubDistrict || null]);
        res.status(200).json({ message: 'TPS berhasil diperbarui.' });
    } catch (error) {
        const DBMesssage = error.message.split('1644: ')[1] || 'Gagal memperbarui TPS.';
        res.status(403).json({ message: DBMesssage });
    }
};

exports.deleteTps = async (req, res) => {
    const actorIdUser = req.user.idUser;
    const targetIdTps = req.params.id;

    try {
        const query = 'CALL sp_tps_archive(?, ?)';
        await db.execute(query, [actorIdUser, targetIdTps]);
        res.status(204).send();
    } catch (error) {
        const DBMesssage = error.message.split('1644: ')[1] || 'Gagal mengarsipkan TPS.';
        res.status(403).json({ message: DBMesssage });
    }
};