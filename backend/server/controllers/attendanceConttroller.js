const db = require('../helper/connectionDB');
const handleDbError = require('../helper/dbErrorHandler');

exports.createAttendance = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const { idVoter, idOfficerUserOnDuty, photoProof } = req.body;
        if (!idVoter || !idOfficerUserOnDuty) {
            return res.status(400).json({ message: 'ID Pemilih dan ID Petugas Bertugas wajib diisi.' });
        }
        const query = 'CALL sp_attendance_create(?, ?, ?, ?)';
        await db.execute(query, [actorIdUser, idVoter, idOfficerUserOnDuty, photoProof || null]);
        res.status(201).json({ message: 'Kehadiran berhasil dicatat.' });
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.readAttendance = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const { idTps } = req.query;
        const query = 'CALL sp_attendance_read(?, ?)';
        const [rows] = await db.execute(query, [actorIdUser, idTps || null]);
        res.status(200).json(rows[0]);
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.cancelAttendance = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const { idAttendance } = req.params;
        const query = 'CALL sp_attendance_cancel(?, ?)';
        await db.execute(query, [actorIdUser, idAttendance]);
        res.status(200).json({ message: "Kehadiran berhasil dibatalkan." });
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};