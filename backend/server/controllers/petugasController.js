const db = require('../helper/connectionDB');

const createPetugas = async (req, res) => {
    try {
        // Ensure only kelurahan admins can create petugas
        if (req.user.role !== 'kelurahan') {
            return res.status(403).json({ message: 'Access denied. Only kelurahan admins can create petugas.' });
        }

        const { username, password, nama, role, tps_id } = req.body;

        // Validate role
        const allowedRoles = ['pendataan', 'penghitungan'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: `Invalid role. Allowed roles are: ${allowedRoles.join(', ')}` });
        }

        // Insert petugas into the database
        await db.query(
            'INSERT INTO petugas (username, password, nama, role, tps_id) VALUES (?, ?, ?, ?, ?)',
            [username, password, nama, role, tps_id]
        );

        res.status(201).json({ message: 'Petugas created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating petugas.', error });
    }
};

const getPetugas = async (req, res) => {
    try {
        const petugas = await db.query('SELECT id, username, nama, role, tps_id FROM petugas');

        res.status(200).json({ message: 'List of petugas.', petugas });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching petugas.', error });
    }
};

const updatePetugas = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, nama, role, tps_id } = req.body;

        await db.query(
            'UPDATE petugas SET username = ?, password = ?, nama = ?, role = ?, tps_id = ? WHERE id = ?',
            [username, password, nama, role, tps_id, id]
        );

        res.status(200).json({ message: 'Petugas updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating petugas.', error });
    }
};

const deletePetugas = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM petugas WHERE id = ?', [id]);

        res.status(200).json({ message: 'Petugas deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting petugas.', error });
    }
};

module.exports = {
    createPetugas,
    getPetugas,
    updatePetugas,
    deletePetugas,
};
