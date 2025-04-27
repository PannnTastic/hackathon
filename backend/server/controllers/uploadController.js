const db = require('../helper/connectionDB');

const uploadPemilih = async (req, res) => {
    try {
        const { tps_id, pemilihData } = req.body;
        const values = pemilihData.map(({ nama, tanggal_lahir, jenis_kelamin }) => [
            nama,
            tanggal_lahir,
            jenis_kelamin,
            tps_id,
        ]);

        await db.query(
            'INSERT INTO pemilih (nama, tanggal_lahir, jenis_kelamin, tps_id) VALUES ?',
            [values]
        );
 
        res.status(201).json({ message: 'Data pemilih uploaded successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading data pemilih.', error });
    }
};

const uploadFoto = async (req, res) => {
    try {
        const { pemilih_id } = req.body;
        const foto = req.file; // Assuming multer is used for file uploads
        if (!foto) {
            return res.status(400).json({ message: 'No photo uploaded.' });
        }

        await db.query('UPDATE pemilih SET foto = ? WHERE id = ?', [foto.buffer, pemilih_id]);

        res.status(200).json({ message: 'Foto pemilih uploaded successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading foto pemilih.', error });
    }
};

const uploadC6 = async (req, res) => {
    try {
        const { tps_id, dokumen } = req.body;

        await db.query('INSERT INTO c6 (tps_id, dokumen, status) VALUES (?, ?, ?)', [
            tps_id,
            dokumen,
            'menunggu',
        ]);

        res.status(201).json({ message: 'Dokumen C6 uploaded successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading dokumen C6.', error });
    }
};

const validasiC6 = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.query('UPDATE c6 SET status = ? WHERE id = ?', [status, id]);

        res.status(200).json({ message: 'Dokumen C6 validated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error validating dokumen C6.', error });
    }
};

const updateC6 = async (req, res) => {
    try {
        const { id } = req.params;
        const { dokumen } = req.body;

        await db.query('UPDATE c6 SET dokumen = ? WHERE id = ?', [dokumen, id]);

        res.status(200).json({ message: 'Dokumen C6 updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating dokumen C6.', error });
    }
};

module.exports = {
    uploadPemilih,
    uploadFoto,
    uploadC6,
    validasiC6,
    updateC6,
};
