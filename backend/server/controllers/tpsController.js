const db = require('../helper/connectionDB');

const createTps = async (req, res) => {
    try {
        const { name, idSubDistrict } = req.body;

        await db.query(
            'INSERT INTO tpsData (name, idSubDistrict) VALUES (?, ?)',
            [name, idSubDistrict]
        );

        res.status(201).json({ message: 'TPS created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating TPS.', error });
    }
};

const getTps = async (req, res) => {
    try {
        const tps = await db.query('SELECT * FROM tpsData');

        res.status(200).json({ message: 'List of TPS.', tps });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching TPS.', error });
    }
};

const updateTps = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, idSubDistrict } = req.body;

        await db.query(
            'UPDATE tpsData SET name = ?, idSubDistrict = ? WHERE idTps = ?',
            [name, idSubDistrict, id]
        );

        res.status(200).json({ message: 'TPS updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating TPS.', error });
    }
};

const deleteTps = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM tpsData WHERE idTps = ?', [id]);

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
