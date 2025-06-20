function getErrorMessage(sqlState) {
    const errorMap = {
        '45001': 'Akses ditolak: Anda tidak memiliki kewenangan untuk aksi ini.',
        '45002': 'Akses ditolak: Akun Anda sedang tidak aktif.',
        '45010': 'Gagal: Email sudah terdaftar dan digunakan oleh akun aktif.',
        '45011': 'Gagal: Peran pengguna yang dimasukkan tidak valid.',
        '45012': 'Aksi gagal: Anda tidak dapat melakukan aksi ini pada akun Anda sendiri.',
        '45013': 'Gagal: ID Wilayah atau TPS untuk penugasan tidak ditemukan.',
        '45014': 'Gagal: Anda tidak dapat membuat pengguna dengan peran yang sama atau lebih tinggi dari Anda.',
        '45020': 'Gagal: Nama TPS sudah ada dan aktif di kelurahan yang sama.',
        '45021': 'Gagal: Data yang Anda tuju tidak dapat ditemukan.',
        '45030': 'Gagal: NIK sudah terdaftar dan digunakan oleh pemilih aktif.',
        '45031': 'Gagal: Petugas yang dipilih untuk ditugaskan tidak valid atau bukan Petugas TPS.',
        '45032': 'Gagal: Anda hanya bisa menugaskan pemilih ke petugas di TPS Anda sendiri.',
        '45033': 'Akses ditolak: Petugas TPS hanya diizinkan untuk mengubah foto.',
        '45034': 'Akses ditolak: Petugas TPS tidak memiliki kewenangan untuk menghapus data pemilih.',
        '45040': 'Gagal: Pemilih ini sudah tercatat kehadirannya.',
        '45041': 'Gagal: Anda hanya bisa mencatat kehadiran untuk pemilih di TPS Anda.',
        '45050': 'Gagal: Laporan rekapitulasi untuk TPS ini sudah pernah dikirim.',
        '45051': 'Gagal: Tidak dapat membuat laporan untuk data pemilu yang sudah diarsipkan.'
    };
    return errorMap[sqlState] || 'Terjadi kesalahan tak terduga pada database.';
}

function getStatusCode(sqlState) {
    const stateMap = {
        '45001': 403,
        '45002': 403,
        '45010': 409,
        '45011': 400,
        '45012': 403,
        '45013': 400,
        '45014': 403,
        '45020': 409,
        '45021': 404,
        '45030': 409,
        '45031': 400,
        '45032': 403,
        '45033': 403,
        '45034': 403,
        '45040': 409,
        '45041': 403,
        '45050': 409,
        '45051': 400
    };
    return stateMap[sqlState] || 500;
}

function handleDbError(error) {
    const sqlState = error.sqlState || '45000';
    console.error(`Database Error: SQLSTATE=${sqlState}, Message=${error.message}`);
    
    const message = getErrorMessage(sqlState);
    const statusCode = getStatusCode(sqlState);

    return { statusCode, message };
}

module.exports = handleDbError;