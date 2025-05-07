const db = require('../helper/connectionDB');

const createTps = async (req, res) => {
    try {
        const { idSubDistrict, name } = req.body;

        // Check if the user has access to this sub-district
        if (['province', 'city', 'district', 'sub_district'].includes(req.user.role)) {
            const userPrefix = req.user.role === 'province'
                ? req.user.wilayah.idProvince.toString().substring(0, 2)
                : req.user.role === 'city'
                ? req.user.wilayah.idCity.toString().substring(0, 4)
                : req.user.role === 'district'
                ? req.user.wilayah.idDistrict.toString().substring(0, 6)
                : req.user.wilayah.idSubDistrict.toString();
            const subDistrictPrefix = idSubDistrict.toString().substring(0, userPrefix.length);
            if (userPrefix !== subDistrictPrefix) {
                return res.status(403).json({ message: 'Access denied. Sub-district is not under your jurisdiction.' });
            }
        }

        // Insert TPS into the tpsData table
        await db.query(
            'INSERT INTO tpsData (name, idSubDistrict) VALUES (?, ?)',
            [name, idSubDistrict]
        );

        res.status(201).json({ message: 'TPS created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating TPS.', error });
    }
};

const getTps = async (req, res) => {
    try {
        let query = `
            SELECT 
                t.idTps, 
                t.name AS tpsName, 
                sd.name AS subDistrictName, 
                d.name AS districtName, 
                c.name AS cityName, 
                p.name AS provinceName
            FROM tpsData t
            JOIN subDistrictData sd ON t.idSubDistrict = sd.idSubDistrict
            JOIN districtData d ON sd.idDistrict = d.idDistrict
            JOIN cityData c ON d.idCity = c.idCity
            JOIN provinceData p ON c.idProvince = p.idProvince
        `;
        const params = [];

        // Restrict access for province, city, district, or sub-district role
        if (['province', 'city', 'district', 'sub_district'].includes(req.user.role)) {
            const userPrefix = req.user.role === 'province'
                ? req.user.wilayah.idProvince.toString().substring(0, 2)
                : req.user.role === 'city'
                ? req.user.wilayah.idCity.toString().substring(0, 4)
                : req.user.role === 'district'
                ? req.user.wilayah.idDistrict.toString().substring(0, 6)
                : req.user.wilayah.idSubDistrict.toString();
            query += ` WHERE LEFT(sd.idSubDistrict, ?) = ?`;
            params.push(userPrefix.length, userPrefix);
        }

        const tps = await db.query(query, params);

        res.status(200).json({ message: 'List of TPS with location details.', tps });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching TPS.', error });
    }
};

const updateTps = async (req, res) => {
    try {
        const { id } = req.params;
        const { idSubDistrict, name } = req.body;

        // Check if the user has access to this sub-district
        if (['province', 'city', 'district', 'sub_district'].includes(req.user.role)) {
            const userPrefix = req.user.role === 'province'
                ? req.user.wilayah.idProvince.toString().substring(0, 2)
                : req.user.role === 'city'
                ? req.user.wilayah.idCity.toString().substring(0, 4)
                : req.user.role === 'district'
                ? req.user.wilayah.idDistrict.toString().substring(0, 6)
                : req.user.wilayah.idSubDistrict.toString();
            const subDistrictPrefix = idSubDistrict.toString().substring(0, userPrefix.length);
            if (userPrefix !== subDistrictPrefix) {
                return res.status(403).json({ message: 'Access denied. Sub-district is not under your jurisdiction.' });
            }
        }

        // Update TPS in the tpsData table
        await db.query(
            'UPDATE tpsData SET name = ?, idSubDistrict = ? WHERE idTps = ?',
            [name, idSubDistrict, id]
        );

        res.status(200).json({ message: 'TPS updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating TPS.', error });
    }
};

const deleteTps = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the user has access to this TPS
        if (['province', 'city', 'district', 'sub_district'].includes(req.user.role)) {
            const [tps] = await db.query(
                `SELECT sd.idSubDistrict FROM tpsData t
                 JOIN subDistrictData sd ON t.idSubDistrict = sd.idSubDistrict
                 WHERE t.idTps = ?`,
                [id]
            );

            if (!tps.length) {
                return res.status(404).json({ message: 'TPS not found.' });
            }

            const userPrefix = req.user.role === 'province'
                ? req.user.wilayah.idProvince.toString().substring(0, 2)
                : req.user.role === 'city'
                ? req.user.wilayah.idCity.toString().substring(0, 4)
                : req.user.role === 'district'
                ? req.user.wilayah.idDistrict.toString().substring(0, 6)
                : req.user.wilayah.idSubDistrict.toString();
            const subDistrictPrefix = tps[0].idSubDistrict.toString().substring(0, userPrefix.length);
            if (userPrefix !== subDistrictPrefix) {
                return res.status(403).json({ message: 'Access denied. TPS is not under your jurisdiction.' });
            }
        }

        // Delete TPS from the tpsData table
        await db.query('DELETE FROM tpsData WHERE idTps = ?', [id]);

        res.status(200).json({ message: 'TPS deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting TPS.', error });
    }
};

module.exports = {
    createTps,
    getTps,
    updateTps,
    deleteTps,
};
