const db = require('../helper/connectionDB');
const fs = require('fs');
const pdf = require('pdf-parse');
const handleDbError = require('../helper/dbErrorHandler');

exports.createVoter = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const { idOfficerUser, nik, name, dateOfBirth, gender, locationPhoto } = req.body;
        if (!idOfficerUser || !nik || !name || !dateOfBirth || !gender) {
            return res.status(400).json({ message: 'ID Petugas, NIK, Nama, Tanggal Lahir, dan Gender wajib diisi.' });
        }
        const query = 'CALL sp_voter_create(?, ?, ?, ?, ?, ?, ?, @new_id, @message)';
        await db.execute(query, [actorIdUser, idOfficerUser, nik, name, dateOfBirth, gender, locationPhoto || null]);
        const [[result]] = await db.execute('SELECT @new_id AS new_id, @message AS message');
        if (result.new_id) {
            res.status(201).json({ id: result.new_id, message: result.message });
        } else {
            res.status(409).json({ message: result.message });
        }
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.readAllVoters = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const { name, nik, idTps, limit = 10, offset = 0 } = req.query;
        const query = 'CALL sp_voter_read(?, ?, ?, ?, ?, ?)';
        const [rows] = await db.execute(query, [
            actorIdUser, name || null, nik || null, idTps || null, parseInt(limit), parseInt(offset)
        ]);
        res.status(200).json(rows[0]);
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.updateVoter = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const targetIdData = req.params.id;
        const { nik, name, dateOfBirth, gender, locationPhoto, status } = req.body;
        const query = 'CALL sp_voter_update(?, ?, ?, ?, ?, ?, ?, ?)';
        await db.execute(query, [
            actorIdUser, targetIdData, nik || null, name || null, dateOfBirth || null, 
            gender || null, locationPhoto || null, status || null
        ]);
        res.status(200).json({ message: 'Data pemilih berhasil diperbarui.' });
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.deleteVoter = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const targetIdData = req.params.id;
        const query = 'CALL sp_voter_archive(?, ?)';
        await db.execute(query, [actorIdUser, targetIdData]);
        res.status(204).send();
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.uploadVotersFromPdf = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const { idOfficerUser } = req.body; // Menggunakan idOfficerUser
        const isDryRun = req.query.dryRun === 'true';

        if (!req.file) return res.status(400).json({ message: 'Tidak ada file PDF yang diunggah.' });
        if (!isDryRun && !idOfficerUser) return res.status(400).json({ message: 'ID Petugas (idOfficerUser) wajib diisi.' });

        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(dataBuffer);
        const voters = [];
        const dptRegex = /(\d{16})([A-Z\s]+)(\d{2}-\d{2}-\d{4})([LP])/g;
        let match;
        while ((match = dptRegex.exec(data.text)) !== null) {
            const [, nik, name, dob, gender] = match;
            const [day, month, year] = dob.split('-');
            const formattedDob = `${year}-${month}-${day}`;
            voters.push({ nik: nik, name: name.trim(), dateOfBirth: formattedDob, gender: gender.toUpperCase() === 'L' ? 1 : 2 });
        }

        if (voters.length === 0) return res.status(400).json({ message: 'Tidak ada data pemilih valid yang ditemukan dalam PDF.' });
        
        if (isDryRun) {
            return res.status(200).json({ message: "Dry Run: Data berhasil diparsing dari PDF.", total_data_found: voters.length, parsed_voters: voters });
        }

        const query = 'CALL sp_voter_bulk_create(?, ?, ?)';
        const [rows] = await db.execute(query, [actorIdUser, idOfficerUser, JSON.stringify(voters)]);
        const insertedCount = rows[0][0].affected_rows; // SP mengembalikan affected_rows

        res.status(200).json({ message: 'Proses impor ke database selesai.', total_data_in_pdf: voters.length, affected_rows: insertedCount });
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    } finally {
        if (req.file) fs.unlinkSync(req.file.path);
    }
};