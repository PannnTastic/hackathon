const db = require('../helper/connectionDB');
const handleDbError = require('../helper/dbErrorHandler');
const {renameAndMoveFile} = require('../helper/fileUploader');
const fs = require('fs');

exports.createElectionData = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Foto bukti C6 wajib diunggah.' });
    }

    try {
        const actorIdUser = req.user.idUser;
        const { countValid, countInvalid } = req.body;

        if (countValid === undefined || countInvalid === undefined) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Data suara sah dan tidak sah wajib diisi.' });
        }
        
        const locationPhoto = req.file.path;
        const query = 'CALL sp_election_create(?, ?, ?, ?)';
        await db.execute(query, [actorIdUser, countValid, countInvalid, locationPhoto]);
        
        res.status(201).json({ message: 'Data rekapitulasi suara berhasil dikirim.' });

    } catch (error) {
        fs.unlinkSync(req.file.path);
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};


exports.updateElectionData = async (req, res) => {
    let finalPhotoPath = null;
    try {
        const actorIdUser = req.user.idUser;
        const { id } = req.params;
        const { countValid, countInvalid, countAbstain } = req.body;

        if (req.file) {
            finalPhotoPath = await renameAndMoveFile(req);
        }

        const query = 'CALL sp_election_update(?, ?, ?, ?, ?, ?)';
        await db.execute(query, [actorIdUser, id, countValid || null, countInvalid || null, countAbstain || null, finalPhotoPath]);
        
        res.status(200).json({ message: 'Data rekapitulasi berhasil diperbarui.' });
    } catch (error) {
        if (finalPhotoPath && fs.existsSync(finalPhotoPath)) {
            fs.unlinkSync(finalPhotoPath);
        } else if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.getElectionData = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const { idTps } = req.query;
        const query = 'CALL sp_election_read(?, ?)';
        const [rows] = await db.execute(query, [actorIdUser, idTps || null]);
        res.status(200).json(rows[0]);
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};

exports.archiveElectionData = async (req, res) => {
    try {
        const actorIdUser = req.user.idUser;
        const { id } = req.params;
        const query = 'CALL sp_election_archive(?, ?)';
        await db.execute(query, [actorIdUser, id]);
        res.status(204).send();
    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};
