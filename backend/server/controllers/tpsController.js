const db = require('../helper/connectionDB');
const handleDbError = require('../helper/dbErrorHandler');

exports.createTps = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const { name, idSubDistrict } = req.body;
        if (!name || !idSubDistrict) {
            return res.status(400).json({ message: 'Nama TPS dan ID Kelurahan wajib diisi.' });
        }
        
        const query = 'CALL sp_tps_create(?, ?, ?)';
        await db.execute(query, [actorIdUser, name, idSubDistrict]);
        
        res.status(201).json({ message: 'TPS berhasil dibuat atau diaktifkan kembali.' });

    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.readAllTps = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const { 
            name, idSubDistrict, idDistrict, idCity, idProvince, 
            limit = 100, offset = 0 
        } = req.query;
        const query = 'CALL sp_tps_read(?, ?, ?, ?, ?, ?, ?, ?)';
        const [rows] = await db.execute(query, [
            actorIdUser, name || null, idSubDistrict || null, idDistrict || null,
            idCity || null, idProvince || null, parseInt(limit), parseInt(offset)
        ]);
        res.status(200).json(rows[0]);
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.updateTps = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const targetIdTps = req.params.id;
        const { name, idSubDistrict } = req.body;
        if (!name && !idSubDistrict) {
            return res.status(400).json({ message: 'Setidaknya satu field (name atau idSubDistrict) harus diisi.' });
        }
        const query = 'CALL sp_tps_update(?, ?, ?, ?)';
        await db.execute(query, [actorIdUser, targetIdTps, name || null, idSubDistrict || null]);
        res.status(200).json({ message: 'TPS berhasil diperbarui.' });
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.deleteTps = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const targetIdTps = req.params.id;
        const query = 'CALL sp_tps_archive(?, ?)';
        await db.execute(query, [actorIdUser, targetIdTps]);
        res.status(204).send();
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};