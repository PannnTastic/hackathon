const db = require('../helper/connectionDB'); // Assuming a database connection module is used

const inputSuara = async (req, res) => {
    try {
        const { tps_id, suara_sah, suara_tidak_sah, golput } = req.body;

        // Fetch total voters for the TPS
        const totalPemilihResult = await db.query(
            'SELECT COUNT(*) AS total FROM pemilih WHERE tps_id = ?',
            [tps_id]
        );
        const totalPemilih = totalPemilihResult[0]?.total || 0;

        // Validate vote counts
        const totalVotes = suara_sah + suara_tidak_sah + golput;
        if (totalVotes > totalPemilih) {
            return res.status(400).json({ message: 'Total votes exceed total voters.' });
        }

        // Insert vote data into the suara table
        await db.query(
            'INSERT INTO suara (tps_id,  suara_sah, suara_tidak_sah) VALUES (?, ?, ?)',
            [tps_id, suara_sah, suara_tidak_sah,golput]
        );

        res.status(201).json({ message: 'Data suara berhasil diinput.' });
    } catch (error) {
        res.status(500).json({ message: 'Error inputting suara.', error });
    }
};

const editSuara = async (req, res) => {
    try {
        const { id } = req.params;
        const { suara_sah, suara_tidak_sah, golput } = req.body;

        // Update suara data
        await db.query(
            'UPDATE suara SET suara_sah = ?, suara_tidak_sah = ?, golput = ? WHERE id = ?',
            [suara_sah, suara_tidak_sah, golput, id]
        );

        res.status(200).json({ message: 'Data suara berhasil diperbarui.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating suara.', error });
    }
};

const uploadC6ForSuara = async (req, res) => {
    try {
        const { id } = req.params;
        const dokumen = req.file; // Assuming multer is used for file uploads

        if (!dokumen) {
            return res.status(400).json({ message: 'No C6 file uploaded.' });
        }

        // Update suara table to include C6 document
        await db.query('UPDATE suara SET c6_dokumen = ? WHERE id = ?', [
            dokumen.filename, // Save the filename in the database
            id,
        ]);

        res.status(200).json({ message: 'Dokumen C6 for suara uploaded successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading dokumen C6 for suara.', error });
    }
};

const grafikSuara = async (req, res) => {
    try {
        // Fetch vote data grouped by TPS
        const suara = await db.query(
            'SELECT tps_id, SUM(suara_sah) AS suara_sah, SUM(suara_tidak_sah) AS suara_tidak_sah, SUM(golput) AS golput FROM suara GROUP BY tps_id'
        );

        res.status(200).json({ message: 'Grafik suara generated successfully.', suara });
    } catch (error) {
        res.status(500).json({ message: 'Error generating grafik suara.', error });
    }
};

const getSuara = async (req, res) => {
    try {
        const suara = await db.query('SELECT * FROM suara');

        res.status(200).json({ message: 'List of suara.', suara });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching suara.', error });
    }
};

module.exports = {
    inputSuara,
    editSuara,
    uploadC6ForSuara,
    grafikSuara,
    getSuara,
};
