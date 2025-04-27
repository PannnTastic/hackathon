const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

const authorize = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
};

// Middleware for specific roles
const isNasional = (req, res, next) => {
    if (req.user.role !== 'nasional') {
        return res.status(403).json({ message: 'Access denied. Only for nasional role.' });
    }
    next();
};

const isProvinsi = (req, res, next) => {
    if (req.user.role !== 'provinsi') {
        return res.status(403).json({ message: 'Access denied. Only for provinsi role.' });
    }
    next();
};

const isKabupaten = (req, res, next) => {
    if (req.user.role !== 'kabupaten') {
        return res.status(403).json({ message: 'Access denied. Only for kabupaten role.' });
    }
    next();
};

const isKecamatan = (req, res, next) => {
    if (req.user.role !== 'kecamatan') {
        return res.status(403).json({ message: 'Access denied. Only for kecamatan role.' });
    }
    next();
};

const isKelurahan = (req, res, next) => {
    if (req.user.role !== 'kelurahan') {
        return res.status(403).json({ message: 'Access denied. Only for kelurahan role.' });
    }
    next();
};

const isPendataan = (req, res, next) => {
    if (req.user.role !== 'pendataan') {
        return res.status(403).json({ message: 'Access denied. Only for pendataan role.' });
    }
    next();
};

const isPenghitungan = (req, res, next) => {
    if (req.user.role !== 'penghitungan') {
        return res.status(403).json({ message: 'Access denied. Only for penghitungan role.' });
    }
    next();
};

module.exports = {
    authenticate,
    authorize,
    isNasional,
    isProvinsi,
    isKabupaten,
    isKecamatan,
    isKelurahan,
    isPendataan,
    isPenghitungan,
};
