const db = require('../helper/connectionDB');
const handleDbError = require('../helper/dbErrorHandler');

exports.getDashboardSummary = async (req, res) => {
    try {
        const { idProvince, idCity, idDistrict, idSubDistrict, idTps } = req.query;

        const query = 'CALL sp_dashboard_get_summary(?, ?, ?, ?, ?)';
        const [results] = await db.execute(query, [
            idProvince || null,
            idCity || null,
            idDistrict || null, 
            idSubDistrict || null,
            idTps || null
        ]);

        const dashboardData = {
            voteSubmission: results[0][0] || { tps_masuk: 0, tps_total: 0 },
            voterTurnout: results[1][0] || { pemilih_hadir: 0, total_dpt: 0 },
            dptDemographics: results[2],
            attendedDemographics: results[3],
            electionRecapTable: results[4],
            userReportTable: results[5]
        };

        res.status(200).json(dashboardData);

    } catch (error) {
        const { statusCode, message } = handleDbError(error);
        return res.status(statusCode).json({ message });
    }
};