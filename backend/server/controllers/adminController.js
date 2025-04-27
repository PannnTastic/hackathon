const db = require('../helper/connectionDB');

const createAdmin = async (req, res) => {
    try {
        const { username, password, nama, role } = req.body;

        // Enforce hierarchical role-based restrictions
        const allowedRoles = {
            nasional: ['provinsi'],
            provinsi: ['kabupaten'],
            kabupaten: ['kecamatan'],
            kecamatan: ['kelurahan'],
            kelurahan: [], // Kelurahan cannot create any admin
        };

        if (!allowedRoles[req.user.role]?.includes(role)) {
            return res.status(403).json({
                message: `Access denied. ${req.user.role} can only create admins with roles: ${allowedRoles[req.user.role].join(', ')}`,
            });
        }

        await db.query(
            'INSERT INTO admin (username, password, nama, role) VALUES (?, ?, ?, ?)',
            [username, password, nama, role]
        );

        res.status(201).json({ message: 'Admin created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin.', error });
    }
};

const getAdmins = async (req, res) => {
    try {
        const admins = await db.query('SELECT id, username, nama, role FROM admin');

        res.status(200).json({ message: 'List of admins.', admins });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admins.', error });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, nama, role } = req.body;

        await db.query(
            'UPDATE admin SET username = ?, password = ?, nama = ?, role = ? WHERE id = ?',
            [username, password, nama, role, id]
        );

        res.status(200).json({ message: 'Admin updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin.', error });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM admin WHERE id = ?', [id]);

        res.status(200).json({ message: 'Admin deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting admin.', error });
    }
};

module.exports = {
    createAdmin,
    getAdmins,
    updateAdmin,
    deleteAdmin,
};
