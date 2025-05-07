const db = require('../helper/connectionDB');

const createAdmin = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const { role: creatorRole, wilayah } = req.user;
        
        // Determine correct location ID values
        let idLocation = req.body.idLocation;
        let idTps = req.body.idTps;
        
        // Handle special cases for TPS roles
        if (role === 'adminTps' || role === 'officerTps') {
            if (!idTps) {
                return res.status(400).json({ message: 'idTps is required for adminTps or officerTps roles.' });
            }else if (wilayah.idTps !== idTps) {
                return res.status(403).json({ message: 'You do not have permission to create an admin for this TPS.' });
            }else if (idLocation !== wilayah.idSubDistrict) {
                return res.status(403).json({ message: 'You do not have permission to create an admin for this location.' });
            }

            // Query to get idSubDistrict from idTps
            const [[tpsData]] = await db.query('SELECT idSubDistrict FROM tpsdata WHERE idTps = ?', [idTps]);
            if (!tpsData) {
                return res.status(404).json({ message: 'TPS not found.' });
            }
            idSubDistrict = tpsData.idSubDistrict;
        }
        
        // Execute stored procedure
        const [results] = await db.query(
            'CALL sp_createAdmin(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  @status, @message)',
            [
                email, 
                password, 
                name, 
                role, 
                idLocation, 
                idTps,
                creatorRole,
                wilayah?.idProvince || null,
                wilayah?.idCity || null,
                wilayah?.idDistrict || null,
                wilayah?.idSubDistrict || null,
                
            ]
        );
        
        // Get output parameters
        const [[statusResult]] = await db.query('SELECT @status AS status, @message AS message');
        
        return res.status(statusResult.status).json({ message: statusResult.message });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin.', error: error.message });
    }
};


const getAdmin = async (req, res) => {
    try {
        const { role, wilayah } = req.user;
        const { idProvince, idCity, idDistrict, idSubDistrict, idTps } = req.query;

        // Call the stored procedure
        const [results] = await db.query(
            'CALL sp_getAdmin(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                role,
                wilayah?.idProvince || null,
                wilayah?.idCity || null,
                wilayah?.idDistrict || null,
                wilayah?.idSubDistrict || null,
                wilayah?.idTps || null,
                idProvince || null,
                idCity || null,
                idDistrict || null,
                idSubDistrict || null,
                idTps || null
            ]
        );

        // MySQL returns stored procedure results in a different format
        // Usually, the first element contains the actual result set
        res.json(results[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const { idUser } = req.params;
        const { email, name, role } = req.body;
        let idLocation = req.body.idLocation;
        let idTps = req.body.idTps;

        // Ambil info user pembuat (admin yang login)
        const { role: userRole, wilayah } = req.user;

        // Panggil stored procedure
        const [results] = await db.query(
            'CALL sp_updateAdmin(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @status, @message)',
            [
                idUser,
                email,
                name,
                role,
                idLocation,
                idTps,
                userRole,
                wilayah?.idProvince || null,
                wilayah?.idCity || null,
                wilayah?.idDistrict || null,
                wilayah?.idSubDistrict || null,
                wilayah?.idTps || null
            ]
        );

        // Ambil hasil output parameter
        const [[statusResult]] = await db.query('SELECT @status AS status, @message AS message');

        return res.status(statusResult.status).json({ message: statusResult.message });
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin.', error: error.message });
    }
};




const deleteAdmin = async (req, res) => {
    try {
        const { idUser } = req.params;
        const { role: userRole, wilayah } = req.user;

        const [results] = await db.query(
            'CALL sp_deleteAdmin(?, ?, ?, ?, ?, ?, ?, @status, @message)',
            [
                idUser,
                userRole,
                wilayah?.idProvince || null,
                wilayah?.idCity || null,
                wilayah?.idDistrict || null,
                wilayah?.idSubDistrict || null,
                wilayah?.idTps || null
            ]
        );

        const [[statusResult]] = await db.query('SELECT @status AS status, @message AS message');
        return res.status(statusResult.status).json({ message: statusResult.message });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting admin.', error: error.message });
    }
};


module.exports = {
    createAdmin,
    getAdmin,
    updateAdmin,
    deleteAdmin,
};