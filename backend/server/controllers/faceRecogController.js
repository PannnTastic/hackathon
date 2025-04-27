const faceRecognitionService = require('../services/faceRecognitionService');

const absensi = async (req, res) => {
    try {
        const { tps_id, foto } = req.body; // Assuming photo is sent as base64 or binary
        const result = await faceRecognitionService.verifyAttendance(tps_id, foto);

        if (result.success) {
            res.status(200).json({ message: 'Absensi berhasil.', data: result.data });
        } else {
            res.status(400).json({ message: 'Absensi gagal.', error: result.error });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error during face recognition.', error });
    }
};

module.exports = {
    absensi, 
};
