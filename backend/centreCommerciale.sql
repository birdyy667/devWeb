-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: centreCommerciale
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.04.1

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
-- Table structure for table `emplacement`
--

DROP TABLE IF EXISTS `emplacement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emplacement` (
  `idEmplacement` int NOT NULL,
  `numero` int DEFAULT NULL,
  `rue` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `pays` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idEmplacement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emplacement`
--

LOCK TABLES `emplacement` WRITE;
/*!40000 ALTER TABLE `emplacement` DISABLE KEYS */;
INSERT INTO `emplacement` VALUES (1,15,'Rue des Lilas','Île-de-France','France');
/*!40000 ALTER TABLE `emplacement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objet_connecte`
--

DROP TABLE IF EXISTS `objet_connecte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objet_connecte` (
  `idObjetConnecte` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) DEFAULT NULL,
  `outils` json DEFAULT NULL,
  `idPlateforme` int NOT NULL,
  PRIMARY KEY (`idObjetConnecte`),
  KEY `idPlateforme` (`idPlateforme`),
  CONSTRAINT `objet_connecte_ibfk_1` FOREIGN KEY (`idPlateforme`) REFERENCES `plateforme` (`idPlateforme`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objet_connecte`
--

LOCK TABLES `objet_connecte` WRITE;
/*!40000 ALTER TABLE `objet_connecte` DISABLE KEYS */;
/*!40000 ALTER TABLE `objet_connecte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plateforme`
--

DROP TABLE IF EXISTS `plateforme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plateforme` (
  `idPlateforme` int NOT NULL AUTO_INCREMENT,
  `url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idPlateforme`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plateforme`
--

LOCK TABLES `plateforme` WRITE;
/*!40000 ALTER TABLE `plateforme` DISABLE KEYS */;
INSERT INTO `plateforme` VALUES (1,'https://ma-plateforme.fr');
/*!40000 ALTER TABLE `plateforme` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statut`
--

DROP TABLE IF EXISTS `statut`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statut` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` enum('client','commercant','admin') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statut`
--

LOCK TABLES `statut` WRITE;
/*!40000 ALTER TABLE `statut` DISABLE KEYS */;
INSERT INTO `statut` VALUES (1,'client');
/*!40000 ALTER TABLE `statut` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `idUtilisateur` int NOT NULL AUTO_INCREMENT,
  `idEmplacement` int NOT NULL,
  `idPlateforme` int NOT NULL,
  `age` int DEFAULT NULL,
  `genre` varchar(20) DEFAULT NULL,
  `dateNaissance` date DEFAULT NULL,
  `point` int DEFAULT NULL,
  `idStatut` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `motDePasse` varchar(255) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `typeMembre` varchar(100) DEFAULT NULL,
  `estVerifie` tinyint(1) DEFAULT '0',
  `tokenValidation` varchar(255) DEFAULT NULL,
  `expirationToken` datetime DEFAULT NULL,
  PRIMARY KEY (`idUtilisateur`),
  UNIQUE KEY `email` (`email`),
  KEY `idEmplacement` (`idEmplacement`),
  KEY `idStatut` (`idStatut`),
  KEY `idPlateforme` (`idPlateforme`),
  CONSTRAINT `utilisateur_ibfk_1` FOREIGN KEY (`idEmplacement`) REFERENCES `emplacement` (`idEmplacement`),
  CONSTRAINT `utilisateur_ibfk_2` FOREIGN KEY (`idStatut`) REFERENCES `statut` (`id`),
  CONSTRAINT `utilisateur_ibfk_3` FOREIGN KEY (`idPlateforme`) REFERENCES `plateforme` (`idPlateforme`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (2,1,1,28,'Homme','1995-05-21',10,1,'','',NULL,NULL,NULL,NULL,0,NULL,NULL),(3,1,1,21,'H','2003-01-08',0,1,'Jalis@gmail.com','01020304',NULL,NULL,NULL,NULL,0,NULL,NULL),(5,1,1,13,'H','2003-02-08',0,1,'jalis2@gmail.com','klingler',NULL,NULL,NULL,NULL,0,NULL,NULL),(6,1,1,21,'H','2003-02-08',0,1,'Jalis3@gmail.com','01020304',NULL,NULL,NULL,NULL,0,NULL,NULL),(7,1,1,21,'H','2003-02-08',0,1,'Jalis4@gmail.com','01020304','KLINGLER','Jalis','JJJJ','H',0,NULL,NULL),(8,1,1,21,'h','2003-02-08',0,1,'jalis77@gmail.com','01020304','KLINGLER','Jalis','llzlzkja','H',0,NULL,NULL),(9,1,1,21,'H','2003-02-08',0,1,'jalis7@gmail.com','01020304',NULL,NULL,'1743932549744-813740847.png',NULL,0,NULL,NULL),(10,1,1,21,'H','2003-02-08',0,1,'jalis9@gmail.com','01020304',NULL,NULL,'1743932784994-63599741.png',NULL,0,NULL,NULL),(12,1,1,21,'H','2003-02-08',0,1,'Jalis10@gmail.com','01020304',NULL,NULL,NULL,NULL,0,NULL,NULL),(13,1,1,21,'H',NULL,0,1,'jaliskkkk@gmail.com','01020304','klingler','jalis',NULL,'standard',0,NULL,NULL),(15,1,1,21,'H',NULL,0,1,'jaliskkkKk@gmail.com','01020304','klingler','jalis','1744015906824-438871040.png','standard',0,NULL,NULL),(17,1,1,21,'h',NULL,0,1,'jalissssklingler@gmail.com','01020304','klingler','jalis','1744016729121-893940483.png','standard',0,NULL,NULL),(18,1,1,21,'h',NULL,0,1,'Ja@gmail.com','01020304','KLINGLER','Jalis','1744016878547-36319517.png','standard',0,NULL,NULL),(19,1,1,21,'h',NULL,0,1,'a@gmail.com','01020304','KLINGLER','Jalis','1744016954773-645478264.png','standard',0,NULL,NULL),(20,1,1,21,'h',NULL,0,1,'aa@gmail.com','01020304','KLINGLER','Jalis','1744017007624-861867569.png','standard',0,NULL,NULL),(21,1,1,21,'h',NULL,0,1,'aaa@gmail.com','01020304','KLINGLER','Jalis','1744017093006-875168518.png','standard',0,NULL,NULL),(22,1,1,21,'h',NULL,0,1,'jalisaa@gmail.com','01020304','klingler','jalis','1744017123972-485217879.png','standard',0,NULL,NULL),(23,1,1,21,'h',NULL,0,1,'k@gmail.com','01020304','kk','jjaj','1744017257597-132865946.png','standard',0,NULL,NULL),(24,1,1,21,'H',NULL,0,1,'jaja@gmail.com','01020304','klingler','jalis','1744017371013-199539355.png','standard',0,NULL,NULL),(25,1,1,21,'H',NULL,0,1,'kaka@gmail.com','01020304','klingler','jaja',NULL,'standard',0,NULL,NULL),(26,1,1,21,'H',NULL,0,1,'123@gmail.com','01020304','KLINGLER','Jalis','1744017986911-884785289.png','standard',0,NULL,NULL),(28,1,1,21,'h',NULL,0,1,'jalisklingler@gmail.com','01020304','KLINGLER','Jalis','1744186862864-483437556.png','standard',0,'b92eadbbe83ba0de4212b932c43398b82c37f69414bc9369df14639b4bfb4ac7','2025-04-09 11:21:03'),(30,1,1,21,'H',NULL,0,1,'jalisklingler845@gmail.com','01020304','klingler','JALIS','1744189893237-193982863.png','standard',1,NULL,NULL),(31,1,1,19,'k',NULL,0,1,'legil37595@lesotica.com','01020304','k','m','1744189989645-571791783.png','standard',1,NULL,NULL),(32,1,1,5,'5',NULL,0,1,'romafo4322@lesotica.com','01020304','k','l','1744190147461-469861578.png','standard',1,NULL,NULL),(33,1,1,21,'h',NULL,0,1,'behog55979@lesotica.com','01020304','k','k',NULL,'standard',1,NULL,NULL),(34,1,1,21,'18',NULL,0,1,'datomex573@movfull.com','01020304','k','k','1744190539816-777650333.png','standard',1,NULL,NULL),(35,1,1,15,'h',NULL,0,1,'negirom428@movfull.com','01020304','l','l',NULL,'standard',1,NULL,NULL),(36,1,1,21,'h',NULL,0,1,'gateco2275@movfull.com','01020304','l','l',NULL,'standard',1,NULL,NULL),(37,1,1,21,'h',NULL,0,1,'ciregi9960@lesotica.com','01020304','k','k',NULL,'standard',1,NULL,NULL),(38,1,1,21,'h',NULL,0,1,'sibatoy367@lesotica.com','01020304','k','k',NULL,'standard',1,NULL,NULL);
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-09 12:13:56
