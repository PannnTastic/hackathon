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
            adminTps: ['officerTps'],
            officerTps: [],
        },
        updateOrDelete: {
            national: ['province', 'city', 'district', 'sub_district', 'adminTps', 'officerTps'],
            province: ['city', 'district', 'sub_district', 'adminTps', 'officerTps'],
            city: ['district', 'sub_district', 'adminTps', 'officerTps'],
            district: ['sub_district', 'adminTps', 'officerTps'],
            sub_district: ['adminTps', 'officerTps'],
            adminTps: ['officerTps'],
            officerTps: [],
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

module.exports = { authorizeC };
