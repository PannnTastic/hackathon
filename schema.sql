-- Table for admin accounts
CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    role ENUM('nasional', 'provinsi', 'kabupaten', 'kelurahan') NOT NULL
);

-- Table for TPS officers
CREATE TABLE petugas (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    role ENUM('pendataan', 'penghitungan') NOT NULL,
    tps_id INT REFERENCES tps(id)
);

-- Table for voters
CREATE TABLE pemilih (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin ENUM('L', 'P') NOT NULL,
    foto BYTEA,
    tps_id INT REFERENCES tps(id)
);

-- Table for TPS details
CREATE TABLE tps (
    id SERIAL PRIMARY KEY,
    provinsi VARCHAR(100) NOT NULL,
    kabupaten VARCHAR(100) NOT NULL,
    kelurahan VARCHAR(100) NOT NULL,
    no_tps INT NOT NULL
);

-- Table for vote counts
CREATE TABLE suara (
    id SERIAL PRIMARY KEY,
    suara_sah INT NOT NULL,
    suara_tidak_sah INT NOT NULL,
    golput INT NOT NULL,
    tps_id INT REFERENCES tps(id)
);

-- Table for reports
CREATE TABLE laporan (
    id SERIAL PRIMARY KEY,
    tps_id INT REFERENCES tps(id),
    deskripsi TEXT NOT NULL,
    status ENUM('menunggu', 'direview', 'ditolak') DEFAULT 'menunggu'
);
