const db = require('../helper/connectionDB');

const createLaporan = async (req, res) => {
    try {
        const { subject, description,status } = req.body;

        await db.query(
            'INSERT INTO reportData (subject, description, status) VALUES (?, ?, ?)',
            [subject, description, status]
        );

        res.status(201).json({ message: 'Laporan created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating laporan.', error });
    }
};

const getLaporan = async (req, res) => {
    try {
        const laporan = await db.query(`
            SELECT 
                r.idData AS reportId,
                r.subject,
                r.description,
                r.status,
                a.name AS adminName,
                t.name AS tpsName
            FROM reportData r
            JOIN adminTpsUserDetail a ON r.idAdmin = a.idData
            JOIN tpsData t ON a.idTps = t.idTps
        `);

        res.status(200).json({ message: 'List of laporan with details.', laporan });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching laporan.', error });
    }
};

const updateLaporan = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.query('UPDATE reportData SET status = ? WHERE idData = ?', [status, id]);

        res.status(200).json({ message: 'Laporan updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating laporan.', error });
    }
};

module.exports = {
    createLaporan,
    getLaporan,
    updateLaporan,
};
