const db = require('../helper/connectionDB');
const handleDbError = require('../helper/dbErrorHandler');

exports.createTps = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const { name, idSubDistrict } = req.body;
        if (!name || !idSubDistrict) {
            return res.status(400).json({ message: 'Nama TPS dan ID Kelurahan wajib diisi.' });
        }
        const query = 'CALL sp_tps_create(?, ?, ?, @new_id, @message)';
        await db.execute(query, [actorIdUser, name, idSubDistrict]);
        const [[result]] = await db.execute('SELECT @new_id AS new_id, @message AS message');
        if (result.new_id) {
            res.status(201).json({ id: result.new_id, message: result.message });
        } else {
            res.status(409).json({ message: result.message });
        }
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