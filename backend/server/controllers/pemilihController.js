const db = require('../helper/connectionDB');

const createPemilih = async (req, res) => {
    try {
        const { nik, name, dateOfBirth, gender, idOfficer, locationPhoto } = req.body;

        await db.query(
            'INSERT INTO voterData (nik, name, dateOfBirth, gender, idOfficer, locationPhoto) VALUES (?, ?, ?, ?, ?, ?)',
            [nik, name, dateOfBirth, gender, idOfficer, locationPhoto]
        );

        res.status(201).json({ message: 'Voter created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating voter.', error });
    }
};

const getPemilih = async (req, res) => {
    try {
        const voters = await db.query(`
            SELECT 
                v.idData AS voterId,
                v.nik,
                v.name AS voterName,
                v.dateOfBirth,
                v.gender,
                v.locationPhoto,
                o.name AS officerName,
                t.name AS tpsName,
                sd.name AS subDistrictName,
                d.name AS districtName,
                c.name AS cityName,
                p.name AS provinceName
            FROM voterData v
            JOIN officerTpsUserDetail o ON v.idOfficer = o.idData
            JOIN tpsData t ON o.idTps = t.idTps
            JOIN subDistrictData sd ON t.idSubDistrict = sd.idSubDistrict
            JOIN districtData d ON sd.idDistrict = d.idDistrict
            JOIN cityData c ON d.idCity = c.idCity
            JOIN provinceData p ON c.idProvince = p.idProvince
        `);
        res.status(200).json({ message: 'List of voters with location details.', voters });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching voters.', error });
    }
};

const updatePemilih = async (req, res) => {
    try {
        const { id } = req.params;
        const { nik, name, dateOfBirth, gender, idOfficer, locationPhoto } = req.body;

        await db.query(
            'UPDATE voterData SET nik = ?, name = ?, dateOfBirth = ?, gender = ?, idOfficer = ?, locationPhoto = ? WHERE idData = ?',
            [nik, name, dateOfBirth, gender, idOfficer, locationPhoto, id]
        );

        res.status(200).json({ message: 'Voter updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating voter.', error });
    }
};

const deletePemilih = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM voterData WHERE idData = ?', [id]);

        res.status(200).json({ message: 'Voter deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting voter.', error });
    }
};

module.exports = {
    createPemilih,
    getPemilih,
    updatePemilih,
    deletePemilih,
};
