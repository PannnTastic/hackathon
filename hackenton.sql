create database hackenton;
-- drop database hackenton;
use hackenton;
-- Table Wilayah Indonesia
CREATE TABLE provinceData(
	idProvince INT PRIMARY KEY,
	name VARCHAR(100)
);

CREATE TABLE cityData(
	idCity INT PRIMARY KEY,
	name VARCHAR(100),
	idProvince INT,
	FOREIGN KEY (idProvince) REFERENCES provinceData(idProvince) ON DELETE CASCADE
);

CREATE TABLE districtData(
	idDistrict INT PRIMARY KEY,
	name VARCHAR(100),
	idCity INT,
	FOREIGN KEY (idCity) REFERENCES cityData(idCity) ON DELETE CASCADE
);

CREATE TABLE subDistrictData(
	idSubDistrict INT PRIMARY KEY,
	name VARCHAR(100),
	idDistrict INT,
	FOREIGN KEY (idDistrict) REFERENCES districtData(idDistrict) ON DELETE CASCADE
);
-- Table TPS
CREATE TABLE tpsData(
	idTps INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(155),
	idSubDistrict INT,
	FOREIGN KEY (idSubDistrict) REFERENCES subDistrictData(idSubDistrict) ON DELETE CASCADE
);
-- Table User (Login)
CREATE TABLE users(
    idUser INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('national', 'province', 'district', 'sub_district', 'village', 'officerTps', 'adminTps') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nationalUsersDetail (
    idData INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE
);

CREATE TABLE provinceUsersDetail (
    idData INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    idProvince INT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE,
    FOREIGN KEY (idProvince) REFERENCES provinceData(idProvince) ON DELETE CASCADE
);

CREATE TABLE cityUsersDetail (
    idData INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    idCity INT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE,
    FOREIGN KEY (idCity) REFERENCES cityData(idCity) ON DELETE CASCADE
);

CREATE TABLE districtUsersDetail (
    idData INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    idDistrict INT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE,
    FOREIGN KEY (idDistrict) REFERENCES districtData(idDistrict) ON DELETE CASCADE
);

CREATE TABLE subDistrictUsersDetail (
	idData INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    idSubDistrict INT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE,
    FOREIGN KEY (idSubDistrict) REFERENCES subDistrictData(idSubDistrict) ON DELETE CASCADE
);

CREATE TABLE adminTpsUserDetail(
	idData INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT UNIQUE NOT NULL,
    name VARCHAR (255) NOT NULL,
    idTps INT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE,
	FOREIGN KEY (idTps) REFERENCES tpsData(idTps) ON DELETE CASCADE
);

CREATE TABLE officerTpsUserDetail(
	idData INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT UNIQUE NOT NULL,
    name VARCHAR (255) NOT NULL,
    idTps INT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE,
	FOREIGN KEY (idTps) REFERENCES tpsData(idTps) ON DELETE CASCADE
);
-- Table Pemilih
CREATE TABLE voterData(
	idData INT AUTO_INCREMENT PRIMARY KEY,
	nik VARCHAR(16) UNIQUE NOT NULL,
	name VARCHAR(255) NOT NULL,
    dateOfBirth date NOT NULL,
	gender tinyint NOT NULL,
    idOfficer INT NOT NULL,
    locationPhoto VARCHAR(255),
	FOREIGN KEY (idOfficer) REFERENCES officerTpsUserDetail(idData) ON DELETE CASCADE
);
-- Table Suara
CREATE TABLE electionData(
	idData INT AUTO_INCREMENT PRIMARY KEY,
	countTotal INT,
	countValid INT,
	countInvalid INT,
	countAbstain INT,
    locationPhoto VARCHAR(255) NOT NULL,
    idAdmin INT NOT NULL,
	FOREIGN KEY (idAdmin) REFERENCES adminTpsUserDetail(idData) ON DELETE CASCADE
);
-- Table Laporan
CREATE TABLE reportData(
	idData INT AUTO_INCREMENT PRIMARY KEY,
    idElection INT NOT NULL,
    subject varchar(255),
    description TEXT,
    idAdmin INT,
    status enum('approve', 'reject'),
	FOREIGN KEY (idElection) REFERENCES electionData(idData) ON DELETE CASCADE,
	FOREIGN KEY (idAdmin) REFERENCES adminTpsUserDetail(idData) ON DELETE CASCADE
);





