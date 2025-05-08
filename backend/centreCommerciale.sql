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
-- Table structure for table `base_donnees_associee`
--

DROP TABLE IF EXISTS `base_donnees_associee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_donnees_associee` (
  `idBase` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) DEFAULT NULL,
  `description` text,
  `structureDonnees` json DEFAULT NULL,
  PRIMARY KEY (`idBase`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_donnees_associee`
--

LOCK TABLES `base_donnees_associee` WRITE;
/*!40000 ALTER TABLE `base_donnees_associee` DISABLE KEYS */;
INSERT INTO `base_donnees_associee` VALUES (1,'Alarme intrusion','Nombre de fois que l’alarme a sonné','{\"nbr_activations\": 0}'),(2,'Porte connectée','Comptage des entrées/sorties','{\"entrees\": 0, \"sorties\": 0}'),(3,'Thermostat connecté','Températures et hygrométrie','{\"hygrometrie\": 0, \"temperature_ext\": 0, \"temperature_int\": 0}'),(4,'Caisse connectée','Encaissé et décaissé','{\"decaisse\": 0, \"encaisse\": 0}'),(5,'Escalateur connecté','Vitesse et sens','{\"sens\": \"inconnu\", \"vitesse\": 0}'),(6,'Lumière connectée','Mesure de luminosité','{\"luminosite\": 0}'),(7,'Compteur électrique','Consommation électrique','{\"consommation\": 0}'),(8,'Caméra connectée','Caméra de surveillance avec vision nocturne et stockage','{\"id_unique\": \"CamSec001\", \"resolution\": \"1080p\", \"vision_nuit\": true, \"derniere_detection\": \"2025-04-14T09:50:00\", \"etat_enregistrement\": \"actif\", \"stockage_disponible\": \"80%\"}'),(9,'Compteur électrique global','Mesure de la consommation d’un bâtiment entier','{\"courant\": \"15A\", \"tension\": \"230V\", \"id_unique\": \"ElecMain001\", \"derniere_releve\": \"2025-04-14T08:00:00\", \"consommation_totale_kWh\": 42130, \"consommation_journalière_kWh\": 105}'),(10,'Porte Parking','Barrière d’accès au parking pour les véhicules','{\"mode\": \"automatique\", \"statut\": \"ouverte\", \"entrees\": 23, \"sorties\": 17, \"id_unique\": \"GatePK002\", \"derniere_utilisation\": \"2025-04-14T10:12:00\"}'),(11,'Éclairage Galerie 2B','Système d’éclairage intelligent dans les galeries commerciales','{\"etat\": \"allumée\", \"mode\": \"détection de mouvement\", \"id_unique\": \"Light2B007\", \"luminosite\": 72, \"consommation_W\": 24, \"derniere_activation\": \"2025-04-14T09:45:00\"}'),(12,'Escalator Central','Escalator connecté avec détection de vitesse et sens','{\"etat\": \"en service\", \"sens\": \"montant\", \"id_unique\": \"EscalUp05\", \"vitesse_m_s\": 0.65, \"maintenance_prevue\": \"2025-05-10\", \"derniere_inspection\": \"2025-04-10\"}');
/*!40000 ALTER TABLE `base_donnees_associee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `camera_connectee`
--

DROP TABLE IF EXISTS `camera_connectee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `camera_connectee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idObjetConnecte` int NOT NULL,
  `resolution` varchar(20) DEFAULT NULL,
  `vision_nuit` tinyint(1) DEFAULT NULL,
  `derniere_detection` datetime DEFAULT NULL,
  `etat_enregistrement` varchar(50) DEFAULT NULL,
  `stockage_disponible` varchar(10) DEFAULT NULL,
  `emplacement` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idObjetConnecte` (`idObjetConnecte`),
  CONSTRAINT `camera_connectee_ibfk_1` FOREIGN KEY (`idObjetConnecte`) REFERENCES `objet_connecte` (`idObjetConnecte`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `camera_connectee`
--

LOCK TABLES `camera_connectee` WRITE;
/*!40000 ALTER TABLE `camera_connectee` DISABLE KEYS */;
/*!40000 ALTER TABLE `camera_connectee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compteur_electrique`
--

DROP TABLE IF EXISTS `compteur_electrique`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compteur_electrique` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idObjetConnecte` int NOT NULL,
  `courant` varchar(10) DEFAULT NULL,
  `tension` varchar(10) DEFAULT NULL,
  `consommation_totale_kWh` decimal(10,2) DEFAULT NULL,
  `consommation_journaliere_kWh` decimal(10,2) DEFAULT NULL,
  `derniere_releve` datetime DEFAULT NULL,
  `emplacement` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idObjetConnecte` (`idObjetConnecte`),
  CONSTRAINT `compteur_electrique_ibfk_1` FOREIGN KEY (`idObjetConnecte`) REFERENCES `objet_connecte` (`idObjetConnecte`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compteur_electrique`
--

LOCK TABLES `compteur_electrique` WRITE;
/*!40000 ALTER TABLE `compteur_electrique` DISABLE KEYS */;
INSERT INTO `compteur_electrique` VALUES (2,15,'15A','230V',42300.75,102.50,'2025-04-14 21:30:11','Local technique A');
/*!40000 ALTER TABLE `compteur_electrique` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donnees_objet`
--

DROP TABLE IF EXISTS `donnees_objet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donnees_objet` (
  `idDonnee` int NOT NULL AUTO_INCREMENT,
  `idObjetConnecte` int NOT NULL,
  `dateCollecte` datetime DEFAULT CURRENT_TIMESTAMP,
  `donnees` json NOT NULL,
  PRIMARY KEY (`idDonnee`),
  KEY `donnees_objet_ibfk_1` (`idObjetConnecte`),
  CONSTRAINT `donnees_objet_ibfk_1` FOREIGN KEY (`idObjetConnecte`) REFERENCES `objet_connecte` (`idObjetConnecte`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donnees_objet`
--

LOCK TABLES `donnees_objet` WRITE;
/*!40000 ALTER TABLE `donnees_objet` DISABLE KEYS */;
INSERT INTO `donnees_objet` VALUES (1,12,'2025-04-15 15:49:58','{\"etat\": \"arrêt\", \"sens\": \"descente\", \"emplacement\": \"Entrée principale\", \"vitesse_m_s\": \"2\", \"maintenance_prevue\": \"3 mois+\", \"derniere_inspection\": \"3 mois+\"}'),(2,14,'2025-04-15 15:59:07','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"72\", \"emplacement\": \"Galerie centrale\"}'),(3,15,'2025-04-15 15:13:46','{\"etat\": \"marche\", \"mode\": \"auto\", \"sens\": \"montée\", \"courant\": \"15\", \"tension\": \"239\", \"luminosite\": 50, \"resolution\": \"1080p\", \"emplacement\": \"Local technique A\", \"vitesse_m_s\": 1.5, \"temperature_cible\": 20, \"maintenance_prevue\": \"2 mois\", \"derniere_inspection\": \"1 mois\"}'),(4,11,'2025-04-15 15:59:27','{\"mode\": \"eco\", \"emplacement\": \"Hall A\", \"temperature_cible\": \"12.5\"}'),(6,14,'2025-04-15 16:14:53','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"61\", \"emplacement\": \"Galerie centrale\"}'),(7,14,'2025-04-15 16:14:56','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"73\", \"emplacement\": \"Galerie centrale\"}'),(8,14,'2025-04-15 16:14:59','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"5\", \"emplacement\": \"Galerie centrale\"}'),(9,14,'2025-04-15 16:15:01','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"32\", \"emplacement\": \"Galerie centrale\"}'),(10,11,'2025-04-15 16:15:19','{\"mode\": \"eco\", \"emplacement\": \"Hall A\", \"temperature_cible\": \"16.5\"}'),(11,11,'2025-04-15 16:15:22','{\"mode\": \"eco\", \"emplacement\": \"Hall A\", \"temperature_cible\": \"11.5\"}'),(12,11,'2025-04-15 16:15:25','{\"mode\": \"eco\", \"emplacement\": \"Hall A\", \"temperature_cible\": \"20\"}'),(13,14,'2025-04-15 16:19:50','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"56\", \"emplacement\": \"Galerie centrale\"}'),(14,14,'2025-04-15 16:19:53','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"17\", \"emplacement\": \"Galerie centrale\"}'),(15,14,'2025-04-15 16:19:57','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"78\", \"emplacement\": \"Galerie centrale\"}'),(16,14,'2025-04-15 16:26:15','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"26\", \"emplacement\": \"Galerie centrale\"}'),(17,14,'2025-04-15 16:26:18','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"64\", \"emplacement\": \"Galerie centrale\"}'),(18,14,'2025-04-15 16:26:21','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"38\", \"emplacement\": \"Galerie centrale\"}'),(19,14,'2025-04-15 16:26:23','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"77\", \"emplacement\": \"Galerie centrale\"}'),(20,14,'2025-04-15 16:26:26','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"5\", \"emplacement\": \"Galerie centrale\"}'),(21,14,'2025-04-15 16:26:29','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"18\", \"emplacement\": \"Galerie centrale\"}'),(22,15,'2025-04-15 16:32:34','{\"courant\": \"20\", \"tension\": \"239\", \"emplacement\": \"Local technique A\"}'),(23,15,'2025-04-15 16:32:37','{\"courant\": \"8\", \"tension\": \"239\", \"emplacement\": \"Local technique A\"}'),(24,15,'2025-04-15 16:32:39','{\"courant\": \"21\", \"tension\": \"239\", \"emplacement\": \"Local technique A\"}'),(25,15,'2025-04-15 16:32:42','{\"courant\": \"3\", \"tension\": \"239\", \"emplacement\": \"Local technique A\"}'),(26,15,'2025-04-15 16:32:45','{\"courant\": \"23\", \"tension\": \"239\", \"emplacement\": \"Local technique A\"}'),(27,12,'2025-04-15 17:06:38','{\"etat\": \"arrêt\", \"sens\": \"descente\", \"emplacement\": \"Entrée principale\", \"vitesse_m_s\": \"1.7\", \"maintenance_prevue\": \"3 mois+\", \"derniere_inspection\": \"3 mois+\"}'),(28,12,'2025-04-15 17:06:42','{\"etat\": \"arrêt\", \"sens\": \"descente\", \"emplacement\": \"Entrée principale\", \"vitesse_m_s\": \"2.2\", \"maintenance_prevue\": \"3 mois+\", \"derniere_inspection\": \"3 mois+\"}'),(29,12,'2025-04-15 17:06:45','{\"etat\": \"arrêt\", \"sens\": \"descente\", \"emplacement\": \"Entrée principale\", \"vitesse_m_s\": \"1.7\", \"maintenance_prevue\": \"3 mois+\", \"derniere_inspection\": \"3 mois+\"}'),(32,11,'2025-04-15 22:25:57','{\"mode\": \"eco\", \"emplacement\": \"Hall A\", \"temperature_cible\": \"16\"}'),(33,12,'2025-04-15 22:58:58','{\"etat\": \"arrêt\", \"sens\": \"descente\", \"emplacement\": \"Entrée principale\", \"vitesse_m_s\": \"2.2\", \"maintenance_prevue\": \"3 mois+\", \"derniere_inspection\": \"3 mois+\"}'),(34,11,'2025-04-15 23:00:07','{\"mode\": \"eco\", \"emplacement\": \"Hall A\", \"temperature_cible\": \"20.5\"}'),(35,12,'2025-04-15 23:10:43','{\"etat\": \"arrêt\", \"sens\": \"descente\", \"emplacement\": \"Entrée principale\", \"vitesse_m_s\": \"2.2\", \"maintenance_prevue\": \"3 mois+\", \"derniere_inspection\": \"3 mois+\"}'),(36,11,'2025-04-15 23:14:32','{\"mode\": \"eco\", \"emplacement\": \"Hall A\", \"temperature_cible\": \"22.5\"}'),(37,11,'2025-04-16 12:10:16','{\"mode\": \"eco\", \"emplacement\": \"Hall A\", \"temperature_cible\": \"16.5\"}'),(38,12,'2025-04-16 12:25:12','{\"etat\": \"arrêt\", \"sens\": \"descente\", \"emplacement\": \"Entrée principale\", \"vitesse_m_s\": \"1.6\", \"maintenance_prevue\": \"3 mois+\", \"derniere_inspection\": \"3 mois+\"}'),(39,12,'2025-04-16 12:25:21','{\"etat\": \"arrêt\", \"sens\": \"descente\", \"emplacement\": \"Entrée principale\", \"vitesse_m_s\": \"2\", \"maintenance_prevue\": \"3 mois+\", \"derniere_inspection\": \"3 mois+\"}'),(40,14,'2025-04-16 12:25:28','{\"etat\": \"arrêt\", \"mode\": \"eco\", \"luminosite\": \"18\", \"emplacement\": \"Galerie centrale\"}'),(42,15,'2025-04-16 13:24:32','{\"courant\": \"10\", \"tension\": \"239\", \"emplacement\": \"Local technique A\"}'),(43,14,'2025-04-16 13:50:40','{\"etat\": \"arrêt\", \"mode\": \"eco\", \"luminosite\": \"77\", \"emplacement\": \"Galerie centrale\"}'),(44,11,'2025-04-16 13:58:34','{\"mode\": \"eco\", \"emplacement\": \"Hall A\", \"temperature_cible\": \"21\"}'),(45,14,'2025-04-16 13:58:39','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"77\", \"emplacement\": \"Galerie centrale\"}'),(46,15,'2025-04-16 13:58:46','{\"courant\": \"23\", \"tension\": \"211\", \"emplacement\": \"Local technique A\"}'),(47,12,'2025-04-16 14:08:57','{\"etat\": \"arrêt\", \"sens\": \"descente\", \"emplacement\": \"Entrée principale\", \"vitesse_m_s\": \"2\", \"maintenance_prevue\": \"1 mois\", \"derniere_inspection\": \"3 mois+\"}'),(48,12,'2025-04-16 14:09:33','{\"etat\": \"arrêt\", \"sens\": \"descente\", \"emplacement\": \"Entrée principale\", \"vitesse_m_s\": \"2.4\", \"maintenance_prevue\": \"1 mois\", \"derniere_inspection\": \"3 mois+\"}'),(49,14,'2025-04-16 14:16:13','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"72\", \"emplacement\": \"Galerie centrale\"}'),(50,12,'2025-04-16 14:19:47','{\"etat\": \"arrêt\", \"sens\": \"descente\", \"emplacement\": \"Entrée principale\", \"vitesse_m_s\": \"2.4\", \"maintenance_prevue\": \"1 mois\", \"derniere_inspection\": \"1 mois\"}'),(51,12,'2025-04-16 14:19:56','{\"etat\": \"arrêt\", \"sens\": \"descente\", \"emplacement\": \"Entrée principale\", \"vitesse_m_s\": \"1.2\", \"maintenance_prevue\": \"1 mois\", \"derniere_inspection\": \"1 mois\"}'),(52,14,'2025-04-16 14:21:33','{\"etat\": \"arrêt\", \"mode\": \"manuel\", \"luminosite\": \"97\", \"emplacement\": \"Galerie centrale\"}'),(64,12,'2025-04-16 15:54:02','{\"etat\": \"arrêt\", \"sens\": \"descente\", \"emplacement\": \"Entrée principale\", \"vitesse_m_s\": \"2\", \"maintenance_prevue\": \"1 mois\", \"derniere_inspection\": \"1 mois\"}'),(70,12,'2025-04-16 16:33:08','{\"etat\": \"marche\", \"sens\": \"descente\", \"emplacement\": \"Entrée principale\", \"vitesse_m_s\": \"1.2\", \"maintenance_prevue\": \"2 mois\", \"derniere_inspection\": \"1 mois\"}'),(71,34,'2025-04-16 16:33:23','{\"etat\": \"marche\", \"mode\": \"auto\", \"luminosite\": \"71\", \"emplacement\": \"Non spécifié\"}'),(72,11,'2025-04-16 21:39:05','{\"mode\": \"eco\", \"emplacement\": \"Hall A\", \"temperature_cible\": \"16\"}'),(73,11,'2025-04-16 21:39:25','{\"mode\": \"eco\", \"emplacement\": \"Hall A\", \"temperature_cible\": \"10\"}'),(74,34,'2025-05-08 19:35:12','{\"etat\": \"marche\", \"mode\": \"auto\", \"luminosite\": \"89\", \"emplacement\": \"Non spécifié\"}'),(75,34,'2025-05-08 19:35:24','{\"etat\": \"marche\", \"mode\": \"auto\", \"luminosite\": \"75\", \"emplacement\": \"Non spécifié\"}'),(76,35,'2025-05-08 19:35:52','{\"mode\": \"auto\", \"emplacement\": \"ssmlk\", \"temperature_cible\": \"20.5\"}');
/*!40000 ALTER TABLE `donnees_objet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eclairage_connecte`
--

DROP TABLE IF EXISTS `eclairage_connecte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eclairage_connecte` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idObjetConnecte` int NOT NULL,
  `etat` varchar(50) DEFAULT NULL,
  `mode` varchar(100) DEFAULT NULL,
  `luminosite` int DEFAULT NULL,
  `consommation_W` decimal(6,2) DEFAULT NULL,
  `derniere_activation` datetime DEFAULT NULL,
  `emplacement` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idObjetConnecte` (`idObjetConnecte`),
  CONSTRAINT `eclairage_connecte_ibfk_1` FOREIGN KEY (`idObjetConnecte`) REFERENCES `objet_connecte` (`idObjetConnecte`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eclairage_connecte`
--

LOCK TABLES `eclairage_connecte` WRITE;
/*!40000 ALTER TABLE `eclairage_connecte` DISABLE KEYS */;
INSERT INTO `eclairage_connecte` VALUES (2,14,'allumée','détection de mouvement',70,15.50,'2025-04-14 21:30:11','Galerie centrale');
/*!40000 ALTER TABLE `eclairage_connecte` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Table structure for table `escalator_connecte`
--

DROP TABLE IF EXISTS `escalator_connecte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `escalator_connecte` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idObjetConnecte` int NOT NULL,
  `vitesse_m_s` decimal(5,2) DEFAULT NULL,
  `sens` varchar(50) DEFAULT NULL,
  `etat` varchar(50) DEFAULT NULL,
  `maintenance_prevue` date DEFAULT NULL,
  `derniere_inspection` date DEFAULT NULL,
  `emplacement` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idObjetConnecte` (`idObjetConnecte`),
  CONSTRAINT `escalator_connecte_ibfk_1` FOREIGN KEY (`idObjetConnecte`) REFERENCES `objet_connecte` (`idObjetConnecte`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `escalator_connecte`
--

LOCK TABLES `escalator_connecte` WRITE;
/*!40000 ALTER TABLE `escalator_connecte` DISABLE KEYS */;
INSERT INTO `escalator_connecte` VALUES (2,12,0.65,'montant','en service','2025-05-10','2025-04-10','Entrée principale');
/*!40000 ALTER TABLE `escalator_connecte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historique_connexion`
--

DROP TABLE IF EXISTS `historique_connexion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historique_connexion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUtilisateur` int NOT NULL,
  `adresseIP` varchar(255) DEFAULT NULL,
  `navigateur` text,
  `dateConnexion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idUtilisateur` (`idUtilisateur`),
  CONSTRAINT `historique_connexion_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historique_connexion`
--

LOCK TABLES `historique_connexion` WRITE;
/*!40000 ALTER TABLE `historique_connexion` DISABLE KEYS */;
INSERT INTO `historique_connexion` VALUES (1,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 10:46:31'),(2,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 14:20:22'),(3,43,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 14:21:03'),(4,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 14:22:08'),(5,43,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 14:42:37'),(6,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 14:43:02'),(7,43,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 14:49:38'),(8,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 14:50:19'),(9,43,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 14:56:29'),(10,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 14:57:08'),(11,43,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 15:12:48'),(12,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 15:13:51'),(13,43,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 15:19:07'),(14,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 15:19:36'),(15,43,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 15:20:26'),(16,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 15:21:07'),(17,43,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 15:28:52'),(18,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 15:30:07'),(19,43,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 15:40:12'),(20,43,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 15:41:06'),(21,43,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 15:44:18'),(22,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 15:50:21'),(23,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 15:51:47'),(24,43,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 15:53:38'),(25,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 15:54:50'),(26,43,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 16:15:43'),(27,43,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 16:16:19'),(28,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 16:17:04'),(29,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 16:32:47'),(30,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 21:38:37'),(31,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-04-16 21:40:58'),(32,42,'::ffff:127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0','2025-05-08 19:33:22');
/*!40000 ALTER TABLE `historique_connexion` ENABLE KEYS */;
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
  `idPlateforme` int NOT NULL,
  `typeObjet` varchar(50) DEFAULT NULL,
  `description` text,
  `estActif` tinyint(1) DEFAULT '1',
  `estValide` tinyint(1) DEFAULT '0',
  `dateAjout` datetime DEFAULT CURRENT_TIMESTAMP,
  `ajoutePar` int DEFAULT NULL,
  `idType` int DEFAULT NULL,
  `idBaseDonneeAssociee` int DEFAULT NULL,
  `idBase` int DEFAULT NULL,
  `emplacement` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idObjetConnecte`),
  KEY `idPlateforme` (`idPlateforme`),
  KEY `fk_objet_utilisateur` (`ajoutePar`),
  KEY `idType` (`idType`),
  KEY `idBaseDonneeAssociee` (`idBaseDonneeAssociee`),
  KEY `fk_base_donnees` (`idBase`),
  CONSTRAINT `fk_base_donnees` FOREIGN KEY (`idBase`) REFERENCES `base_donnees_associee` (`idBase`),
  CONSTRAINT `fk_objet_utilisateur` FOREIGN KEY (`ajoutePar`) REFERENCES `utilisateur` (`idUtilisateur`),
  CONSTRAINT `objet_connecte_ibfk_1` FOREIGN KEY (`idPlateforme`) REFERENCES `plateforme` (`idPlateforme`),
  CONSTRAINT `objet_connecte_ibfk_2` FOREIGN KEY (`idType`) REFERENCES `type_objet_connecte` (`idType`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objet_connecte`
--

LOCK TABLES `objet_connecte` WRITE;
/*!40000 ALTER TABLE `objet_connecte` DISABLE KEYS */;
INSERT INTO `objet_connecte` VALUES (1,'Thermosta',1,'Electronique','Theromosta inétligent',NULL,NULL,'2025-04-13 09:38:00',NULL,NULL,NULL,NULL,NULL),(11,'Thermostat Hall',1,'Thermostat connecté','Gère la température du hall principal',1,1,'2025-04-14 23:31:44',42,NULL,NULL,3,'Hall A'),(12,'Escalator Principal',1,'Escalator connecté','Escalator entre RDC et 1er étage',1,1,'2025-04-14 23:31:44',42,NULL,NULL,5,'Entrée principale'),(14,'Lumière Galerie 1',1,'Lumière connectée','Éclairage automatique dans la galerie centrale',1,1,'2025-04-14 23:31:44',42,NULL,NULL,11,'Galerie centrale'),(15,'Compteur Bâtiment A',1,'Compteur électrique','Mesure la conso électrique du bâtiment A',1,1,'2025-04-14 23:31:44',42,NULL,NULL,9,'Local technique A'),(34,'oooo',1,'Lumière connectée','omlkl',1,1,'2025-04-16 16:33:18',42,NULL,NULL,6,'gh'),(35,'sllsll',1,'Thermostat connecté','ssmlk',1,1,'2025-05-08 19:35:44',42,NULL,NULL,3,'mlsk');
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
-- Table structure for table `thermostat_connecte`
--

DROP TABLE IF EXISTS `thermostat_connecte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thermostat_connecte` (
  `idObjetConnecte` int NOT NULL,
  `temperature_int` float DEFAULT NULL,
  `temperature_ext` float DEFAULT NULL,
  `hygrometrie` float DEFAULT NULL,
  `derniere_maj` datetime DEFAULT NULL,
  `emplacement` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idObjetConnecte`),
  CONSTRAINT `thermostat_connecte_ibfk_1` FOREIGN KEY (`idObjetConnecte`) REFERENCES `objet_connecte` (`idObjetConnecte`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thermostat_connecte`
--

LOCK TABLES `thermostat_connecte` WRITE;
/*!40000 ALTER TABLE `thermostat_connecte` DISABLE KEYS */;
INSERT INTO `thermostat_connecte` VALUES (11,21.5,13.2,45,'2025-04-14 23:38:53','Hall A');
/*!40000 ALTER TABLE `thermostat_connecte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_objet_connecte`
--

DROP TABLE IF EXISTS `type_objet_connecte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_objet_connecte` (
  `idType` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`idType`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_objet_connecte`
--

LOCK TABLES `type_objet_connecte` WRITE;
/*!40000 ALTER TABLE `type_objet_connecte` DISABLE KEYS */;
INSERT INTO `type_objet_connecte` VALUES (1,'Alarme intrusion','Nombre d’alarmes déclenchées par jour'),(2,'Porte connectée','Entrées, sorties, personnes présentes'),(3,'Thermostat connecté','Température intérieure/extérieure, hygrométrie'),(4,'Caisse connectée','Encaissements et décaissements'),(5,'Escalator connecté','Vitesse et sens'),(6,'Lumière connectée','Luminosité'),(7,'Compteur électrique','Consommation électrique');
/*!40000 ALTER TABLE `type_objet_connecte` ENABLE KEYS */;
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
  `point` int DEFAULT '0',
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
  `tokenReset` varchar(255) DEFAULT NULL,
  `expirationReset` datetime DEFAULT NULL,
  PRIMARY KEY (`idUtilisateur`),
  UNIQUE KEY `email` (`email`),
  KEY `idEmplacement` (`idEmplacement`),
  KEY `idStatut` (`idStatut`),
  KEY `idPlateforme` (`idPlateforme`),
  CONSTRAINT `utilisateur_ibfk_1` FOREIGN KEY (`idEmplacement`) REFERENCES `emplacement` (`idEmplacement`),
  CONSTRAINT `utilisateur_ibfk_2` FOREIGN KEY (`idStatut`) REFERENCES `statut` (`id`),
  CONSTRAINT `utilisateur_ibfk_3` FOREIGN KEY (`idPlateforme`) REFERENCES `plateforme` (`idPlateforme`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (13,1,1,21,'H',NULL,0,1,'jaliskkkk@gmail.com','01020304','klingler','jalis',NULL,'standard',0,NULL,NULL,NULL,NULL),(42,1,1,111,'Homme','2003-02-04',136,1,'jalisklingler845@gmail.com','0000','KLINGLER','Bo','1744628970387-44147680.webp','admin',1,NULL,NULL,NULL,NULL),(43,1,1,10,'F',NULL,12,1,'sasej99116@naobk.com','1234','Jktou','Bilelouuuu',NULL,'standard',1,NULL,NULL,'9f8ac49cd0108b46d79fe890705b74e0c7f2de167b4507b8107f35758ddbaaf3','2025-04-16 00:44:30'),(45,1,1,15,'kkk',NULL,1,1,'kkk@gmail.com','kkkkk','kk','kk',NULL,'standard',0,'7445a8ea7fd489f7b0befdd77c994bb1ba59220dc1ec0111069f680e8c5733b8','2025-04-13 20:53:13',NULL,NULL),(47,1,1,77,'lmkskl','2033-02-08',1,1,'slks@gmail.com','dlmdkmlk','mùlùml','sùmsl',NULL,'standard',0,'37f36b1e03241b5a7b0099c4088ad8d74208464116c15bcb188d3aac437f0cb8','2025-04-15 23:46:23',NULL,NULL),(50,1,1,12,'h',NULL,1,1,'kk@gmail.com','0000','mlkmlk','smslk',NULL,'standard',0,'b60aca57367d934280455f19c88ccd2ca6725535600fa1d154d4f3d98f617738','2025-04-16 00:22:55',NULL,NULL),(52,1,1,45,'H',NULL,2,1,'levale2587@naobk.com','01020304','klingler','jjkkjk',NULL,'standard',1,NULL,NULL,NULL,NULL);
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

-- Dump completed on 2025-05-08 19:41:24
