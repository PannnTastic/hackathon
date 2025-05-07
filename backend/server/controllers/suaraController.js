const db = require('../helper/connectionDB');

const createSuara = async (req, res) => {
    try {
        const { countTotal, countValid, countInvalid, countAbstain, locationPhoto, idAdmin } = req.body;

        await db.query(
            'INSERT INTO electionData (countTotal, countValid, countInvalid, countAbstain, locationPhoto, idAdmin) VALUES (?, ?, ?, ?, ?, ?)',
            [countTotal, countValid, countInvalid, countAbstain, locationPhoto, idAdmin]
        );

        res.status(201).json({ message: 'Election data created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating election data.', error });
    }
};

const getSuara = async (req, res) => {
    try {
        const electionData = await db.query(`
            SELECT 
                e.idData AS electionId,
                e.countTotal,
                e.countValid,
                e.countInvalid,
                e.countAbstain,
                e.locationPhoto,
                a.name AS adminName,
                t.name AS tpsName
            FROM electionData e
            JOIN adminTpsUserDetail a ON e.idAdmin = a.idData
            JOIN tpsData t ON a.idTps = t.idTps
        `);

        res.status(200).json({ message: 'List of election data.', electionData });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching election data.', error });
    }
};

const updateSuara = async (req, res) => {
    try {
        const { id } = req.params;
        const { countTotal, countValid, countInvalid, countAbstain, locationPhoto } = req.body;

        await db.query(
            'UPDATE electionData SET countTotal = ?, countValid = ?, countInvalid = ?, countAbstain = ?, locationPhoto = ? WHERE idData = ?',
            [countTotal, countValid, countInvalid, countAbstain, locationPhoto, id]
        );

        res.status(200).json({ message: 'Election data updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating election data.', error });
    }
};

const deleteSuara = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM electionData WHERE idData = ?', [id]);

        res.status(200).json({ message: 'Election data deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting election data.', error });
    }
};

module.exports = {
    createSuara,
    getSuara,
    updateSuara,
    deleteSuara,
};
