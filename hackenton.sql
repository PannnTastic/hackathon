-- MySQL dump 10.13  Distrib 9.2.0, for macos15 (arm64)
--
-- Host: localhost    Database: hackenton
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admintpsuserdetail`
--

DROP TABLE IF EXISTS `admintpsuserdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admintpsuserdetail` (
  `idData` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `idTps` bigint NOT NULL,
  PRIMARY KEY (`idData`),
  UNIQUE KEY `idUser` (`idUser`),
  KEY `idx_adminTpsUser_idTps` (`idTps`),
  CONSTRAINT `admintpsuserdetail_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE,
  CONSTRAINT `admintpsuserdetail_ibfk_2` FOREIGN KEY (`idTps`) REFERENCES `tpsdata` (`idTps`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `citydata`
--

DROP TABLE IF EXISTS `citydata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citydata` (
  `idCity` bigint NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `idProvince` bigint DEFAULT NULL,
  PRIMARY KEY (`idCity`),
  KEY `idx_city_name` (`name`),
  KEY `idx_city_idProvince` (`idProvince`),
  CONSTRAINT `citydata_ibfk_1` FOREIGN KEY (`idProvince`) REFERENCES `provincedata` (`idProvince`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cityusersdetail`
--

DROP TABLE IF EXISTS `cityusersdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cityusersdetail` (
  `idData` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `idCity` bigint NOT NULL,
  PRIMARY KEY (`idData`),
  UNIQUE KEY `idUser` (`idUser`),
  KEY `idx_cityUser_idCity` (`idCity`),
  CONSTRAINT `cityusersdetail_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE,
  CONSTRAINT `cityusersdetail_ibfk_2` FOREIGN KEY (`idCity`) REFERENCES `citydata` (`idCity`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `districtdata`
--

DROP TABLE IF EXISTS `districtdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `districtdata` (
  `idDistrict` bigint NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `idCity` bigint DEFAULT NULL,
  PRIMARY KEY (`idDistrict`),
  KEY `idx_district_name` (`name`),
  KEY `idx_district_idCity` (`idCity`),
  CONSTRAINT `districtdata_ibfk_1` FOREIGN KEY (`idCity`) REFERENCES `citydata` (`idCity`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `districtusersdetail`
--

DROP TABLE IF EXISTS `districtusersdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `districtusersdetail` (
  `idData` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `idDistrict` bigint NOT NULL,
  PRIMARY KEY (`idData`),
  UNIQUE KEY `idUser` (`idUser`),
  KEY `idx_districtUser_idDistrict` (`idDistrict`),
  CONSTRAINT `districtusersdetail_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE,
  CONSTRAINT `districtusersdetail_ibfk_2` FOREIGN KEY (`idDistrict`) REFERENCES `districtdata` (`idDistrict`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `electiondata`
--

DROP TABLE IF EXISTS `electiondata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `electiondata` (
  `idData` int NOT NULL AUTO_INCREMENT,
  `countTotal` int DEFAULT NULL,
  `countValid` int DEFAULT NULL,
  `countInvalid` int DEFAULT NULL,
  `countAbstain` int DEFAULT NULL,
  `locationPhoto` varchar(255) NOT NULL,
  `idAdmin` int NOT NULL,
  PRIMARY KEY (`idData`),
  KEY `idx_election_idAdmin` (`idAdmin`),
  CONSTRAINT `electiondata_ibfk_1` FOREIGN KEY (`idAdmin`) REFERENCES `admintpsuserdetail` (`idData`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nationalusersdetail`
--

DROP TABLE IF EXISTS `nationalusersdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nationalusersdetail` (
  `idData` int NOT NULL AUTO_INCREMENT,
  `idUser` int DEFAULT NULL,
  PRIMARY KEY (`idData`),
  KEY `idx_national_idUser` (`idUser`),
  CONSTRAINT `nationalusersdetail_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `officertpsuserdetail`
--

DROP TABLE IF EXISTS `officertpsuserdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `officertpsuserdetail` (
  `idData` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `idTps` bigint NOT NULL,
  PRIMARY KEY (`idData`),
  UNIQUE KEY `idUser` (`idUser`),
  KEY `idx_officerTpsUser_idTps` (`idTps`),
  CONSTRAINT `officertpsuserdetail_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE,
  CONSTRAINT `officertpsuserdetail_ibfk_2` FOREIGN KEY (`idTps`) REFERENCES `tpsdata` (`idTps`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `provincedata`
--

DROP TABLE IF EXISTS `provincedata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provincedata` (
  `idProvince` bigint NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idProvince`),
  KEY `idx_province_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `provinceusersdetail`
--

DROP TABLE IF EXISTS `provinceusersdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provinceusersdetail` (
  `idData` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `idProvince` bigint NOT NULL,
  PRIMARY KEY (`idData`),
  UNIQUE KEY `idUser` (`idUser`),
  KEY `idx_provinceUser_idProvince` (`idProvince`),
  CONSTRAINT `provinceusersdetail_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE,
  CONSTRAINT `provinceusersdetail_ibfk_2` FOREIGN KEY (`idProvince`) REFERENCES `provincedata` (`idProvince`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reportdata`
--

DROP TABLE IF EXISTS `reportdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reportdata` (
  `idData` int NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) DEFAULT NULL,
  `description` text,
  `idAdmin` int DEFAULT NULL,
  `status` enum('approve','reject') DEFAULT NULL,
  PRIMARY KEY (`idData`),
  KEY `idx_report_idAdmin` (`idAdmin`),
  KEY `idx_report_status` (`status`),
  CONSTRAINT `reportdata_ibfk_1` FOREIGN KEY (`idAdmin`) REFERENCES `admintpsuserdetail` (`idData`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subdistrictdata`
--

DROP TABLE IF EXISTS `subdistrictdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subdistrictdata` (
  `idSubDistrict` bigint NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `idDistrict` bigint DEFAULT NULL,
  PRIMARY KEY (`idSubDistrict`),
  KEY `idx_subDistrict_name` (`name`),
  KEY `idx_subDistrict_idDistrict` (`idDistrict`),
  CONSTRAINT `subdistrictdata_ibfk_1` FOREIGN KEY (`idDistrict`) REFERENCES `districtdata` (`idDistrict`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subdistrictusersdetail`
--

DROP TABLE IF EXISTS `subdistrictusersdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subdistrictusersdetail` (
  `idData` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `idSubDistrict` bigint NOT NULL,
  PRIMARY KEY (`idData`),
  UNIQUE KEY `idUser` (`idUser`),
  KEY `idx_subDistrictUser_idSubDistrict` (`idSubDistrict`),
  CONSTRAINT `subdistrictusersdetail_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE,
  CONSTRAINT `subdistrictusersdetail_ibfk_2` FOREIGN KEY (`idSubDistrict`) REFERENCES `subdistrictdata` (`idSubDistrict`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tpsdata`
--

DROP TABLE IF EXISTS `tpsdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tpsdata` (
  `idTps` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(155) DEFAULT NULL,
  `idSubDistrict` bigint DEFAULT NULL,
  `status` enum('active','deleted') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`idTps`),
  KEY `idx_tps_idSubDistrict` (`idSubDistrict`),
  KEY `idx_tps_name` (`name`),
  KEY `idx_tps_status` (`status`),
  CONSTRAINT `tpsdata_ibfk_1` FOREIGN KEY (`idSubDistrict`) REFERENCES `subdistrictdata` (`idSubDistrict`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `idUser` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('national','province','district','sub_district','city','officerTps','adminTps') NOT NULL,
  `status` enum('active','inactive','pending') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_created_at` (`created_at`),
  KEY `idx_users_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `voterdata`
--

DROP TABLE IF EXISTS `voterdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voterdata` (
  `idData` int NOT NULL AUTO_INCREMENT,
  `nik` varchar(16) NOT NULL,
  `name` varchar(255) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `gender` tinyint NOT NULL,
  `idOfficer` int NOT NULL,
  `locationPhoto` varchar(255) DEFAULT NULL,
  `status` enum('active','deleted') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`idData`),
  UNIQUE KEY `nik` (`nik`),
  KEY `idx_voter_name` (`name`),
  KEY `idx_voter_idOfficer` (`idOfficer`),
  KEY `idx_voter_dateOfBirth` (`dateOfBirth`),
  KEY `idx_voter_status` (`status`),
  CONSTRAINT `voterdata_ibfk_1` FOREIGN KEY (`idOfficer`) REFERENCES `officertpsuserdetail` (`idData`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `vw_admin_users`
--

DROP TABLE IF EXISTS `vw_admin_users`;
/*!50001 DROP VIEW IF EXISTS `vw_admin_users`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_admin_users` AS SELECT 
 1 AS `idUser`,
 1 AS `name`,
 1 AS `email`,
 1 AS `role`,
 1 AS `status`,
 1 AS `idProvince`,
 1 AS `provinceName`,
 1 AS `idCity`,
 1 AS `cityName`,
 1 AS `idDistrict`,
 1 AS `districtName`,
 1 AS `idSubDistrict`,
 1 AS `subDistrictName`,
 1 AS `idTps`,
 1 AS `tpsName`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_tps_details`
--

DROP TABLE IF EXISTS `vw_tps_details`;
/*!50001 DROP VIEW IF EXISTS `vw_tps_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_tps_details` AS SELECT 
 1 AS `idTps`,
 1 AS `name`,
 1 AS `status`,
 1 AS `idSubDistrict`,
 1 AS `subDistrictName`,
 1 AS `idDistrict`,
 1 AS `districtName`,
 1 AS `idCity`,
 1 AS `cityName`,
 1 AS `idProvince`,
 1 AS `provinceName`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_voter_details`
--

DROP TABLE IF EXISTS `vw_voter_details`;
/*!50001 DROP VIEW IF EXISTS `vw_voter_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_voter_details` AS SELECT 
 1 AS `idData`,
 1 AS `nik`,
 1 AS `name`,
 1 AS `status`,
 1 AS `dateOfBirth`,
 1 AS `gender`,
 1 AS `locationPhoto`,
 1 AS `idOfficer`,
 1 AS `officerName`,
 1 AS `idTps`,
 1 AS `tpsName`,
 1 AS `idSubDistrict`,
 1 AS `subDistrictName`,
 1 AS `idDistrict`,
 1 AS `districtName`,
 1 AS `idCity`,
 1 AS `cityName`,
 1 AS `idProvince`,
 1 AS `provinceName`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'hackenton'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_auth_login` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_auth_login`(IN p_email VARCHAR(100), IN p_password VARCHAR(255))
BEGIN
    DECLARE v_idUser INT;
    
    SELECT idUser INTO v_idUser FROM users
    WHERE email = p_email 
      AND password = SHA2(p_password, 256)
      -- PERUBAHAN: Hanya user aktif yang bisa login
      AND status = 'active'
    LIMIT 1;

    IF v_idUser IS NOT NULL THEN
        -- View vw_admin_users sudah otomatis memfilter, jadi ini aman
        SELECT * FROM vw_admin_users WHERE idUser = v_idUser;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tps_archive` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tps_archive`(IN p_actor_idUser INT, IN p_idTps BIGINT)
BEGIN
    DECLARE v_idSubDistrict BIGINT;
    SELECT idSubDistrict INTO v_idSubDistrict FROM tpsdata WHERE idTps = p_idTps;

    IF v_idSubDistrict IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Data TPS tidak ditemukan.';
    END IF;

    CALL sp_validateUser(p_actor_idUser, v_idSubDistrict, 'sub_district');
    
    -- PERUBAHAN: Ganti DELETE dengan UPDATE status menjadi 'deleted'
    UPDATE tpsdata SET status = 'deleted' WHERE idTps = p_idTps;

    -- DITAMBAHKAN: Nonaktifkan juga akun Admin/Petugas TPS yang terikat
    UPDATE users u
    JOIN (SELECT idUser FROM admintpsuserdetail WHERE idTps = p_idTps UNION SELECT idUser FROM officertpsuserdetail WHERE idTps = p_idTps) AS tps_users
    ON u.idUser = tps_users.idUser
    SET u.status = 'inactive';
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tps_create` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tps_create`(
    -- Parameter Input
    IN p_actor_idUser INT,
    IN p_name VARCHAR(155),
    IN p_idSubDistrict BIGINT,

    -- Parameter Output
    OUT p_new_idTps BIGINT,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_duplicate_count INT DEFAULT 0;

    -- Inisialisasi output
    SET p_new_idTps = NULL;

    -- == LANGKAH 1: Panggil Validator Terpusat ==
    -- SP ini akan melempar error dan menghentikan proses jika user tidak punya hak.
    -- Target datanya adalah Kelurahan (idSubDistrict), maka levelnya 'sub_district'.
    CALL sp_validateUser(p_actor_idUser, p_idSubDistrict, 'sub_district');
    
    -- Jika kode berlanjut ke sini, artinya user MEMILIKI HAK AKSES.

    -- == LANGKAH 2: Lanjutkan Logika Spesifik untuk Pembuatan TPS ==
    -- Cek duplikasi nama TPS di kelurahan yang sama
    SELECT COUNT(*)
    INTO v_duplicate_count
    FROM tpsdata
    WHERE name = p_name AND idSubDistrict = p_idSubDistrict;

    IF v_duplicate_count = 0 THEN
        -- Jika tidak ada duplikat, buat TPS baru
        INSERT INTO tpsdata(name, idSubDistrict)
        VALUES (p_name, p_idSubDistrict);

        SET p_new_idTps = LAST_INSERT_ID();
        SET p_message = 'TPS berhasil dibuat.';
    ELSE
        -- Jika ada duplikat
        SET p_message = 'Error: Nama TPS sudah ada di kelurahan ini.';
    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tps_read` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tps_read`(
    IN p_actor_idUser INT,
    -- Parameter Filter Opsional
    IN p_filter_name VARCHAR(255),
    IN p_filter_idSubDistrict BIGINT,
    IN p_filter_idDistrict BIGINT,
    IN p_filter_idCity BIGINT,
    IN p_filter_idProvince BIGINT,
    -- Parameter Paginasi
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    DECLARE v_actor_role VARCHAR(50);
    DECLARE v_actor_idProvince BIGINT;
    DECLARE v_actor_idCity BIGINT;
    DECLARE v_actor_idDistrict BIGINT;
    DECLARE v_actor_idSubDistrict BIGINT;
    DECLARE v_actor_idTps BIGINT;

    -- Dapatkan semua informasi kewenangan dari aktor
    SELECT role, idProvince, idCity, idDistrict, idSubDistrict, idTps
    INTO v_actor_role, v_actor_idProvince, v_actor_idCity, v_actor_idDistrict, v_actor_idSubDistrict, v_actor_idTps
    FROM vw_admin_users
    WHERE idUser = p_actor_idUser;

    -- Query utama dari helper view
    SELECT * FROM vw_tps_details
    WHERE
        -- LAPISAN 1: FILTER KEAMANAN HIERARKI (WAJIB)
        (
            v_actor_role = 'national' OR
            (v_actor_role = 'province' AND vw_tps_details.idProvince = v_actor_idProvince) OR
            (v_actor_role = 'city' AND vw_tps_details.idCity = v_actor_idCity) OR
            (v_actor_role = 'district' AND vw_tps_details.idDistrict = v_actor_idDistrict) OR
            (v_actor_role = 'sub_district' AND vw_tps_details.idSubDistrict = v_actor_idSubDistrict) OR
            (v_actor_role IN ('adminTps', 'officerTps') AND vw_tps_details.idTps = v_actor_idTps)
        )
        -- LAPISAN 2: FILTER PENCARIAN (OPSIONAL)
        AND (p_filter_name IS NULL OR vw_tps_details.name LIKE CONCAT('%', p_filter_name, '%'))
        AND (p_filter_idSubDistrict IS NULL OR vw_tps_details.idSubDistrict = p_filter_idSubDistrict)
        AND (p_filter_idDistrict IS NULL OR vw_tps_details.idDistrict = p_filter_idDistrict)
        AND (p_filter_idCity IS NULL OR vw_tps_details.idCity = p_filter_idCity)
        AND (p_filter_idProvince IS NULL OR vw_tps_details.idProvince = p_filter_idProvince)
    LIMIT p_limit OFFSET p_offset;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tps_update` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tps_update`(
    IN p_actor_idUser INT,
    IN p_idTps BIGINT, -- ID TPS yang akan diubah
    -- Parameter baru (biarkan NULL jika tidak ingin diubah)
    IN p_name VARCHAR(155),
    IN p_idSubDistrict BIGINT
)
BEGIN
    DECLARE v_original_idSubDistrict BIGINT;

    -- Ambil lokasi (kelurahan) asli dari TPS yang akan diubah
    SELECT idSubDistrict INTO v_original_idSubDistrict FROM tpsdata WHERE idTps = p_idTps;

    IF v_original_idSubDistrict IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Data TPS tidak ditemukan.';
    END IF;
    
    -- LANGKAH 1: Validasi Otoritas Aktor pada LOKASI ASLI
    -- Apakah pengguna punya hak untuk mengubah TPS di lokasinya saat ini?
    CALL sp_validateUser(p_actor_idUser, v_original_idSubDistrict, 'sub_district');
    
    -- LANGKAH 2: Validasi Otoritas pada LOKASI BARU (jika pindah)
    -- Jika TPS akan dipindahkan, apakah pengguna punya hak di lokasi tujuan?
    IF p_idSubDistrict IS NOT NULL AND p_idSubDistrict != v_original_idSubDistrict THEN
        CALL sp_validateUser(p_actor_idUser, p_idSubDistrict, 'sub_district');
    END IF;

    -- LANGKAH 3: Lakukan UPDATE
    UPDATE tpsdata
    SET
        name = COALESCE(p_name, name),
        idSubDistrict = COALESCE(p_idSubDistrict, idSubDistrict)
    WHERE idTps = p_idTps;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_users_create` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_users_create`(
    IN p_actor_idUser INT,
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_name VARCHAR(255),
    IN p_role ENUM('national','province','district','sub_district','city','officerTps','adminTps'),
    IN p_assignmentId BIGINT
)
BEGIN
    DECLARE v_new_idUser INT;
    DECLARE v_target_level VARCHAR(50); -- Variabel baru untuk menentukan level target

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        -- Mengembalikan pesan error yang lebih spesifik jika memungkinkan
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Gagal membuat pengguna. Periksa kembali data input atau duplikasi email.';
    END;

    -- ==========================================================
    -- LANGKAH 1 (DIPERBAIKI): Tentukan level target yang benar
    -- ==========================================================
    IF p_role = 'province' THEN SET v_target_level = 'province';
    ELSEIF p_role = 'city' THEN SET v_target_level = 'city';
    ELSEIF p_role = 'district' THEN SET v_target_level = 'district';
    ELSEIF p_role = 'sub_district' THEN SET v_target_level = 'sub_district';
    ELSEIF p_role IN ('adminTps', 'officerTps') THEN SET v_target_level = 'tps';
    ELSEIF p_role = 'national' THEN SET v_target_level = 'national';
    END IF;

    -- Validasi apakah Aktor punya wewenang
    IF v_target_level IS NOT NULL THEN
        CALL sp_validateUser(p_actor_idUser, p_assignmentId, v_target_level);
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Peran pengguna tidak valid.';
    END IF;
    

    -- Langkah 2: Mulai Transaction
    START TRANSACTION;

    -- Langkah 3: Insert ke tabel 'users'
    INSERT INTO users (email, password, name, role)
    VALUES (p_email, SHA2(p_password, 256), p_name, p_role);
    SET v_new_idUser = LAST_INSERT_ID();

    -- =========================================================================
    -- LANGKAH 4 (DIPERBAIKI): Insert ke tabel detail TANPA KOLOM 'name'
    -- =========================================================================
    IF p_role = 'province' THEN
        INSERT INTO provinceusersdetail (idUser, idProvince) VALUES (v_new_idUser, p_assignmentId);
    ELSEIF p_role = 'city' THEN
        INSERT INTO cityusersdetail (idUser, idCity) VALUES (v_new_idUser, p_assignmentId);
    ELSEIF p_role = 'district' THEN
        INSERT INTO districtusersdetail (idUser, idDistrict) VALUES (v_new_idUser, p_assignmentId);
    ELSEIF p_role = 'sub_district' THEN
        INSERT INTO subdistrictusersdetail (idUser, idSubDistrict) VALUES (v_new_idUser, p_assignmentId);
    ELSEIF p_role = 'adminTps' THEN
        INSERT INTO admintpsuserdetail (idUser, idTps) VALUES (v_new_idUser, p_assignmentId);
    ELSEIF p_role = 'officerTps' THEN
        INSERT INTO officertpsuserdetail (idUser, idTps) VALUES (v_new_idUser, p_assignmentId);
    ELSEIF p_role = 'national' THEN
        INSERT INTO nationalusersdetail (idUser) VALUES (v_new_idUser);
    END IF;

    -- Langkah 5: Jika semua berhasil, commit transaction
    COMMIT;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_users_disable` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_users_disable`(IN p_actor_idUser INT, IN p_target_idUser INT)
BEGIN
    DECLARE v_target_level VARCHAR(50);
    DECLARE v_target_assignmentId BIGINT;

    IF p_actor_idUser = p_target_idUser THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Anda tidak dapat menonaktifkan akun Anda sendiri.';
    END IF;

    -- Logika validasi tetap sama
    SELECT COALESCE(t.idTps, sd.idSubDistrict, d.idDistrict, c.idCity, p.idProvince, 0),
           COALESCE(CASE WHEN t.idTps IS NOT NULL THEN 'tps' END, CASE WHEN sd.idSubDistrict IS NOT NULL THEN 'sub_district' END, CASE WHEN d.idDistrict IS NOT NULL THEN 'district' END, CASE WHEN c.idCity IS NOT NULL THEN 'city' END, CASE WHEN p.idProvince IS NOT NULL THEN 'province' END, 'national')
    INTO v_target_assignmentId, v_target_level
    FROM users u
    LEFT JOIN nationalusersdetail nud ON u.idUser = nud.idUser LEFT JOIN provinceusersdetail pud ON u.idUser = pud.idUser LEFT JOIN cityusersdetail cud ON u.idUser = cud.idUser LEFT JOIN districtusersdetail dud ON u.idUser = dud.idUser LEFT JOIN subdistrictusersdetail sdud ON u.idUser = sdud.idUser LEFT JOIN admintpsuserdetail atud ON u.idUser = atud.idUser LEFT JOIN officertpsuserdetail otud ON u.idUser = otud.idUser LEFT JOIN provincedata p ON pud.idProvince = p.idProvince LEFT JOIN citydata c ON cud.idCity = c.idCity LEFT JOIN districtdata d ON dud.idDistrict = d.idDistrict LEFT JOIN subdistrictdata sd ON sdud.idSubDistrict = sd.idSubDistrict LEFT JOIN tpsdata t ON atud.idTps = t.idTps OR otud.idTps = t.idTps
    WHERE u.idUser = p_target_idUser;

    CALL sp_validateUser(p_actor_idUser, v_target_assignmentId, v_target_level);

    -- PERUBAHAN: Ganti DELETE dengan UPDATE status menjadi 'inactive'
    UPDATE users SET status = 'inactive' WHERE idUser = p_target_idUser;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_users_read_complex` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_users_read_complex`(
    -- Parameter Wajib
    IN p_actor_idUser INT,
    IN p_include_subordinates BOOLEAN,

    -- Parameter Filter Opsional (biarkan NULL jika tidak digunakan)
    IN p_filter_name VARCHAR(255),
    IN p_filter_email VARCHAR(100),
    IN p_filter_role ENUM('national','province','district','sub_district','city','officerTps','adminTps'),
    
    -- Filter Wilayah berdasarkan ID
    IN p_filter_idProvince BIGINT,
    IN p_filter_idCity BIGINT,
    IN p_filter_idDistrict BIGINT,
    IN p_filter_idSubDistrict BIGINT,
    
    -- == PARAMETER BARU: Filter Wilayah berdasarkan NAMA ==
    IN p_filter_provinceName VARCHAR(100),
    IN p_filter_cityName VARCHAR(100),
    IN p_filter_districtName VARCHAR(100),
    IN p_filter_subDistrictName VARCHAR(100)
)
BEGIN
    DECLARE v_actor_role VARCHAR(50);
    DECLARE v_actor_idProvince BIGINT;
    DECLARE v_actor_idCity BIGINT;
    DECLARE v_actor_idDistrict BIGINT;
    DECLARE v_actor_idSubDistrict BIGINT;
    DECLARE v_actor_idTps BIGINT;

    -- Langkah 1: Dapatkan semua informasi kewenangan dari pengguna yang melakukan aksi (aktor)
    SELECT 
        role, idProvince, idCity, idDistrict, idSubDistrict, idTps
    INTO 
        v_actor_role, v_actor_idProvince, v_actor_idCity, v_actor_idDistrict, v_actor_idSubDistrict, v_actor_idTps
    FROM vw_admin_users 
    WHERE idUser = p_actor_idUser;

    -- Langkah 2: Query utama dengan klausa WHERE yang dinamis dan berlapis
    SELECT * FROM vw_admin_users
    WHERE
        -- LAPISAN 1: FILTER KEAMANAN HIERARKI (WAJIB)
        (
            v_actor_role = 'national' OR
            (v_actor_role = 'province' AND vw_admin_users.idProvince = v_actor_idProvince) OR
            (v_actor_role = 'city' AND vw_admin_users.idCity = v_actor_idCity) OR
            (v_actor_role = 'district' AND vw_admin_users.idDistrict = v_actor_idDistrict) OR
            (v_actor_role = 'sub_district' AND vw_admin_users.idSubDistrict = v_actor_idSubDistrict) OR
            (v_actor_role IN ('adminTps', 'officerTps') AND vw_admin_users.idTps = v_actor_idTps)
        )

        -- LAPISAN 2: FILTER KONTROL HIERARKI
        AND (p_include_subordinates = TRUE OR vw_admin_users.role = v_actor_role)

        -- LAPISAN 3: FILTER PENCARIAN UMUM (NAMA & EMAIL)
        AND (p_filter_name IS NULL OR vw_admin_users.name LIKE CONCAT('%', p_filter_name, '%'))
        AND (p_filter_email IS NULL OR vw_admin_users.email LIKE CONCAT('%', p_filter_email, '%'))
        AND (p_filter_role IS NULL OR vw_admin_users.role = p_filter_role)

        -- LAPISAN 4: FILTER WILAYAH ADMINISTRATIF (ID & NAMA)
        AND (p_filter_idProvince IS NULL OR vw_admin_users.idProvince = p_filter_idProvince)
        AND (p_filter_idCity IS NULL OR vw_admin_users.idCity = p_filter_idCity)
        AND (p_filter_idDistrict IS NULL OR vw_admin_users.idDistrict = p_filter_idDistrict)
        AND (p_filter_idSubDistrict IS NULL OR vw_admin_users.idSubDistrict = p_filter_idSubDistrict)
        
        -- -- Bagian yang ditambahkan --
        AND (p_filter_provinceName IS NULL OR vw_admin_users.provinceName LIKE CONCAT('%', p_filter_provinceName, '%'))
        AND (p_filter_cityName IS NULL OR vw_admin_users.cityName LIKE CONCAT('%', p_filter_cityName, '%'))
        AND (p_filter_districtName IS NULL OR vw_admin_users.districtName LIKE CONCAT('%', p_filter_districtName, '%'))
        AND (p_filter_subDistrictName IS NULL OR vw_admin_users.subDistrictName LIKE CONCAT('%', p_filter_subDistrictName, '%'));

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_users_update` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_users_update`(
    IN p_actor_idUser INT,
    IN p_target_idUser INT,
    IN p_new_email VARCHAR(100),
    IN p_new_name VARCHAR(255),
    IN p_new_password VARCHAR(255),
    -- DITAMBAHKAN: Parameter untuk mengubah status
    IN p_new_status ENUM('active', 'inactive', 'pending')
)
BEGIN
    DECLARE v_target_level VARCHAR(50);
    DECLARE v_target_assignmentId BIGINT;

    -- Validasi menggunakan tabel users langsung agar bisa update user inactive
    SELECT COALESCE(t.idTps, sd.idSubDistrict, d.idDistrict, c.idCity, p.idProvince, 0),
           COALESCE(CASE WHEN t.idTps IS NOT NULL THEN 'tps' END, CASE WHEN sd.idSubDistrict IS NOT NULL THEN 'sub_district' END, CASE WHEN d.idDistrict IS NOT NULL THEN 'district' END, CASE WHEN c.idCity IS NOT NULL THEN 'city' END, CASE WHEN p.idProvince IS NOT NULL THEN 'province' END, 'national')
    INTO v_target_assignmentId, v_target_level
    FROM users u
    LEFT JOIN nationalusersdetail nud ON u.idUser = nud.idUser LEFT JOIN provinceusersdetail pud ON u.idUser = pud.idUser LEFT JOIN cityusersdetail cud ON u.idUser = cud.idUser LEFT JOIN districtusersdetail dud ON u.idUser = dud.idUser LEFT JOIN subdistrictusersdetail sdud ON u.idUser = sdud.idUser LEFT JOIN admintpsuserdetail atud ON u.idUser = atud.idUser LEFT JOIN officertpsuserdetail otud ON u.idUser = otud.idUser LEFT JOIN provincedata p ON pud.idProvince = p.idProvince LEFT JOIN citydata c ON cud.idCity = c.idCity LEFT JOIN districtdata d ON dud.idDistrict = d.idDistrict LEFT JOIN subdistrictdata sd ON sdud.idSubDistrict = sd.idSubDistrict LEFT JOIN tpsdata t ON atud.idTps = t.idTps OR otud.idTps = t.idTps
    WHERE u.idUser = p_target_idUser;

    CALL sp_validateUser(p_actor_idUser, v_target_assignmentId, v_target_level);
    
    UPDATE users SET
        email = COALESCE(p_new_email, email),
        name = COALESCE(p_new_name, name),
        password = COALESCE(SHA2(p_new_password, 256), password),
        status = COALESCE(p_new_status, status) -- PERUBAHAN
    WHERE idUser = p_target_idUser;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_validateUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_validateUser`(IN p_idUser INT, IN p_idTargetData BIGINT, IN p_targetLevel VARCHAR(50))
BEGIN
    DECLARE v_userRole VARCHAR(50);
    DECLARE v_userStatus VARCHAR(20);
    DECLARE v_authorized INT DEFAULT 0;

    -- PERUBAHAN: Ambil juga status dari aktor
    SELECT role, status INTO v_userRole, v_userStatus FROM users WHERE idUser = p_idUser;
    
    -- PERUBAHAN: Tambahkan pengecekan apakah aktor aktif
    IF v_userStatus != 'active' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Akses ditolak: Akun Anda tidak aktif.';
    END IF;

    IF v_userRole = 'national' THEN SET v_authorized = 1;
    ELSE
        -- (Sisa logika IF/ELSEIF tidak berubah)
        IF p_targetLevel = 'province' THEN SELECT 1 INTO v_authorized FROM provinceusersdetail WHERE idUser = p_idUser AND idProvince = p_idTargetData LIMIT 1; ELSEIF p_targetLevel = 'city' THEN SELECT 1 INTO v_authorized FROM citydata cd WHERE cd.idCity = p_idTargetData AND ( EXISTS (SELECT 1 FROM cityusersdetail WHERE idUser = p_idUser AND idCity = cd.idCity) OR EXISTS (SELECT 1 FROM provinceusersdetail WHERE idUser = p_idUser AND idProvince = cd.idProvince) ) LIMIT 1; ELSEIF p_targetLevel = 'district' THEN SELECT 1 INTO v_authorized FROM districtdata d JOIN citydata c ON d.idCity = c.idCity WHERE d.idDistrict = p_idTargetData AND ( EXISTS (SELECT 1 FROM districtusersdetail WHERE idUser = p_idUser AND idDistrict = d.idDistrict) OR EXISTS (SELECT 1 FROM cityusersdetail WHERE idUser = p_idUser AND idCity = c.idCity) OR EXISTS (SELECT 1 FROM provinceusersdetail WHERE idUser = p_idUser AND idProvince = c.idProvince) ) LIMIT 1; ELSEIF p_targetLevel = 'sub_district' THEN SELECT 1 INTO v_authorized FROM subdistrictdata sd JOIN districtdata d ON sd.idDistrict = d.idDistrict JOIN citydata c ON d.idCity = c.idCity WHERE sd.idSubDistrict = p_idTargetData AND ( EXISTS (SELECT 1 FROM subdistrictusersdetail WHERE idUser = p_idUser AND idSubDistrict = sd.idSubDistrict) OR EXISTS (SELECT 1 FROM districtusersdetail WHERE idUser = p_idUser AND idDistrict = d.idDistrict) OR EXISTS (SELECT 1 FROM cityusersdetail WHERE idUser = p_idUser AND idCity = c.idCity) OR EXISTS (SELECT 1 FROM provinceusersdetail WHERE idUser = p_idUser AND idProvince = c.idProvince) ) LIMIT 1; ELSEIF p_targetLevel = 'tps' THEN SELECT 1 INTO v_authorized FROM tpsdata t JOIN subdistrictdata sd ON t.idSubDistrict = sd.idSubDistrict JOIN districtdata d ON sd.idDistrict = d.idDistrict JOIN citydata c ON d.idCity = c.idCity WHERE t.idTps = p_idTargetData AND ( EXISTS (SELECT 1 FROM officertpsuserdetail WHERE idUser = p_idUser AND idTps = t.idTps) OR EXISTS (SELECT 1 FROM admintpsuserdetail WHERE idUser = p_idUser AND idTps = t.idTps) OR EXISTS (SELECT 1 FROM subdistrictusersdetail WHERE idUser = p_idUser AND idSubDistrict = sd.idSubDistrict) OR EXISTS (SELECT 1 FROM districtusersdetail WHERE idUser = p_idUser AND idDistrict = d.idDistrict) OR EXISTS (SELECT 1 FROM cityusersdetail WHERE idUser = p_idUser AND idCity = c.idCity) OR EXISTS (SELECT 1 FROM provinceusersdetail WHERE idUser = p_idUser AND idProvince = c.idProvince) ) LIMIT 1; END IF;
    END IF;

    IF v_authorized = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Akses ditolak: Anda tidak memiliki kewenangan untuk data di wilayah ini.';
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_voter_archive` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_voter_archive`(IN p_actor_idUser INT, IN p_idData INT)
BEGIN
    DECLARE v_idTps BIGINT;
    -- Mengambil idTps dari tabel asli, bukan view, agar bisa mengarsip data dari TPS yang sudah diarsip
    SELECT t.idTps INTO v_idTps 
    FROM voterdata v
    JOIN officertpsuserdetail otud ON v.idOfficer = otud.idData
    JOIN tpsdata t ON otud.idTps = t.idTps
    WHERE v.idData = p_idData;
    
    IF v_idTps IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Data pemilih tidak ditemukan.';
    END IF;

    CALL sp_validateUser(p_actor_idUser, v_idTps, 'tps');
    
    -- PERUBAHAN: Ganti DELETE dengan UPDATE
    UPDATE voterdata SET status = 'deleted' WHERE idData = p_idData;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_voter_create` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_voter_create`(
    IN p_actor_idUser INT,
    -- PERUBAHAN: Parameter baru untuk menentukan petugas yang ditugaskan
    IN p_idOfficerDetail INT, -- Ini adalah idData dari tabel officertpsuserdetail
    IN p_nik VARCHAR(16),
    IN p_name VARCHAR(255),
    IN p_dateOfBirth DATE,
    IN p_gender TINYINT,
    IN p_locationPhoto VARCHAR(255),
    OUT p_new_idData INT,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_actor_role VARCHAR(50);
    DECLARE v_actor_idTps BIGINT;
    DECLARE v_officer_idTps BIGINT;
    DECLARE v_nik_exists INT DEFAULT 0;

    -- Ambil peran dan idTps dari aktor (yang harusnya adminTps)
    SELECT u.role, ad.idTps INTO v_actor_role, v_actor_idTps
    FROM users u JOIN admintpsuserdetail ad ON u.idUser = ad.idUser
    WHERE u.idUser = p_actor_idUser;

    -- PERUBAHAN: Validasi baru
    IF v_actor_role != 'adminTps' THEN
        SET p_message = 'Error: Aksi ini hanya bisa dilakukan oleh Admin TPS.';
    ELSE
        -- Verifikasi bahwa petugas yang dipilih (p_idOfficerDetail) ada di TPS yang sama dengan admin
        SELECT idTps INTO v_officer_idTps FROM officertpsuserdetail WHERE idData = p_idOfficerDetail;
        IF v_officer_idTps IS NULL THEN
            SET p_message = 'Error: Petugas TPS yang dipilih tidak ditemukan.';
        ELSEIF v_officer_idTps != v_actor_idTps THEN
            SET p_message = 'Error: Anda hanya bisa menugaskan pemilih ke petugas di TPS Anda sendiri.';
        ELSE
            -- Logika pengecekan NIK (tidak berubah)
            SELECT COUNT(*) INTO v_nik_exists FROM voterdata WHERE nik = p_nik;
            IF v_nik_exists > 0 THEN
                SET p_message = 'Error: NIK sudah terdaftar.';
            ELSE
                -- Insert data pemilih baru dengan idOfficer yang sudah ditentukan
                INSERT INTO voterdata(nik, name, dateOfBirth, gender, idOfficer, locationPhoto)
                VALUES (p_nik, p_name, p_dateOfBirth, p_gender, p_idOfficerDetail, p_locationPhoto);
                
                SET p_new_idData = LAST_INSERT_ID();
                SET p_message = 'Data pemilih berhasil ditambahkan.';
            END IF;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_voter_read` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_voter_read`(
    IN p_actor_idUser INT,
    IN p_filter_name VARCHAR(255),
    IN p_filter_nik VARCHAR(16),
    IN p_filter_idTps BIGINT,
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    DECLARE v_actor_role VARCHAR(50);
    DECLARE v_actor_idProvince BIGINT;
    DECLARE v_actor_idCity BIGINT;
    DECLARE v_actor_idDistrict BIGINT;
    DECLARE v_actor_idSubDistrict BIGINT;
    DECLARE v_actor_idTps BIGINT;
    -- Variabel baru untuk menyimpan ID detail dari petugas
    DECLARE v_officer_detail_id INT;

    -- Dapatkan semua informasi kewenangan dari aktor
    SELECT role, idProvince, idCity, idDistrict, idSubDistrict, idTps
    INTO v_actor_role, v_actor_idProvince, v_actor_idCity, v_actor_idDistrict, v_actor_idSubDistrict, v_actor_idTps
    FROM vw_admin_users
    WHERE idUser = p_actor_idUser;

    -- Jika aktor adalah officerTps, dapatkan ID detailnya dari tabel officertpsuserdetail
    IF v_actor_role = 'officerTps' THEN
        SELECT idData INTO v_officer_detail_id FROM officertpsuserdetail WHERE idUser = p_actor_idUser;
    END IF;

    -- Query utama dari helper view vw_voter_details
    SELECT * FROM vw_voter_details
    WHERE
        -- LAPISAN 1: FILTER KEAMANAN HIERARKI (WAJIB)
        (
            v_actor_role = 'national' OR
            (v_actor_role = 'province' AND vw_voter_details.idProvince = v_actor_idProvince) OR
            (v_actor_role = 'city' AND vw_voter_details.idCity = v_actor_idCity) OR
            (v_actor_role = 'district' AND vw_voter_details.idDistrict = v_actor_idDistrict) OR
            (v_actor_role = 'sub_district' AND vw_voter_details.idSubDistrict = v_actor_idSubDistrict) OR
            -- Logika untuk adminTps: melihat seluruh data di TPS-nya
            (v_actor_role = 'adminTps' AND vw_voter_details.idTps = v_actor_idTps) OR
            -- Logika baru untuk officerTps: hanya melihat data yang terikat padanya
            (v_actor_role = 'officerTps' AND vw_voter_details.idOfficer = v_officer_detail_id)
        )
        -- LAPISAN 2: FILTER PENCARIAN (OPSIONAL)
        AND (p_filter_name IS NULL OR vw_voter_details.name LIKE CONCAT('%', p_filter_name, '%'))
        AND (p_filter_nik IS NULL OR vw_voter_details.nik LIKE CONCAT('%', p_filter_nik, '%'))
        AND (p_filter_idTps IS NULL OR vw_voter_details.idTps = p_filter_idTps)
    LIMIT p_limit OFFSET p_offset;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_voter_update` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_voter_update`(
    IN p_actor_idUser INT,
    IN p_idData INT,
    IN p_nik VARCHAR(16),
    IN p_name VARCHAR(255),
    IN p_dateOfBirth DATE,
    IN p_gender TINYINT,
    IN p_locationPhoto VARCHAR(255),
    IN p_new_status ENUM('active', 'deleted')
)
BEGIN
    -- ==========================================================
    -- PERBAIKAN: Semua deklarasi variabel dipindahkan ke sini
    -- ==========================================================
    DECLARE v_actor_role VARCHAR(50);
    DECLARE v_officer_detail_id INT;
    DECLARE v_voter_officer_id INT;
    DECLARE v_idTps BIGINT;
    DECLARE v_nik_exists INT DEFAULT 0;

    -- Ambil peran aktor untuk menentukan alur logika
    SELECT role INTO v_actor_role FROM users WHERE idUser = p_actor_idUser;

    -- Logika bercabang berdasarkan peran
    IF v_actor_role = 'officerTps' THEN
        -- LOGIKA KHUSUS UNTUK OFFICER TPS
        -- Periksa apakah officer hanya mencoba mengubah foto
        IF p_nik IS NOT NULL OR p_name IS NOT NULL OR p_dateOfBirth IS NOT NULL OR p_gender IS NOT NULL OR p_new_status IS NOT NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Akses ditolak: Petugas TPS hanya diizinkan untuk mengubah foto.';
        ELSE
            -- Dapatkan ID detail dari petugas ini
            SELECT idData INTO v_officer_detail_id FROM officertpsuserdetail WHERE idUser = p_actor_idUser;
            -- Dapatkan ID petugas yang terikat pada data pemilih target
            SELECT idOfficer INTO v_voter_officer_id FROM voterdata WHERE idData = p_idData;
            
            -- Pastikan petugas ini adalah penanggung jawab dari data pemilih tersebut
            IF v_officer_detail_id != v_voter_officer_id THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Akses ditolak: Anda bukan penanggung jawab untuk data pemilih ini.';
            ELSE
                -- Jika semua valid, update fotonya saja
                UPDATE voterdata SET locationPhoto = p_locationPhoto WHERE idData = p_idData;
            END IF;
        END IF;

    ELSE
        -- LOGIKA UMUM UNTUK ADMIN LAINNYA (adminTps, city, national, dll)
        -- Ini adalah logika lama kita yang menggunakan sp_validateUser
        SELECT t.idTps INTO v_idTps 
        FROM voterdata v JOIN officertpsuserdetail otud ON v.idOfficer = otud.idData JOIN tpsdata t ON otud.idTps = t.idTps
        WHERE v.idData = p_idData;

        IF v_idTps IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Data pemilih tidak ditemukan.';
        END IF;
        
        CALL sp_validateUser(p_actor_idUser, v_idTps, 'tps');
        
        IF p_nik IS NOT NULL THEN
            SELECT COUNT(*) INTO v_nik_exists FROM voterdata WHERE nik = p_nik AND idData != p_idData;
            IF v_nik_exists > 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: NIK sudah digunakan oleh pemilih lain.';
            END IF;
        END IF;

        UPDATE voterdata SET
            nik = COALESCE(p_nik, nik), 
            name = COALESCE(p_name, name), 
            dateOfBirth = COALESCE(p_dateOfBirth, dateOfBirth),
            gender = COALESCE(p_gender, gender), 
            locationPhoto = COALESCE(p_locationPhoto, locationPhoto), 
            status = COALESCE(p_new_status, status)
        WHERE idData = p_idData;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `vw_admin_users`
--

/*!50001 DROP VIEW IF EXISTS `vw_admin_users`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_admin_users` AS select `u`.`idUser` AS `idUser`,`u`.`name` AS `name`,`u`.`email` AS `email`,`u`.`role` AS `role`,`u`.`status` AS `status`,(case when (`pud`.`idProvince` is not null) then `pud`.`idProvince` when (`c`.`idProvince` is not null) then `c`.`idProvince` when (`dc`.`idProvince` is not null) then `dc`.`idProvince` when (`sddc`.`idProvince` is not null) then `sddc`.`idProvince` when (`tsd_dcp`.`idProvince` is not null) then `tsd_dcp`.`idProvince` else NULL end) AS `idProvince`,(case when (`pud`.`idProvince` is not null) then `p`.`name` when (`c`.`idProvince` is not null) then `cp`.`name` when (`dc`.`idProvince` is not null) then `dcp`.`name` when (`sddc`.`idProvince` is not null) then `sddcp`.`name` when (`tsd_dcp`.`idProvince` is not null) then `tsd_dcp`.`name` else NULL end) AS `provinceName`,(case when (`cud`.`idCity` is not null) then `cud`.`idCity` when (`d`.`idCity` is not null) then `d`.`idCity` when (`sdd`.`idCity` is not null) then `sdd`.`idCity` when (`tsd_d`.`idCity` is not null) then `tsd_d`.`idCity` else NULL end) AS `idCity`,(case when (`cud`.`idCity` is not null) then `c`.`name` when (`d`.`idCity` is not null) then `dc`.`name` when (`sdd`.`idCity` is not null) then `sddc`.`name` when (`tsd_d`.`idCity` is not null) then `tsd_dc`.`name` else NULL end) AS `cityName`,(case when (`dud`.`idDistrict` is not null) then `dud`.`idDistrict` when (`sd`.`idDistrict` is not null) then `sd`.`idDistrict` when (`tsd`.`idDistrict` is not null) then `tsd`.`idDistrict` else NULL end) AS `idDistrict`,(case when (`dud`.`idDistrict` is not null) then `d`.`name` when (`sd`.`idDistrict` is not null) then `sdd`.`name` when (`tsd`.`idDistrict` is not null) then `tsd_d`.`name` else NULL end) AS `districtName`,(case when (`sdud`.`idSubDistrict` is not null) then `sdud`.`idSubDistrict` when (`t`.`idSubDistrict` is not null) then `t`.`idSubDistrict` else NULL end) AS `idSubDistrict`,(case when (`sdud`.`idSubDistrict` is not null) then `sd`.`name` when (`t`.`idSubDistrict` is not null) then `tsd`.`name` else NULL end) AS `subDistrictName`,coalesce(`atud`.`idTps`,`otud`.`idTps`) AS `idTps`,`t`.`name` AS `tpsName` from ((((((((((((((((((((((`users` `u` left join `nationalusersdetail` `nud` on((`u`.`idUser` = `nud`.`idUser`))) left join `provinceusersdetail` `pud` on((`u`.`idUser` = `pud`.`idUser`))) left join `cityusersdetail` `cud` on((`u`.`idUser` = `cud`.`idUser`))) left join `districtusersdetail` `dud` on((`u`.`idUser` = `dud`.`idUser`))) left join `subdistrictusersdetail` `sdud` on((`u`.`idUser` = `sdud`.`idUser`))) left join `admintpsuserdetail` `atud` on((`u`.`idUser` = `atud`.`idUser`))) left join `officertpsuserdetail` `otud` on((`u`.`idUser` = `otud`.`idUser`))) left join `provincedata` `p` on((`pud`.`idProvince` = `p`.`idProvince`))) left join `citydata` `c` on((`cud`.`idCity` = `c`.`idCity`))) left join `provincedata` `cp` on((`c`.`idProvince` = `cp`.`idProvince`))) left join `districtdata` `d` on((`dud`.`idDistrict` = `d`.`idDistrict`))) left join `citydata` `dc` on((`d`.`idCity` = `dc`.`idCity`))) left join `provincedata` `dcp` on((`dc`.`idProvince` = `dcp`.`idProvince`))) left join `subdistrictdata` `sd` on((`sdud`.`idSubDistrict` = `sd`.`idSubDistrict`))) left join `districtdata` `sdd` on((`sd`.`idDistrict` = `sdd`.`idDistrict`))) left join `citydata` `sddc` on((`sdd`.`idCity` = `sddc`.`idCity`))) left join `provincedata` `sddcp` on((`sddc`.`idProvince` = `sddcp`.`idProvince`))) left join `tpsdata` `t` on(((`atud`.`idTps` = `t`.`idTps`) or (`otud`.`idTps` = `t`.`idTps`)))) left join `subdistrictdata` `tsd` on((`t`.`idSubDistrict` = `tsd`.`idSubDistrict`))) left join `districtdata` `tsd_d` on((`tsd`.`idDistrict` = `tsd_d`.`idDistrict`))) left join `citydata` `tsd_dc` on((`tsd_d`.`idCity` = `tsd_dc`.`idCity`))) left join `provincedata` `tsd_dcp` on((`tsd_dc`.`idProvince` = `tsd_dcp`.`idProvince`))) where (`u`.`status` = 'active') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_tps_details`
--

/*!50001 DROP VIEW IF EXISTS `vw_tps_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_tps_details` AS select `t`.`idTps` AS `idTps`,`t`.`name` AS `name`,`t`.`status` AS `status`,`sd`.`idSubDistrict` AS `idSubDistrict`,`sd`.`name` AS `subDistrictName`,`d`.`idDistrict` AS `idDistrict`,`d`.`name` AS `districtName`,`c`.`idCity` AS `idCity`,`c`.`name` AS `cityName`,`p`.`idProvince` AS `idProvince`,`p`.`name` AS `provinceName` from ((((`tpsdata` `t` join `subdistrictdata` `sd` on((`t`.`idSubDistrict` = `sd`.`idSubDistrict`))) join `districtdata` `d` on((`sd`.`idDistrict` = `d`.`idDistrict`))) join `citydata` `c` on((`d`.`idCity` = `c`.`idCity`))) join `provincedata` `p` on((`c`.`idProvince` = `p`.`idProvince`))) where (`t`.`status` = 'active') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_voter_details`
--

/*!50001 DROP VIEW IF EXISTS `vw_voter_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_voter_details` AS select `v`.`idData` AS `idData`,`v`.`nik` AS `nik`,`v`.`name` AS `name`,`v`.`status` AS `status`,`v`.`dateOfBirth` AS `dateOfBirth`,`v`.`gender` AS `gender`,`v`.`locationPhoto` AS `locationPhoto`,`v`.`idOfficer` AS `idOfficer`,`u`.`name` AS `officerName`,`t`.`idTps` AS `idTps`,`t`.`name` AS `tpsName`,`sd`.`idSubDistrict` AS `idSubDistrict`,`sd`.`name` AS `subDistrictName`,`d`.`idDistrict` AS `idDistrict`,`d`.`name` AS `districtName`,`c`.`idCity` AS `idCity`,`c`.`name` AS `cityName`,`p`.`idProvince` AS `idProvince`,`p`.`name` AS `provinceName` from (((((((`voterdata` `v` join `officertpsuserdetail` `otud` on((`v`.`idOfficer` = `otud`.`idData`))) join `users` `u` on((`otud`.`idUser` = `u`.`idUser`))) join `tpsdata` `t` on((`otud`.`idTps` = `t`.`idTps`))) join `subdistrictdata` `sd` on((`t`.`idSubDistrict` = `sd`.`idSubDistrict`))) join `districtdata` `d` on((`sd`.`idDistrict` = `d`.`idDistrict`))) join `citydata` `c` on((`d`.`idCity` = `c`.`idCity`))) join `provincedata` `p` on((`c`.`idProvince` = `p`.`idProvince`))) where ((`v`.`status` = 'active') and (`u`.`status` = 'active') and (`t`.`status` = 'active')) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-10  7:44:14
