-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: zl354
-- ------------------------------------------------------
-- Server version	8.0.30

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
-- Table structure for table `pest_reports`
--

DROP TABLE IF EXISTS `pest_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pest_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `pest_id` int DEFAULT NULL,
  `custom_pest_name` varchar(100) DEFAULT NULL,
  `description` text,
  `location_name` varchar(255) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `image_url` text,
  `report_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `pest_type` varchar(100) DEFAULT NULL,
  `status_choice` varchar(50) DEFAULT NULL,
  `notifiable_choice` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `pest_id` (`pest_id`),
  CONSTRAINT `pest_reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `pest_reports_ibfk_2` FOREIGN KEY (`pest_id`) REFERENCES `pests` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pest_reports`
--

LOCK TABLES `pest_reports` WRITE;
/*!40000 ALTER TABLE `pest_reports` DISABLE KEYS */;
INSERT INTO `pest_reports` VALUES (3,2,24,'Noble False Widow Spider','An introduced spider that resembles widow spiders and is known for its painful bite.','Seddon Road, Hamilton North, Hamilton, Waikato',-37.78643890312288,175.27467044306772,NULL,'2026-04-30 10:24:33','Spider','Non-regulated','Yes'),(4,2,33,'Johnson grass','An invasive grass that spreads quickly and competes with crops and native plants.','Wairere Drive, Fairview Downs, Hamilton, Waikato',-37.770112731938674,175.30535778905988,NULL,'2026-04-30 12:28:03','Plant','Regulated','Yes'),(6,2,5,'Asian Tiger Mosquito','A black mosquito with white stripes that can spread diseases and is an important public health concern.','Ruakura Road, Ruakura, Hamilton, Waikato',-37.786103,175.320659,NULL,'2026-04-30 13:55:00','Insect','Not assessed','Yes'),(7,2,12,'Black Widow Spider','A venomous spider with a dark body, known for its toxic bite and medical importance.','Ruakura Road, Ruakura, Hamilton, Waikato',-37.78498775116719,175.31628323012393,NULL,'2026-05-01 00:08:40','Spider','Regulated','No'),(8,2,NULL,'Gum Emperor Moth','A large moth emerging from its hairy cocoon, identified by its distinctive orange and black hindwing markings.','Findlay Street, Hamilton East, Hamilton, Waikato',-37.79503519330557,175.30406695495446,NULL,'2026-05-07 17:41:11','Insect','Uncertain','Uncertain');
/*!40000 ALTER TABLE `pest_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pests`
--

DROP TABLE IF EXISTS `pests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `organism_type` varchar(50) NOT NULL,
  `description` text,
  `regulatory_status` varchar(100) DEFAULT NULL,
  `notifiable` tinyint(1) DEFAULT '0',
  `image_url` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pests`
--

LOCK TABLES `pests` WRITE;
/*!40000 ALTER TABLE `pests` DISABLE KEYS */;
INSERT INTO `pests` VALUES (1,'Argentine Ant','Insect','A small invasive ant that spreads quickly, forms large colonies, and disrupts native insect populations.','Non-regulated',0,'https://www.doc.govt.nz/thumbs/gallery/link/f9d0ebe2174d4b7cb59623cda9454e40.aspx'),(2,'American Cockroach','Insect','A large reddish-brown cockroach commonly found in warm and damp environments, especially around buildings.','Non-regulated',0,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=88&width=175&height=200&scale=2'),(3,'Giant African Snail','Mollusc','A large land snail that can damage crops and plants and is considered a serious biosecurity risk.','Regulated',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=305&width=175&height=200&scale=2'),(4,'Asian Paper Wasp','Insect','A slender brown-and-yellow wasp that preys on insects and can affect native biodiversity.','Non-regulated',0,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=386&width=175&height=200&scale=2'),(5,'Asian Tiger Mosquito','Insect','A black mosquito with white stripes that can spread diseases and is an important public health concern.','Not assessed',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=385&width=175&height=200&scale=2'),(6,'Australian Redback Spider','Spider','A venomous black spider with a red marking on its back, known for its medically significant bite.','Regulated',0,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=384&width=175&height=200&scale=2'),(7,'Australian Subterranean Termite','Insect','A destructive termite species that can damage wooden structures and buildings.','Regulated',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=475&width=200&height=200'),(8,'African Love Grass','Plant','An invasive grass species that spreads easily and can reduce pasture quality.','Regulated',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=17&width=175&height=200&scale=2'),(9,'Bamboo Longhorn Beetle','Insect','A beetle pest whose larvae bore into bamboo and can damage ornamental and structural bamboo plants.','Regulated',0,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=381&width=175&height=200&scale=2'),(10,'Bamboo Moth','Insect','A moth pest associated with bamboo, where larvae feed on plant material and may damage growth.','Non-regulated',0,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=380&width=175&height=200&scale=2'),(11,'Black Crazy Ant','Insect','A fast-moving invasive ant that forms large colonies and can disturb native ecosystems.','Not assessed',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=372&width=175&height=200&scale=2'),(12,'Black Widow Spider','Spider','A venomous spider with a dark body, known for its toxic bite and medical importance.','Regulated',0,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=365&width=175&height=200&scale=2'),(13,'Brown Marmorated Stink Bug','Insect','A shield-shaped agricultural pest that feeds on many fruit and vegetable crops.','Regulated',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=124&width=175&height=200&scale=2'),(14,'Common Wasp','Insect','A yellow-and-black invasive wasp that competes with native species and can sting people.','Non-regulated',0,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=343&width=175&height=200&scale=2'),(15,'Fall Webworm','Insect','A moth species whose caterpillars create web nests and feed on the leaves of many trees.','Not assessed',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=322&width=175&height=200&scale=2'),(16,'Painted Apple Moth','Insect','A moth pest whose larvae feed on a wide range of trees and plants and pose a biosecurity concern.','Regulated',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=263&width=175&height=200&scale=2'),(17,'Queensland Fruit Fly','Insect','A serious fruit pest that lays eggs in fruit, causing major damage to horticulture.','Regulated',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=222&width=175&height=200&scale=2'),(18,'Ferret','Mammal','A predator introduced to New Zealand that threatens native wildlife and can spread disease.','Not assessed',0,'https://www.doc.govt.nz/thumbs/gallery/link/2aef16c3062f4c038b4aada0915860b3.aspx'),(19,'Rainbow Lorikeet','Bird','A brightly coloured introduced bird that can compete with native birds for food and nesting sites.','Not assessed',0,'https://www.doc.govt.nz/thumbs/gallery/link/20f93ed1cc994251ae479ff203857c2d.aspx'),(20,'Fire Tree','Plant','An invasive tree species that can spread rapidly and compete with native vegetation.','Regulated',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=131&width=175&height=200&scale=2'),(21,'Water Lettuce','Plant','A floating aquatic plant that can form dense mats and block waterways.','Regulated',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=39&width=175&height=200&scale=2'),(22,'Phragmites','Plant','A tall reed-like plant that can invade wetlands and outcompete native aquatic vegetation.','Regulated',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=70&width=175&height=200&scale=2'),(23,'German Wasp','Insect','A highly aggressive invasive wasp that harms native biodiversity and poses a risk to people.','Non-regulated',0,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=306&width=175&height=200&scale=2'),(24,'Noble False Widow Spider','Spider','An introduced spider that resembles widow spiders and is known for its painful bite.','Non-regulated',1,'https://th.bing.com/th/id/OIP.D0SGibtB4iu3lu8n3KJkYgHaE7?w=108&h=108&c=1&bgcl=13fe0e&r=0&o=7&dpr=1.3&pid=ImgRC&rm=3'),(25,'Rook','Bird','A large black bird introduced to New Zealand that can damage crops and pasture.','Not assessed',0,'https://www.tiakitamakimakaurau.nz/media/osjkpdlm/rook-03.jpg?width=700&height=390&v=1d7e511b53bf850'),(26,'Rat','Mammal','Rats are invasive predators in New Zealand that prey on native birds, eggs, and insects.','Not assessed',0,'https://www.tuiatetaiao.nz/assets/Uploads/Publications/Predator-Free-2050-Publications/Rat-eating-blackbird-egg__ResizedImageWzE2OCwxMTJd.jpg'),(27,'Possum','Mammal','The brushtail possum is a major pest that damages native forests and threatens native wildlife.','Not assessed',0,'https://www.tuiatetaiao.nz/assets/Uploads/Publications/Predator-Free-2050-Publications/PossumInTree__ResizedImageWzE2OCwxMTFd.jpg'),(28,'Rabbit','Mammal','Rabbits are widespread pests that overgraze vegetation and damage farmland.','Not assessed',0,'https://www.doc.govt.nz/thumbs/gallery/link/7c8224383996467faf4fb0f6c3167004.aspx'),(29,'Hedgehog','Mammal','Hedgehogs are introduced animals that prey on native insects, eggs, and small wildlife.','Not assessed',0,'https://www.doc.govt.nz/thumbs/gallery/link/65757ea00d7f44908baae9dfa7864a81.jpg'),(30,'Stoat','Mammal','Stoats are invasive predators introduced to control rabbits but now threaten native birds and wildlife.','Not assessed',0,'https://www.doc.govt.nz/thumbs/gallery/link/3e10be00dee64aaeb5f35ca3d64a4270.jpg'),(31,'Colorado Potato Beetle','Insect','The Colorado potato beetle poses a huge potential threat to New Zealand\'s potato growers.','Not assessed',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=347&width=175&height=200&scale=2'),(32,'West Indian drywood termite','Insect','The West Indian drywood termite is a serious wood boring insect.','Regulated',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=177&width=175&height=200&scale=2'),(33,'Johnson grass','Plant','An invasive grass that spreads quickly and competes with crops and native plants.','Regulated',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=291&width=175&height=200&scale=2'),(34,'Water Hyacinth','Plant','A fast-growing aquatic plant that forms dense mats, blocking sunlight and disrupting aquatic ecosystems.','Regulated',1,'https://apps.mpi.govt.nz/DesktopModules/DigArticle/MediaHandler.ashx?portalid=2&moduleid=3804&mediaid=413&width=175&height=200&scale=2'),(35,'Weasel','Mammal','Weasels are small predatory mammals that prey on native birds, eggs, and insects.','Not assessed',0,'https://www.doc.govt.nz/thumbs/gallery/link/f795d88189724a24adc18fdb58737794.aspx');
/*!40000 ALTER TABLE `pests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_noted_reports`
--

DROP TABLE IF EXISTS `user_noted_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_noted_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `report_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_report` (`user_id`,`report_id`),
  KEY `report_id` (`report_id`),
  CONSTRAINT `user_noted_reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_noted_reports_ibfk_2` FOREIGN KEY (`report_id`) REFERENCES `pest_reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_noted_reports`
--

LOCK TABLES `user_noted_reports` WRITE;
/*!40000 ALTER TABLE `user_noted_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_noted_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testuser','test@gmail.com','$2b$10$KaJ8i1cp/NrKrULK4xfHdOYelB.WnjjFPHydCWbsacVQjfmEZIznm','2026-03-26 09:10:51','user'),(2,'TEST','test@qq.com','$2b$10$UBxXt5y/vxiCheeC3vpCKOXgORYy6I6fw3V7651Tk5LILkE12xBiC','2026-04-26 11:21:16','admin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-21 22:59:01
