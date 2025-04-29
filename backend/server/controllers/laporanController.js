const db = require('../helper/connectionDB');

const createLaporan = async (req, res) => {
    try {
        const { tps_id, bukti } = req.body;

        await db.query(
            'INSERT INTO laporan (tps_id, bukti) VALUES (?, ?)',
            [tps_id, bukti]
        );

        res.status(201).json({ message: 'Laporan created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating laporan.', error });
    }
};

const getLaporan = async (req, res) => {
    try {
        const laporan = await db.query('SELECT * FROM laporan');

        res.status(200).json({ message: 'List of laporan.', laporan });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching laporan.', error });
    }
};

const updateLaporan = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.query('UPDATE laporan SET status = ? WHERE id = ?', [status, id]);

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
