// middleware/checkRole.js

// Define allowed roles per context/controller
const allowedRoles = {
    adminController: {
        create: {
            national: ['province', 'city', 'district', 'sub_district', 'adminTps', 'officerTps'],
            province: ['city', 'district', 'sub_district', 'adminTps', 'officerTps'],
            city: ['district', 'sub_district', 'adminTps', 'officerTps'],
            district: ['sub_district', 'adminTps', 'officerTps'],
            sub_district: ['adminTps', 'officerTps'],
        },
        updateOrDelete: {
            national: ['province', 'city', 'district', 'sub_district', 'adminTps', 'officerTps'],
            province: ['city', 'district', 'sub_district', 'adminTps', 'officerTps'],
            city: ['district', 'sub_district', 'adminTps', 'officerTps'],
            district: ['sub_district', 'adminTps', 'officerTps'],
            sub_district: ['adminTps', 'officerTps'],
        }
    },

    c6: {
        create: ['officerTps'],
        update: ['national'],
    },

    voters: {
        create: ['adminTps'],
        updateOrDelete: ['adminTps'],
    },
};

const authorizeC = (context) => {
    return (req, res, next) => {
        const { role: userRole } = req.user;
        const { role: targetRole } = req.body;

        const allowed = allowedRoles?.[context]?.create;

        if (!allowed) {
            console.error(`Invalid context: ${context}`);
            return res.status(500).json({ message: `Invalid context: ${context}` });
        }

        if (Array.isArray(allowed)) {
            if (!allowed.includes(userRole)) {
                return res.status(403).json({
                    status: 403,
                    message: `${userRole} cannot perform CREATE on ${context}`,
                });
            }
        } else {
            if (!allowed[userRole]?.includes(targetRole)) {
                return res.status(403).json({
                    status: 403,
                    message: `${userRole} cannot CREATE ${targetRole}`,
                });
            }
        }

        next();
    };
};

const authorizeUD = (context) => {
    return async (req, res, next) => {
        const { regionCodeTarget } = req.params;
        const { role: region, idTps, idSubDistrict, idDistrict, idCity, idProvince } = req.user;
    
        let regionCode;
        try {
             // Tentukan kode wilayah berdasarkan role
            switch (region) {
                case 'adminTps':
                case 'officerTps':
                    regionCode = idTps;
                    break;
                case 'sub_district':
                    regionCode = idSubDistrict;
                    break;
                case 'district':
                    regionCode = idDistrict;
                    break;
                case 'city':
                    regionCode = idCity;
                    break;
                case 'province':
                    regionCode = idProvince;
                    break;
                case 'national':
                    return next(); // akses penuh
                default:
                    return res.status(403).json({ message: 'Role tidak dikenal atau tidak punya akses wilayah.' });
            }
        
            if (!regionCode || !regionCodeTarget) {
                res.status(400).json({ message: 'Region code atau target tidak lengkap.' });
                return console.log(regionCode, regionCodeTarget);
            }
        
            const regionCodeStr = regionCode.toString();
            const regionCodeTargetStr = regionCodeTarget.toString();
        
            // Validasi hierarki wilayah
            const levelPrefixLength = {
                province: 2,
                city: 4,
                district: 6,
                sub_district: 8,
                adminTps: 10,
                officerTps: 10,
            };
        
            const requiredPrefixLength = levelPrefixLength[region];
        
            if (!requiredPrefixLength) {
                return res.status(403).json({ message: 'Level wilayah tidak dikenali untuk validasi.' });
            }
        
            if (regionCodeTargetStr.substring(0, requiredPrefixLength) !== regionCodeStr.substring(0, requiredPrefixLength)) {
                return res.status(403).json({ message: 'Target region is not under your jurisdiction.' });
            }
            if (Array.isArray(allowed)) {
                if (!allowed.includes(userRole)) {
                    return res.status(403).json({
                        status: 403,
                        message: `${userRole} cannot UPDATE/DELETE in ${context}`,
                    });
                }
            } else {
                if (!allowed[userRole]?.includes(targetRole)) {
                    return res.status(403).json({
                        status: 403,
                        message: `${userRole} cannot modify ${targetRole}`,
                    });
                }
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error checking target role.', error: error.message });
        }
    };
};

module.exports = { authorizeC, authorizeUD };
