const db = require('../helper/connectionDB');
const handleDbError = require('../helper/dbErrorHandler');

exports.getPublicRecap = async (req, res) => {
    try {
        const { idProvince, idCity, idDistrict, idSubDistrict, idTps } = req.query;
        const query = 'CALL sp_public_get_recapitulation(?, ?, ?, ?, ?)';
        const [rows] = await db.execute(query, [
            idProvince || null, idCity || null, idDistrict || null,
            idSubDistrict || null, idTps || null
        ]);
        res.status(200).json(rows[0]);
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.createPublicReport = async (req, res) => {
    try {
        const { idElectionData, subject, description } = req.body;
        if (!idElectionData || !subject || !description) {
            return res.status(400).json({ message: 'ID Data Pemilu, Subjek, dan Deskripsi wajib diisi.' });
        }
        const query = 'CALL sp_report_create_public(?, ?, ?)';
        await db.execute(query, [idElectionData, subject, description]);
        res.status(201).json({ message: 'Laporan Anda berhasil dikirim.' });
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};