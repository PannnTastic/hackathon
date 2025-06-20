const db = require('../helper/connectionDB');
const handleDbError = require('../helper/dbErrorHandler');

exports.createUser = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const { email, password, name, role, assignmentId } = req.body;
        if (!email || !password || !name || !role || assignmentId === undefined) {
            return res.status(400).json({ message: 'Semua field wajib diisi.' });
        }
        const query = 'CALL sp_users_create(?, ?, ?, ?, ?, ?)';
        await db.execute(query, [actorIdUser, email, password, name, role, assignmentId]);
        res.status(201).json({ message: 'Pengguna berhasil dibuat atau diaktifkan kembali.' });
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const {
            name, email, role,
            idProvince, idCity, idDistrict, idSubDistrict
        } = req.query;
        
        const query = 'CALL sp_users_read_complex(?, ?, ?, ?, ?, ?, ?, ?)';
        
        const [rows] = await db.execute(query, [
            actorIdUser,
            name || null,
            email || null,
            role || null,
            idProvince || null,
            idCity || null,
            idDistrict || null,
            idSubDistrict || null
        ]);
        
        res.status(200).json(rows[0]);
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const targetIdUser = req.params.id;
        const { email, name, password, status } = req.body;
        const query = 'CALL sp_users_update(?, ?, ?, ?, ?, ?)';
        await db.execute(query, [actorIdUser, targetIdUser, email || null, name || null, password || null, status || null]);
        res.status(200).json({ message: 'Pengguna berhasil diperbarui.' });
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const targetIdUser = req.params.id;
        const query = 'CALL sp_users_disable(?, ?)';
        await db.execute(query, [actorIdUser, targetIdUser]);
        res.status(204).send();
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};