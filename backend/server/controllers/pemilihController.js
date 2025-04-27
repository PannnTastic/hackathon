const db = require('../helper/connectionDB');

const createPemilih = async (req, res) => {
    try {
        const { nama, tanggal_lahir, jenis_kelamin, tps_id } = req.body;

        await db.query(
            'INSERT INTO pemilih (nama, tanggal_lahir, jenis_kelamin, tps_id) VALUES (?, ?, ?, ?)',
            [nama, tanggal_lahir, jenis_kelamin, tps_id]
        );

        res.status(201).json({ message: 'Pemilih created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating pemilih.', error });
    }
};

const getPemilih = async (req, res) => {
    try {
        const pemilih = await db.query('SELECT * FROM pemilih');

        res.status(200).json({ message: 'List of pemilih.', pemilih });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pemilih.', error });
    }
};

const updatePemilih = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, tanggal_lahir, jenis_kelamin, tps_id } = req.body;

        await db.query(
            'UPDATE pemilih SET nama = ?, tanggal_lahir = ?, jenis_kelamin = ?, tps_id = ? WHERE id = ?',
            [nama, tanggal_lahir, jenis_kelamin, tps_id, id]
        );

        res.status(200).json({ message: 'Pemilih updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating pemilih.', error });
    }
};

const deletePemilih = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM pemilih WHERE id = ?', [id]);

        res.status(200).json({ message: 'Pemilih deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting pemilih.', error });
    }
};

module.exports = {
    createPemilih,
    getPemilih,
    updatePemilih,
    deletePemilih,
};
