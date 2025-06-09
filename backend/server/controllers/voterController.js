const db = require('../helper/connectionDB');

exports.createVoter = async (req, res) => {
    const actorIdUser = req.user.idUser;
    const { nik, name, dateOfBirth, gender, locationPhoto } = req.body;

    if (!nik || !name || !dateOfBirth || !gender) {
        return res.status(400).json({ message: 'NIK, Nama, Tanggal Lahir, dan Gender wajib diisi.' });
    }

    try {
        const query = 'CALL sp_voter_create(?, ?, ?, ?, ?, ?, @new_id, @message)';
        await db.execute(query, [actorIdUser, nik, name, dateOfBirth, gender, locationPhoto || null]);
        
        const [[result]] = await db.execute('SELECT @new_id AS new_id, @message AS message');

        if (result.new_id) {
            res.status(201).json({ id: result.new_id, message: result.message });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error saat membuat data pemilih:', error.message);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
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
        const DBMesssage = error.message.split('1644: ')[1] || 'Gagal mengarsipkan data pemilih.';
        res.status(403).json({ message: DBMesssage });
    }
};