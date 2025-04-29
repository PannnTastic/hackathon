const jwt = require('jsonwebtoken');
const db = require('../helper/connectionDB'); // koneksi database

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token not found' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Tambahkan data wilayah ke req.user
        const { idUser, role } = decoded;
        let wilayahQuery = '';
        switch (role) {
        case 'province':
            wilayahQuery = `SELECT idProvince FROM provinceUsersDetail WHERE idUser = ?`;
            break;
        case 'city':
            wilayahQuery = `SELECT idCity FROM cityUsersDetail WHERE idUser = ?`;
            break;
        case 'district':
            wilayahQuery = `SELECT idDistrict FROM districtUsersDetail WHERE idUser = ?`;
            break;
        case 'sub_district':
            wilayahQuery = `SELECT idSubDistrict FROM subDistrictUsersDetail WHERE idUser = ?`;
            break;
        case 'adminTps':
        case 'officerTps':
            wilayahQuery = `SELECT idTps FROM adminTpsUserDetail WHERE idUser = ?`;
            break;
        default:
            wilayahQuery = '';
        }

        if (wilayahQuery) {
        const [wilayah] = await db.query(wilayahQuery, [idUser]);
        req.user.wilayah = wilayah[0];
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(403).json({ message: 'Token invalid' });
    }
}

module.exports = {
    authenticateToken,
};
