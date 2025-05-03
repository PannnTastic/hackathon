CREATE DATABASE hackenton;
USE hackenton;

-- drop database hackenton;

-- Table Wilayah Indonesia
CREATE TABLE provinceData(
	idProvince BIGINT PRIMARY KEY,
	name VARCHAR(100),
    INDEX idx_province_name (name)
);

CREATE TABLE cityData(
	idCity BIGINT PRIMARY KEY,
	name VARCHAR(100),
	idProvince BIGINT,
	FOREIGN KEY (idProvince) REFERENCES provinceData(idProvince) ON DELETE CASCADE,
    INDEX idx_city_name (name),
    INDEX idx_city_idProvince (idProvince)
);

CREATE TABLE districtData(
	idDistrict BIGINT PRIMARY KEY,
	name VARCHAR(100),
	idCity BIGINT,
	FOREIGN KEY (idCity) REFERENCES cityData(idCity) ON DELETE CASCADE,
    INDEX idx_district_name (name),
    INDEX idx_district_idCity (idCity)
);

CREATE TABLE subDistrictData(
	idSubDistrict BIGINT PRIMARY KEY,
	name VARCHAR(100),
	idDistrict BIGINT,
	FOREIGN KEY (idDistrict) REFERENCES districtData(idDistrict) ON DELETE CASCADE,
    INDEX idx_subDistrict_name (name),
    INDEX idx_subDistrict_idDistrict (idDistrict)
);

-- Table TPS
CREATE TABLE tpsData(
	idTps BIGINT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(155),
	idSubDistrict BIGINT,
	FOREIGN KEY (idSubDistrict) REFERENCES subDistrictData(idSubDistrict) ON DELETE CASCADE,
    INDEX idx_tps_idSubDistrict (idSubDistrict),
    INDEX idx_tps_name (name)
);

-- Table User (Login)
CREATE TABLE users(
    idUser INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('national', 'province', 'district', 'sub_district', 'city', 'officerTps', 'adminTps') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_role (role),
    INDEX idx_users_created_at (created_at)
);

-- Detail user tables
CREATE TABLE nationalUsersDetail (
    idData INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE,
    INDEX idx_national_name (name),
    INDEX idx_national_idUser (idUser)
);

CREATE TABLE provinceUsersDetail (
    idData INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    idProvince BIGINT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE,
    FOREIGN KEY (idProvince) REFERENCES provinceData(idProvince) ON DELETE CASCADE,
    INDEX idx_provinceUser_name (name),
    INDEX idx_provinceUser_idProvince (idProvince)
);

CREATE TABLE cityUsersDetail (
    idData INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    idCity BIGINT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE,
    FOREIGN KEY (idCity) REFERENCES cityData(idCity) ON DELETE CASCADE,
    INDEX idx_cityUser_name (name),
    INDEX idx_cityUser_idCity (idCity)
);

CREATE TABLE districtUsersDetail (
    idData INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    idDistrict BIGINT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE,
    FOREIGN KEY (idDistrict) REFERENCES districtData(idDistrict) ON DELETE CASCADE,
    INDEX idx_districtUser_name (name),
    INDEX idx_districtUser_idDistrict (idDistrict)
);

CREATE TABLE subDistrictUsersDetail (
	idData INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    idSubDistrict BIGINT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE,
    FOREIGN KEY (idSubDistrict) REFERENCES subDistrictData(idSubDistrict) ON DELETE CASCADE,
    INDEX idx_subDistrictUser_name (name),
    INDEX idx_subDistrictUser_idSubDistrict (idSubDistrict)
);

CREATE TABLE adminTpsUserDetail(
	idData INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    idTps BIGINT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE,
	FOREIGN KEY (idTps) REFERENCES tpsData(idTps) ON DELETE CASCADE,
    INDEX idx_adminTpsUser_idTps (idTps),
    INDEX idx_adminTpsUser_name (name)
);

CREATE TABLE officerTpsUserDetail(
	idData INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    idTps BIGINT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(idUser) ON DELETE CASCADE,
	FOREIGN KEY (idTps) REFERENCES tpsData(idTps) ON DELETE CASCADE,
    INDEX idx_officerTpsUser_idTps (idTps),
    INDEX idx_officerTpsUser_name (name)
);

-- Table Pemilih
CREATE TABLE voterData(
	idData INT AUTO_INCREMENT PRIMARY KEY,
	nik VARCHAR(16) UNIQUE NOT NULL,
	name VARCHAR(255) NOT NULL,
    dateOfBirth DATE NOT NULL,
	gender TINYINT NOT NULL,
    idAdmin INT NOT NULL,
    locationPhoto VARCHAR(255),
	FOREIGN KEY (idAdmin) REFERENCES adminTpsUserDetail(idData) ON DELETE CASCADE,
    INDEX idx_voter_name (name),
    INDEX idx_voter_idAdmin (idAdmin),
    INDEX idx_voter_dateOfBirth (dateOfBirth)
);

-- Table Suara
CREATE TABLE electionData(
	idData INT AUTO_INCREMENT PRIMARY KEY,
	countTotal INT,
	countValid INT,
	countInvalid INT,
	countAbstain INT,
    locationPhoto VARCHAR(255) NOT NULL,
    idOfficer INT NOT NULL,
	FOREIGN KEY (idOfficer) REFERENCES officerTpsUserDetail(idData) ON DELETE CASCADE,
    INDEX idx_election_idOfficer (idOfficer)
);

-- Table Laporan
CREATE TABLE reportData(
	idData INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255),
    description TEXT,
    idOfficer INT,
    status ENUM('approve', 'reject'),
	FOREIGN KEY (idOfficer) REFERENCES officerTpsUserDetail(idData) ON DELETE CASCADE,
    INDEX idx_report_idOfficer (idOfficer),
    INDEX idx_report_status (status)
);
