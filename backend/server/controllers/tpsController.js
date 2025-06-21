const db = require('../helper/connectionDB');

const createTps = async (req, res) => {
    try {
        const { provinsi, kabupaten, kecamatan, kelurahan, no_tps } = req.body;

        await db.query(
            'INSERT INTO tps (provinsi, kabupaten, kecamatan, kelurahan, no_tps) VALUES (?, ?, ?, ?, ?)',
            [provinsi, kabupaten, kecamatan, kelurahan, no_tps]
        );

        res.status(201).json({ message: 'TPS created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating TPS.', error });
    }
};

const getTps = async (req, res) => {
    try {
        const tps = await db.query('SELECT * FROM tps');

        res.status(200).json({ message: 'List of TPS.', tps });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching TPS.', error });
    }
};

const updateTps = async (req, res) => {
    try {
        const { id } = req.params;
        const { provinsi, kabupaten, kecamatan, kelurahan, no_tps } = req.body;

        await db.query(
            'UPDATE tps SET provinsi = ?, kabupaten = ?, kecamatan = ?, kelurahan = ?, no_tps = ? WHERE id = ?',
            [provinsi, kabupaten, kecamatan, kelurahan, no_tps, id]
        );

        res.status(200).json({ message: 'TPS updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating TPS.', error });
    }
};

const deleteTps = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM tps WHERE id = ?', [id]);

        res.status(200).json({ message: 'TPS deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting TPS.', error });
    }
};

module.exports = {
    createTps,
    getTps,
    updateTps,
    deleteTps,
};
