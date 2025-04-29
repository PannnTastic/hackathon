// middleware/authorizeRole.js
const allowedRoles = {
    national: ['province', 'city', 'district', 'sub_district', 'adminTps', 'officerTps'],
    province: ['city', 'district', 'sub_district', 'adminTps', 'officerTps'],
    city: ['district', 'sub_district', 'adminTps', 'officerTps'],
    district: ['sub_district', 'adminTps', 'officerTps'],
    sub_district: ['adminTps', 'officerTps'],
};

// Middleware untuk authorize CREATE
const authorizeCreateRole = (req, res, next) => {
    const { role: userRole } = req.user;
    const { role: targetRole } = req.body; // Role yang ingin dibuat

    if (!allowedRoles[userRole]?.includes(targetRole)) {
        return res.status(403).json({
            status: 403,
            message: `Access denied. ${userRole} can only create: ${allowedRoles[userRole]?.join(', ') || 'none'}`,
        });
    }
    next();
};

// Middleware untuk authorize UPDATE/DELETE
const authorizeTargetRole = (getRoleFromDB) => {
    return async (req, res, next) => {
        const { idUser } = req.params;
        const { role: userRole } = req.user;

        try {
            const targetUser = await getRoleFromDB(idUser);
            if (!targetUser) {
                return res.status(404).json({ message: 'Target user not found.' });
            }

            const targetRole = targetUser.role;

            if (!allowedRoles[userRole]?.includes(targetRole)) {
                return res.status(403).json({
                    status: 403,
                    message: `Access denied. ${userRole} cannot modify ${targetRole}`,
                });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error checking target role.', error: error.message });
        }
    };
};

module.exports = { authorizeCreateRole, authorizeTargetRole };
