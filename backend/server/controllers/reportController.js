const db = require('../helper/connectionDB');
const handleDbError = require('../helper/dbErrorHandler');

exports.readReports = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const { status } = req.query;
        const query = 'CALL sp_report_read(?, ?)';
        const [rows] = await db.execute(query, [actorIdUser, status || null]);
        res.status(200).json(rows[0]);
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.updateReportStatus = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const { id } = req.params;
        const { newStatus } = req.body;

        if (!newStatus || !['pending', 'approved', 'rejected'].includes(newStatus)) {
            return res.status(400).json({ message: "Status baru tidak valid." });
        }
        
        const query = 'CALL sp_report_update_status(?, ?, ?)';
        await db.execute(query, [actorIdUser, id, newStatus]);
        res.status(200).json({ message: `Status laporan berhasil diubah menjadi ${newStatus}` });
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};