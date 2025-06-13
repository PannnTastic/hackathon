function getErrorMessage(sqlState) {
    const errorMap = {
        '45001': 'Akses ditolak: Anda tidak memiliki kewenangan untuk aksi ini.',
        '45002': 'Akses ditolak: Akun Anda sedang tidak aktif.',
        '45010': 'Gagal: Email sudah terdaftar dan digunakan oleh akun aktif.',
        '45011': 'Gagal: Peran pengguna yang dimasukkan tidak valid.',
        '45012': 'Aksi gagal: Anda tidak dapat melakukan ini pada akun Anda sendiri.',
        '45020': 'Gagal: Nama TPS sudah ada dan aktif di kelurahan yang sama.',
        '45021': 'Gagal: Data yang Anda tuju tidak dapat ditemukan.',
        '45030': 'Gagal: NIK sudah terdaftar dan digunakan oleh pemilih aktif.',
        '45031': 'Gagal: Petugas yang dipilih untuk ditugaskan tidak valid atau bukan Petugas TPS.',
        '45032': 'Gagal: Anda hanya bisa menugaskan pemilih ke petugas di TPS Anda sendiri.',
        '45033': 'Akses ditolak: Petugas TPS hanya diizinkan untuk mengubah foto.',
        '45034': 'Akses ditolak: Petugas TPS tidak memiliki kewenangan untuk menghapus/mengarsipkan data pemilih.',
        '45040': 'Gagal: Pemilih ini sudah tercatat kehadirannya.',
        '45041': 'Gagal: Anda hanya bisa mencatat kehadiran untuk pemilih di TPS Anda.'
    };
    return errorMap[sqlState] || 'Terjadi kesalahan tak terduga pada database.';
}

function getStatusCode(sqlState) {
    const stateMap = {
        '45001': 403, // Forbidden
        '45002': 403, // Forbidden
        '45010': 409, // Conflict
        '45011': 400, // Bad Request
        '45012': 403, // Forbidden
        '45020': 409, // Conflict
        '45021': 404, // Not Found
        '45030': 409, // Conflict
        '45031': 400, // Bad Request
        '45032': 403, // Forbidden
        '45033': 403, // Forbidden
        '45034': 403, // Forbidden
        '45040': 409, // Conflict
        '45041': 403, // Forbidden
    };
    return stateMap[sqlState] || 500; // Internal Server Error
}

function handleDbError(error) {
    const sqlState = error.sqlState || '45000';
    console.error(`Database Error: SQLSTATE=${sqlState}, Message=${error.message}`);
    
    const message = getErrorMessage(sqlState);
    const statusCode = getStatusCode(sqlState);

    return { statusCode, message };
}

module.exports = handleDbError;