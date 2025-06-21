const db = require('../helper/connectionDB');

const createAdmin = async (req, res) => {
    const {nama, email, password, regionName, createAdmin} = req.body;
    const {role} = req.user;

    if (!nama || !email || !password || !regionName || !createAdmin) {
        return res.status(400).json({
            status: 400,
            message: "All fields are required",
        });
    }
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if([rows][0].length > 0){
        console.log(rows)
        return res.status(400).json({
            status: 400,
            message: "Email Already Exist",
        });
    }

    try{
    const [rows] = await db.query('CALL sp_createAdmin_(?,?,?,?,?,?)', [nama, email, password, regionName, role, createAdmin])
    if(rows[0][0].STATUS == 200){
        return res.status(200).json({
            status: 200,
            message: "Berhasil menambah"
    })}
    return res.status(500).json({
        status: 500,
        message: "Gagal menambah",
    })
    }catch (error){
        console.log(error)
        return res.status(500).json({message: error.message})  
    }
};

const getAdmin = async (req, res) => {
    try {
        const { role, wilayah } = req.user;
        const { idProvince, idCity, idDistrict, idSubDistrict, idTps } = req.query;

        let query = `
        SELECT 
            users.idUser, users.email, users.role,
            COALESCE(nud.name, pud.name, cud.name, dud.name, sdud.name, atud.name, otud.name) AS name,
            CASE 
                WHEN users.role = 'national' THEN 'Nasional'
                WHEN users.role = 'province' THEN pr.name
                WHEN users.role = 'city' THEN ct.name
                WHEN users.role = 'district' THEN dt.name
                WHEN users.role = 'sub_district' THEN sd.name
                WHEN users.role = 'adminTps' THEN tps.name
                WHEN users.role = 'officerTps' THEN tps.name
                ELSE NULL
            END AS region_name
        FROM users
        LEFT JOIN nationalUsersDetail nud ON users.idUser = nud.idUser
        LEFT JOIN provinceUsersDetail pud ON users.idUser = pud.idUser
        LEFT JOIN cityUsersDetail cud ON users.idUser = cud.idUser
        LEFT JOIN districtUsersDetail dud ON users.idUser = dud.idUser
        LEFT JOIN subDistrictUsersDetail sdud ON users.idUser = sdud.idUser
        LEFT JOIN adminTpsUserDetail atud ON users.idUser = atud.idUser
        LEFT JOIN officerTpsUserDetail otud ON users.idUser = otud.idUser

        -- Join ke tabel referensi nama wilayah
        LEFT JOIN provinceData pr ON pud.idProvince = pr.idProvince
        LEFT JOIN cityData ct ON cud.idCity = ct.idCity
        LEFT JOIN districtData dt ON dud.idDistrict = dt.idDistrict
        LEFT JOIN subDistrictData sd ON sdud.idSubDistrict = sd.idSubDistrict
        LEFT JOIN tpsData tps ON atud.idTps = tps.idTps OR otud.idTps = tps.idTps
        
        WHERE 1=1
        `;

        const params = [];

        if (role === 'province') {
            query += ` AND (
                pud.idProvince = ? OR 
                cud.idCity IN (SELECT idCity FROM cityData WHERE idProvince = ?) OR
                dud.idDistrict IN (SELECT idDistrict FROM districtData WHERE idCity IN (SELECT idCity FROM cityData WHERE idProvince = ?)) OR
                sdud.idSubDistrict IN (SELECT idSubDistrict FROM subDistrictData WHERE idDistrict IN (SELECT idDistrict FROM districtData WHERE idCity IN (SELECT idCity FROM cityData WHERE idProvince = ?)))
            )`;
            params.push(wilayah.idProvince, wilayah.idProvince, wilayah.idProvince, wilayah.idProvince);
        } else if (role === 'city') {
            query += ` AND (
                cud.idCity = ? OR
                dud.idDistrict IN (SELECT idDistrict FROM districtData WHERE idCity = ?) OR
                sdud.idSubDistrict IN (SELECT idSubDistrict FROM subDistrictData WHERE idDistrict IN (SELECT idDistrict FROM districtData WHERE idCity = ?))
            )`;
            params.push(wilayah.idCity, wilayah.idCity, wilayah.idCity);
        } else if (role === 'district') {
            query += ` AND (
                dud.idDistrict = ? OR
                sdud.idSubDistrict IN (SELECT idSubDistrict FROM subDistrictData WHERE idDistrict = ?)
            )`;
            params.push(wilayah.idDistrict, wilayah.idDistrict);
        } else if (role === 'sub_district') {
            query += ` AND sdud.idSubDistrict = ?`;
            params.push(wilayah.idSubDistrict);
        }

        // Tambahan filter query params
        if (idProvince) {
            query += ` AND pud.idProvince = ?`;
            params.push(idProvince);
        }
        if (idCity) {
            query += ` AND cud.idCity = ?`;
            params.push(idCity);
        }
        if (idDistrict) {
            query += ` AND dud.idDistrict = ?`;
            params.push(idDistrict);
        }
        if (idSubDistrict) {
            query += ` AND sdud.idSubDistrict = ?`;
            params.push(idSubDistrict);
        }
        if (idTps) {
            query += ` AND (atud.idTps = ? OR otud.idTps = ?)`;
            params.push(idTps, idTps);
        }

        const [results] = await db.query(query, params);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateAdmin = async (req, res) => {
    const { id } = req.params
    const { nama, email, password, regionName, updateRole } = req.body;
    const { role } = req.user;

    try {
        const [rows] = await db.query('CALL sp_editAdmin_(?,?,?,?,?,?);', [id, nama, email, password, regionName, role, updateRole])
        console.log(rows[0][0].status)

    if (rows[0][0].status == "Berhasil mengubah") {
        res.status(200).json({
            status: 200,
            message: "Berhasil mengubah",
        });
    } else {
        res.status(500).json({
            status: 500,
            message: "Gagal mengubah",
        });
    }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
        
    }

};


const deleteAdmin = async (req, res) => {
    try {
        const { idUser } = req.params;

        // Cari user
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [idUser]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const currentRole = user[0].role;

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Delete dari tabel detail
            let detailTable = '';
            if (currentRole === 'national') detailTable = 'nationalUsersDetail';
            else if (currentRole === 'province') detailTable = 'provinceUsersDetail';
            else if (currentRole === 'district') detailTable = 'districtUsersDetail';
            else if (currentRole === 'subdistrict') detailTable = 'subDistrictUsersDetail';
            else if (currentRole === 'adminTps') detailTable = 'adminTpsUserDetail';
            else if (currentRole === 'officerTps') detailTable = 'officerTpsUserDetail';
            else throw new Error('Invalid role.');

            await connection.query(`DELETE FROM ${detailTable} WHERE idUser = ?`, [idUser]);

            // Delete dari tabel users
            await connection.query('DELETE FROM users WHERE id = ?', [idUser]);

            await connection.commit();
            res.status(200).json({ message: 'Admin deleted successfully.' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
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
