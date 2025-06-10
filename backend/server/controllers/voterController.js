const db = require('../helper/connectionDB');
const fs = require('fs');
const pdf = require('pdf-parse');

exports.createVoter = async (req, res) => {
    const actorIdUser = req.user.idUser;
    
    const { idOfficerDetail, nik, name, dateOfBirth, gender, locationPhoto } = req.body;

    if (!idOfficerDetail || !nik || !name || !dateOfBirth || !gender) {
        return res.status(400).json({ message: 'ID Petugas, NIK, Nama, Tanggal Lahir, dan Gender wajib diisi.' });
    }

    try {
        const query = 'CALL sp_voter_create(?, ?, ?, ?, ?, ?, ?, @new_id, @message)';
        
        await db.execute(query, [actorIdUser, idOfficerDetail, nik, name, dateOfBirth, gender, locationPhoto || null]);
        
        const [[result]] = await db.execute('SELECT @new_id AS new_id, @message AS message');

        if (result.new_id) {
            res.status(201).json({ id: result.new_id, message: result.message });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.readAllVoters = async (req, res) => {
    const actorIdUser = req.user.idUser;
    const { name, nik, idTps, limit = 10, offset = 0 } = req.query;

    try {
        const query = 'CALL sp_voter_read(?, ?, ?, ?, ?, ?)';
        const [rows] = await db.execute(query, [
            actorIdUser, name || null, nik || null, idTps || null, parseInt(limit), parseInt(offset)
        ]);
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error saat membaca data pemilih:', error.message);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};

exports.updateVoter = async (req, res) => {
    const actorIdUser = req.user.idUser;
    const targetIdData = req.params.id;
    const { nik, name, dateOfBirth, gender, locationPhoto, status } = req.body;

    try {
        const query = 'CALL sp_voter_update(?, ?, ?, ?, ?, ?, ?, ?)';
        await db.execute(query, [
            actorIdUser, targetIdData, nik || null, name || null, dateOfBirth || null, gender || null, locationPhoto || null, status || null
        ]);
        res.status(200).json({ message: 'Data pemilih berhasil diperbarui.' });
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

exports.deleteVoter = async (req, res) => {
    const actorIdUser = req.user.idUser;
    const targetIdData = req.params.id;

    try {
        const query = 'CALL sp_voter_archive(?, ?)';
        await db.execute(query, [actorIdUser, targetIdData]);
        res.status(200).json({ message: 'Data pemilih berhasil diarsipkan.' });
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

exports.uploadVotersFromPdf = async (req, res) => {
    const actorIdUser = req.user.idUser;
    const { idOfficerDetail } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Tidak ada file PDF yang diunggah.' });
    }
    if (!idOfficerDetail) {
        return res.status(400).json({ message: 'ID Petugas (idOfficerDetail) wajib diisi.' });
    }

    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(dataBuffer);

        const voters = [];
        const dptRegex = /(\d{16})([A-Z\s]+)(\d{2}-\d{2}-\d{4})([LP])/g;
        let match;
        
        while ((match = dptRegex.exec(data.text)) !== null) {
            const [, nik, name, dob, gender] = match;
            const [day, month, year] = dob.split('-');
            const formattedDob = `${year}-${month}-${day}`;
            voters.push({
                nik: nik, name: name.trim(), dateOfBirth: formattedDob,
                gender: gender.toUpperCase() === 'L' ? 1 : 2,
            });
        }

        if (voters.length === 0) {
            return res.status(400).json({ message: 'Tidak ada data pemilih valid yang ditemukan dalam PDF.' });
        }
        
        const query = 'CALL sp_voter_bulk_create(?, ?, ?)';
        const [rows] = await db.execute(query, [actorIdUser, idOfficerDetail, JSON.stringify(voters)]);
        const insertedCount = rows[0][0].inserted_rows;

        res.status(200).json({
            message: 'Proses impor ke database sukses.',
            successfully_inserted: insertedCount
        });

    } catch (error) {
        return res.status(403).json({ message: error.message });
    } finally {
        fs.unlinkSync(req.file.path);
    }
};