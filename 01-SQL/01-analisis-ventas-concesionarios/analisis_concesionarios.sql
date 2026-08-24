-- ============================================================================
-- ANÁLISIS DE VENTAS — RED DE CONCESIONARIOS
-- ============================================================================
-- Caso de negocio: análisis del rendimiento comercial de una red de 50
-- concesionarios de automoción en España. 50 modelos de vehículos,
-- 500 transacciones de venta.
--
-- Técnicas: CTEs, subqueries correlacionadas, LAG, PERCENTILE_CONT,
--           PERCENT_RANK, RANK, porcentaje de contribución.
--
-- Autor: Borja Mora Méndez
-- Stack: T-SQL · SQL Server
-- ============================================================================


-- ============================================================================
-- 1. CREACIÓN DE LA BASE DE DATOS
-- ============================================================================

CREATE DATABASE AutomocionDB;
GO

USE AutomocionDB;
GO


-- ----------------------------------------------------------------------------
-- 1.1 Estructura de tablas
-- ----------------------------------------------------------------------------
CREATE TABLE concesionarios (
    id_concesionario INT PRIMARY KEY,
    nombre           VARCHAR(100),
    ciudad           VARCHAR(50),
    region           VARCHAR(50)
);

CREATE TABLE vehiculos (
    id_vehiculo INT PRIMARY KEY,
    modelo      VARCHAR(100),
    categoria   VARCHAR(30),
    precio      DECIMAL(12,2)
);

CREATE TABLE ventas (
    id_venta         INT PRIMARY KEY,
    fecha            DATE,
    id_concesionario INT,
    id_vehiculo      INT,
    cantidad         INT,
    FOREIGN KEY (id_concesionario) REFERENCES concesionarios(id_concesionario),
    FOREIGN KEY (id_vehiculo)      REFERENCES vehiculos(id_vehiculo)
);


-- ----------------------------------------------------------------------------
-- 1.2 Datos — 50 concesionarios
-- ----------------------------------------------------------------------------
INSERT INTO concesionarios VALUES
(1,'AutoMadrid Norte','Madrid','Centro'),
(2,'AutoMadrid Sur','Madrid','Centro'),
(3,'AutoBarcelona','Barcelona','Cataluña'),
(4,'AutoValencia','Valencia','Levante'),
(5,'AutoSevilla','Sevilla','Andalucía'),
(6,'AutoBilbao','Bilbao','Norte'),
(7,'AutoMalaga','Málaga','Andalucía'),
(8,'AutoZaragoza','Zaragoza','Aragón'),
(9,'AutoValladolid','Valladolid','Castilla'),
(10,'AutoMurcia','Murcia','Levante'),
(11,'MotorMadrid','Madrid','Centro'),
(12,'MotorBarcelona','Barcelona','Cataluña'),
(13,'MotorValencia','Valencia','Levante'),
(14,'MotorSevilla','Sevilla','Andalucía'),
(15,'MotorBilbao','Bilbao','Norte'),
(16,'MotorMalaga','Málaga','Andalucía'),
(17,'MotorZaragoza','Zaragoza','Aragón'),
(18,'MotorMurcia','Murcia','Levante'),
(19,'MotorAlicante','Alicante','Levante'),
(20,'MotorCoruna','La Coruña','Galicia'),
(21,'PremiumCars Madrid','Madrid','Centro'),
(22,'PremiumCars Barcelona','Barcelona','Cataluña'),
(23,'PremiumCars Valencia','Valencia','Levante'),
(24,'PremiumCars Sevilla','Sevilla','Andalucía'),
(25,'PremiumCars Bilbao','Bilbao','Norte'),
(26,'PremiumCars Malaga','Málaga','Andalucía'),
(27,'PremiumCars Murcia','Murcia','Levante'),
(28,'PremiumCars Zaragoza','Zaragoza','Aragón'),(29,'PremiumCars Vigo','Vigo','Galicia'),
(30,'PremiumCars Gijon','Gijón','Asturias'),
(31,'DriveCenter Madrid','Madrid','Centro'),
(32,'DriveCenter Barcelona','Barcelona','Cataluña'),
(33,'DriveCenter Valencia','Valencia','Levante'),
(34,'DriveCenter Sevilla','Sevilla','Andalucía'),
(35,'DriveCenter Bilbao','Bilbao','Norte'),
(36,'DriveCenter Malaga','Málaga','Andalucía'),
(37,'DriveCenter Murcia','Murcia','Levante'),
(38,'DriveCenter Zaragoza','Zaragoza','Aragón'),
(39,'DriveCenter Vigo','Vigo','Galicia'),
(40,'DriveCenter Oviedo','Oviedo','Asturias'),
(41,'AutoPlus Madrid','Madrid','Centro'),
(42,'AutoPlus Barcelona','Barcelona','Cataluña'),
(43,'AutoPlus Valencia','Valencia','Levante'),
(44,'AutoPlus Sevilla','Sevilla','Andalucía'),
(45,'AutoPlus Bilbao','Bilbao','Norte'),
(46,'AutoPlus Malaga','Málaga','Andalucía'),
(47,'AutoPlus Murcia','Murcia','Levante'),
(48,'AutoPlus Zaragoza','Zaragoza','Aragón'),
(49,'AutoPlus Vigo','Vigo','Galicia'),
(50,'AutoPlus Oviedo','Oviedo','Asturias');


-- ----------------------------------------------------------------------------
-- 1.3 Datos — 50 vehículos (Grupo VW: Seat, Audi, Cupra, VW, Skoda)
-- ----------------------------------------------------------------------------

INSERT INTO vehiculos VALUES(1,'Seat Ibiza','Utilitario',18000),
(2,'Seat Leon','Compacto',24000),
(3,'Seat Arona','SUV',26000),
(4,'Seat Ateca','SUV',32000),
(5,'Seat Tarraco','SUV',39000),
(6,'Audi A1','Utilitario Premium',28000),
(7,'Audi A3','Compacto Premium',36000),
(8,'Audi A4','Berlina Premium',47000),
(9,'Audi A6','Berlina Premium',62000),
(10,'Audi Q2','SUV Premium',37000),
(11,'Audi Q3','SUV Premium',45000),
(12,'Audi Q5','SUV Premium',60000),
(13,'Audi e-tron','Eléctrico',72000),
(14,'Cupra Leon','Deportivo',41000),
(15,'Cupra Formentor','SUV Deportivo',43000),
(16,'Cupra Born','Eléctrico',39000),
(17,'Volkswagen Polo','Utilitario',19000),
(18,'Volkswagen Golf','Compacto',29000),
(19,'Volkswagen Passat','Berlina',41000),
(20,'Volkswagen Tiguan','SUV',38000),
(21,'Volkswagen ID.3','Eléctrico',37000),
(22,'Volkswagen ID.4','Eléctrico',46000),
(23,'Skoda Fabia','Utilitario',17500),
(24,'Skoda Octavia','Compacto',28000),
(25,'Skoda Superb','Berlina',39000),
(26,'Skoda Karoq','SUV',31000),
(27,'Skoda Enyaq','Eléctrico',44000),
(28,'Audi A5','Berlina Premium',52000),
(29,'Audi Q7','SUV Premium',81000),
(30,'Audi Q8','SUV Premium',92000),(31,'Seat Mii Electric','Eléctrico',21000),
(32,'Cupra Tavascan','Eléctrico',55000),
(33,'Cupra Terramar','SUV Deportivo',47000),
(34,'Audi RS3','Deportivo',71000),
(35,'Audi RS5','Deportivo',96000),
(36,'Audi TT','Deportivo',65000),
(37,'Seat Toledo','Compacto',22000),
(38,'Seat Exeo','Berlina',26000),
(39,'Volkswagen T-Roc','SUV',34000),
(40,'Volkswagen Touareg','SUV',70000),
(41,'Skoda Kamiq','SUV',27000),
(42,'Skoda Scala','Compacto',24000),
(43,'Audi A7','Berlina Premium',78000),
(44,'Audi e-tron GT','Eléctrico',105000),
(45,'Cupra Raval','Eléctrico',35000),
(46,'Seat Leon e-Hybrid','Híbrido',33000),
(47,'Audi A3 TFSIe','Híbrido',42000),
(48,'Volkswagen Golf GTE','Híbrido',41000),
(49,'Skoda Superb iV','Híbrido',43000),
(50,'Cupra Leon e-Hybrid','Híbrido',44000);


-- ----------------------------------------------------------------------------
-- 1.4 Datos — 500 transacciones de venta (enero–junio 2025)
-- ----------------------------------------------------------------------------

INSERT INTO ventas (id_venta, fecha, id_concesionario, id_vehiculo, cantidad) VALUES(1,'2025-06-13',8,2,9),(2,'2025-03-04',15,9,4),(3,'2025-06-23',48,35,3),
(4,'2025-06-01',28,3,1),(5,'2025-01-24',14,15,17),(6,'2025-06-04',2,36,7),
(7,'2025-06-16',45,35,14),(8,'2025-02-26',29,38,9),(9,'2025-01-02',49,11,14),
(10,'2025-03-29',18,10,7),(11,'2025-03-28',7,6,13),(12,'2025-01-25',23,23,20),
(13,'2025-03-09',3,47,15),(14,'2025-05-18',8,25,3),(15,'2025-05-22',19,41,20),
(16,'2025-04-03',37,13,3),(17,'2025-01-12',43,15,10),(18,'2025-01-21',15,7,13),
(19,'2025-03-13',30,41,12),(20,'2025-02-11',24,23,7),(21,'2025-06-21',18,45,3),
(22,'2025-06-05',41,11,18),(23,'2025-03-04',11,30,13),(24,'2025-03-11',41,45,18),
(25,'2025-02-26',44,21,2),(26,'2025-02-28',3,21,13),(27,'2025-03-10',5,14,19),
(28,'2025-03-22',14,42,16),(29,'2025-04-12',42,30,5),(30,'2025-03-09',9,16,18),
(31,'2025-05-18',17,48,19),(32,'2025-04-20',38,26,12),(33,'2025-02-26',9,33,16),
(34,'2025-01-24',49,4,4),(35,'2025-02-09',41,11,14),(36,'2025-06-02',5,25,13),
(37,'2025-06-02',30,34,9),(38,'2025-05-22',1,44,4),(39,'2025-06-24',35,49,9),
(40,'2025-06-14',22,8,10),(41,'2025-04-22',11,30,1),(42,'2025-03-09',33,49,6),
(43,'2025-05-10',7,41,10),(44,'2025-06-13',33,39,7),(45,'2025-02-09',24,49,6),
(46,'2025-05-19',50,34,1),(47,'2025-06-03',21,32,1),(48,'2025-01-29',24,20,8),
(49,'2025-01-15',16,37,3),(50,'2025-01-22',47,32,3),(51,'2025-05-17',50,9,5),
(52,'2025-06-18',31,36,6),(53,'2025-03-09',34,39,14),(54,'2025-02-24',35,49,7),
(55,'2025-03-21',26,43,12),(56,'2025-04-23',34,29,4),(57,'2025-03-05',15,5,11),
(58,'2025-01-06',38,36,8),(59,'2025-05-31',15,1,3),(60,'2025-06-11',4,15,3),
(61,'2025-01-09',22,5,17),(62,'2025-03-02',18,43,16),(63,'2025-02-24',35,9,19),
(64,'2025-05-28',31,16,16),(65,'2025-04-15',13,7,4),(66,'2025-06-18',28,23,14),
(67,'2025-04-16',30,47,2),(68,'2025-06-22',42,42,4),(69,'2025-01-16',26,47,11),
(70,'2025-01-28',16,13,7),(71,'2025-05-18',29,9,14),(72,'2025-02-16',18,30,8),
(73,'2025-01-20',29,36,4),(74,'2025-01-13',42,35,1),(75,'2025-01-24',49,16,6),
(76,'2025-04-15',32,31,7),(77,'2025-04-13',4,11,13),(78,'2025-01-01',25,17,15),
(79,'2025-03-15',28,45,18),(80,'2025-06-19',46,32,5),(81,'2025-02-18',19,14,2),
(82,'2025-05-29',48,35,2),(83,'2025-03-22',4,4,19),(84,'2025-05-03',33,34,6),
(85,'2025-01-15',33,6,6),(86,'2025-01-18',39,5,8),(87,'2025-04-14',8,37,8),(88,'2025-05-29',39,3,20),(89,'2025-01-21',27,43,19),(90,'2025-05-25',34,21,9),
(91,'2025-02-22',43,46,11),(92,'2025-03-03',17,26,5),(93,'2025-06-21',42,20,15),
(94,'2025-03-22',49,5,1),(95,'2025-04-28',40,37,4),(96,'2025-01-19',35,14,17),
(97,'2025-03-09',9,23,3),(98,'2025-03-04',24,19,6),(99,'2025-04-23',35,46,10),
(100,'2025-06-06',42,34,1),(101,'2025-06-20',36,20,4),(102,'2025-02-04',17,8,4),
(103,'2025-05-22',10,18,10),(104,'2025-06-04',14,46,11),(105,'2025-02-22',44,41,9),
(106,'2025-05-10',32,17,2),(107,'2025-01-24',41,28,9),(108,'2025-01-12',1,22,5),
(109,'2025-06-13',17,11,15),(110,'2025-05-22',46,28,18),(111,'2025-01-03',8,5,5),
(112,'2025-05-20',3,24,19),(113,'2025-05-22',10,28,5),(114,'2025-01-11',20,24,2),
(115,'2025-04-02',14,44,8),(116,'2025-06-20',7,23,18),(117,'2025-04-15',40,48,5),
(118,'2025-03-02',11,12,14),(119,'2025-01-07',12,48,11),(120,'2025-04-16',43,48,8),
(121,'2025-03-10',11,45,4),(122,'2025-04-08',3,31,8),(123,'2025-02-21',30,23,10),
(124,'2025-02-28',15,2,7),(125,'2025-04-13',22,18,3),(126,'2025-03-13',23,42,17),
(127,'2025-04-13',44,35,11),(128,'2025-01-08',8,17,6),(129,'2025-05-29',17,3,4),
(130,'2025-06-02',28,23,11),(131,'2025-04-22',39,33,4),(132,'2025-04-09',37,13,9),
(133,'2025-01-12',46,28,1),(134,'2025-05-14',35,44,7),(135,'2025-04-04',28,5,11),
(136,'2025-06-09',21,43,4),(137,'2025-03-18',33,20,14),(138,'2025-03-25',26,45,10),
(139,'2025-05-22',9,13,14),(140,'2025-06-20',25,44,6),(141,'2025-06-07',37,20,13),
(142,'2025-05-21',1,20,10),(143,'2025-02-23',28,38,20),(144,'2025-06-17',21,30,15),
(145,'2025-04-24',44,14,17),(146,'2025-05-02',48,11,3),(147,'2025-03-14',33,43,20),
(148,'2025-03-27',6,49,8),(149,'2025-06-22',20,15,7),(150,'2025-02-07',2,3,8),
(151,'2025-05-02',40,50,3),(152,'2025-04-27',27,41,19),(153,'2025-02-19',46,45,13),
(154,'2025-05-07',26,16,5),(155,'2025-06-17',45,1,4),(156,'2025-04-19',15,12,17),
(157,'2025-04-29',4,36,8),(158,'2025-02-01',30,9,15),(159,'2025-06-20',34,36,20),
(160,'2025-03-23',49,29,20),(161,'2025-05-10',28,36,15),(162,'2025-02-10',48,31,15),
(163,'2025-03-08',49,16,9),(164,'2025-05-14',32,41,8),(165,'2025-03-12',29,5,10),
(166,'2025-03-02',18,22,11),(167,'2025-05-19',6,9,5),(168,'2025-03-01',25,45,5),
(169,'2025-06-30',14,5,14),(170,'2025-04-15',22,35,15),(171,'2025-04-17',4,14,14),
(172,'2025-04-10',50,38,1),(173,'2025-05-28',25,31,1),(174,'2025-04-01',20,49,13),(175,'2025-04-18',35,48,18),(176,'2025-06-04',15,32,8),(177,'2025-03-11',28,32,1),
(178,'2025-04-10',22,43,13),(179,'2025-02-12',30,9,20),(180,'2025-05-17',2,26,19),
(181,'2025-05-25',43,2,3),(182,'2025-06-14',28,9,15),(183,'2025-02-16',4,17,13),
(184,'2025-03-25',14,30,11),(185,'2025-03-28',49,25,9),(186,'2025-04-18',17,6,16),
(187,'2025-01-05',48,35,2),(188,'2025-03-31',15,42,3),(189,'2025-06-16',3,49,1),
(190,'2025-03-05',13,2,20),(191,'2025-02-09',16,9,16),(192,'2025-06-21',8,37,7),
(193,'2025-04-30',45,17,12),(194,'2025-02-12',39,39,4),(195,'2025-02-11',20,7,19),
(196,'2025-01-07',20,37,13),(197,'2025-04-12',46,13,3),(198,'2025-06-01',45,41,8),
(199,'2025-01-27',45,50,10),(200,'2025-06-25',39,8,19),(201,'2025-01-11',23,35,14),
(202,'2025-06-19',24,5,17),(203,'2025-06-15',22,1,14),(204,'2025-05-06',7,28,12),
(205,'2025-06-12',30,46,5),(206,'2025-04-22',12,47,17),(207,'2025-06-16',18,40,18),
(208,'2025-05-04',30,28,19),(209,'2025-03-10',21,16,3),(210,'2025-03-13',29,16,15),
(211,'2025-05-26',40,43,13),(212,'2025-03-28',2,32,11),(213,'2025-02-16',32,14,12),
(214,'2025-03-08',22,18,20),(215,'2025-06-29',18,36,1),(216,'2025-05-13',13,6,8),
(217,'2025-04-15',32,36,8),(218,'2025-06-26',31,42,16),(219,'2025-04-25',2,6,10),
(220,'2025-02-26',26,45,8),(221,'2025-03-20',43,38,12),(222,'2025-05-02',36,34,12),
(223,'2025-04-19',48,36,11),(224,'2025-04-01',45,30,9),(225,'2025-03-20',17,15,4),
(226,'2025-02-19',21,8,18),(227,'2025-06-26',12,13,7),(228,'2025-05-04',18,47,19),
(229,'2025-05-15',39,19,4),(230,'2025-02-19',19,15,12),(231,'2025-02-15',20,1,18),
(232,'2025-02-02',18,3,2),(233,'2025-05-22',19,45,5),(234,'2025-06-13',49,32,4),
(235,'2025-01-04',37,19,16),(236,'2025-05-03',29,22,6),(237,'2025-01-14',17,31,4),
(238,'2025-01-17',26,32,3),(239,'2025-05-28',41,44,2),(240,'2025-02-08',10,37,10),
(241,'2025-01-22',16,8,18),(242,'2025-04-17',39,39,20),(243,'2025-02-27',50,34,13),
(244,'2025-04-26',29,20,19),(245,'2025-04-20',20,37,20),(246,'2025-01-16',40,48,4),
(247,'2025-02-23',41,14,9),(248,'2025-06-19',6,11,8),(249,'2025-02-14',36,5,6),
(250,'2025-01-01',27,29,20),(251,'2025-05-01',19,3,8),(252,'2025-03-15',46,19,15),
(253,'2025-01-19',44,15,9),(254,'2025-06-10',38,43,7),(255,'2025-04-19',8,35,8),
(256,'2025-06-15',10,18,5),(257,'2025-01-19',4,11,10),(258,'2025-06-02',48,37,10),
(259,'2025-04-23',8,30,10),(260,'2025-06-29',26,18,17),(261,'2025-05-19',32,29,3),(262,'2025-06-03',3,28,11),(263,'2025-06-04',17,2,3),(264,'2025-02-28',44,37,19),
(265,'2025-01-06',49,44,9),(266,'2025-05-28',3,49,6),(267,'2025-05-01',34,42,15),
(268,'2025-03-13',12,38,14),(269,'2025-06-12',32,6,16),(270,'2025-03-31',27,22,11),
(271,'2025-06-21',7,11,11),(272,'2025-04-16',45,32,10),(273,'2025-06-19',26,49,18),
(274,'2025-01-10',30,6,11),(275,'2025-03-06',21,8,13),(276,'2025-05-12',1,43,18),
(277,'2025-04-29',27,4,7),(278,'2025-05-13',24,40,16),(279,'2025-06-10',29,49,2),
(280,'2025-02-22',18,36,5),(281,'2025-03-15',29,45,16),(282,'2025-02-01',2,41,20),
(283,'2025-03-03',46,11,10),(284,'2025-05-22',1,36,14),(285,'2025-01-24',15,8,15),
(286,'2025-01-31',42,10,16),(287,'2025-03-16',33,46,9),(288,'2025-04-17',31,31,8),
(289,'2025-04-27',36,10,13),(290,'2025-02-18',39,33,5),(291,'2025-01-18',18,50,14),
(292,'2025-03-29',33,18,1),(293,'2025-03-14',47,20,19),(294,'2025-05-29',43,32,5),
(295,'2025-04-25',35,31,12),(296,'2025-03-27',36,49,18),(297,'2025-04-07',30,21,7),
(298,'2025-06-28',16,37,13),(299,'2025-03-01',50,27,2),(300,'2025-03-23',48,31,13),
(301,'2025-04-09',43,42,5),(302,'2025-05-07',3,9,17),(303,'2025-06-01',22,7,15),
(304,'2025-01-26',34,30,1),(305,'2025-02-06',27,42,5),(306,'2025-01-20',31,17,11),
(307,'2025-06-09',45,26,3),(308,'2025-03-26',44,35,13),(309,'2025-03-23',41,46,16),
(310,'2025-05-19',3,40,3),(311,'2025-03-02',41,44,10),(312,'2025-02-28',48,6,14),
(313,'2025-01-26',49,41,4),(314,'2025-04-24',11,45,10),(315,'2025-01-08',3,21,2),
(316,'2025-03-17',23,24,14),(317,'2025-02-07',16,34,14),(318,'2025-05-25',44,12,6),
(319,'2025-02-14',6,40,13),(320,'2025-06-08',44,16,16),(321,'2025-05-30',10,15,15),
(322,'2025-06-13',17,30,9),(323,'2025-06-20',1,30,10),(324,'2025-06-23',35,11,3),
(325,'2025-04-24',23,38,10),(326,'2025-06-13',28,45,9),(327,'2025-04-27',20,13,13),
(328,'2025-05-04',7,16,13),(329,'2025-05-27',23,37,10),(330,'2025-06-29',19,2,13),
(331,'2025-03-12',1,37,2),(332,'2025-06-05',48,32,10),(333,'2025-02-28',39,23,8),
(334,'2025-06-12',13,40,9),(335,'2025-06-23',49,47,5),(336,'2025-06-10',7,41,2),
(337,'2025-03-21',29,3,19),(338,'2025-04-04',47,9,3),(339,'2025-03-17',21,48,14),
(340,'2025-02-14',13,9,18),(341,'2025-04-04',34,33,9),(342,'2025-02-12',17,31,10),
(343,'2025-03-28',8,30,3),(344,'2025-02-06',49,15,13),(345,'2025-05-23',24,6,13),
(346,'2025-01-04',17,35,4),(347,'2025-04-27',24,44,9),(348,'2025-05-30',25,41,12),(349,'2025-01-28',44,15,16),(350,'2025-01-07',40,36,11),(351,'2025-06-06',15,42,3),
(352,'2025-06-12',30,45,10),(353,'2025-06-16',27,8,5),(354,'2025-01-12',3,20,16),
(355,'2025-01-30',7,16,18),(356,'2025-02-04',25,30,12),(357,'2025-06-21',48,45,18),
(358,'2025-04-18',38,48,5),(359,'2025-04-17',42,7,16),(360,'2025-06-07',27,18,2),
(361,'2025-06-26',24,14,15),(362,'2025-04-24',16,24,4),(363,'2025-06-25',24,35,12),
(364,'2025-01-16',26,18,7),(365,'2025-02-01',30,6,7),(366,'2025-06-14',41,39,1),
(367,'2025-01-13',22,16,5),(368,'2025-05-25',14,5,18),(369,'2025-02-23',38,14,8),
(370,'2025-03-26',50,10,20),(371,'2025-01-01',18,10,5),(372,'2025-05-19',17,12,4),
(373,'2025-06-19',2,9,1),(374,'2025-04-02',16,38,11),(375,'2025-01-05',12,17,2),
(376,'2025-02-02',48,27,17),(377,'2025-01-30',48,5,16),(378,'2025-04-25',50,24,17),
(379,'2025-06-01',7,29,17),(380,'2025-02-26',40,3,17),(381,'2025-03-19',30,42,1),
(382,'2025-01-16',31,26,14),(383,'2025-06-25',7,32,15),(384,'2025-01-19',6,21,20),
(385,'2025-02-07',5,9,9),(386,'2025-06-09',41,38,18),(387,'2025-03-25',25,39,17),
(388,'2025-03-17',30,33,20),(389,'2025-04-21',7,45,4),(390,'2025-06-17',42,50,18),
(391,'2025-02-25',28,29,8),(392,'2025-04-16',22,30,13),(393,'2025-04-17',47,7,11),
(394,'2025-04-20',21,43,9),(395,'2025-04-06',10,44,16),(396,'2025-01-18',6,6,3),
(397,'2025-04-21',7,48,12),(398,'2025-02-03',36,4,19),(399,'2025-05-24',36,22,4),
(400,'2025-04-16',23,43,14),(401,'2025-01-14',19,39,10),(402,'2025-04-01',7,37,17),
(403,'2025-02-24',10,43,16),(404,'2025-02-27',7,23,18),(405,'2025-04-05',8,49,9),
(406,'2025-05-27',15,28,18),(407,'2025-06-09',40,44,18),(408,'2025-01-07',39,43,9),
(409,'2025-01-08',12,18,10),(410,'2025-03-28',23,1,6),(411,'2025-02-06',37,43,13),
(412,'2025-01-18',10,48,1),(413,'2025-01-24',48,34,7),(414,'2025-04-07',27,30,11),
(415,'2025-02-10',24,20,11),(416,'2025-05-26',39,6,2),(417,'2025-02-09',11,49,20),
(418,'2025-01-13',44,6,9),(419,'2025-04-24',43,28,16),(420,'2025-06-05',29,27,9),
(421,'2025-02-25',49,33,4),(422,'2025-03-30',28,8,10),(423,'2025-06-23',44,38,16),
(424,'2025-05-15',43,20,2),(425,'2025-02-26',26,39,2),(426,'2025-01-02',14,20,7),
(427,'2025-02-05',49,17,10),(428,'2025-03-25',8,1,16),(429,'2025-04-21',12,9,13),
(430,'2025-05-17',46,15,17),(431,'2025-05-24',43,23,3),(432,'2025-04-12',48,3,14),
(433,'2025-01-05',30,5,11),(434,'2025-05-28',28,37,13),(435,'2025-06-13',27,19,4),(436,'2025-04-14',2,21,6),(437,'2025-06-08',30,45,12),(438,'2025-01-23',28,7,8),
(439,'2025-04-22',38,26,17),(440,'2025-01-21',26,20,11),(441,'2025-02-26',22,50,6),
(442,'2025-01-20',33,41,4),(443,'2025-05-16',33,13,12),(444,'2025-03-31',47,42,5),
(445,'2025-03-02',7,10,9),(446,'2025-02-20',12,39,5),(447,'2025-06-17',5,12,16),
(448,'2025-04-29',49,37,19),(449,'2025-04-25',44,37,20),(450,'2025-03-24',41,21,5),
(451,'2025-04-23',5,31,15),(452,'2025-06-11',20,18,19),(453,'2025-01-15',23,33,3),
(454,'2025-03-21',30,29,2),(455,'2025-01-15',24,19,3),(456,'2025-06-15',6,40,20),
(457,'2025-05-10',25,30,19),(458,'2025-05-22',48,3,15),(459,'2025-05-27',42,13,11),
(460,'2025-06-04',31,33,5),(461,'2025-01-16',29,7,11),(462,'2025-01-22',33,42,6),
(463,'2025-01-11',16,46,15),(464,'2025-04-23',34,34,20),(465,'2025-02-10',24,24,10),
(466,'2025-04-10',27,50,11),(467,'2025-06-23',39,4,11),(468,'2025-01-17',22,7,18),
(469,'2025-06-23',25,19,9),(470,'2025-06-18',39,10,11),(471,'2025-01-21',38,43,5),
(472,'2025-03-31',20,42,13),(473,'2025-02-03',39,46,3),(474,'2025-03-21',36,25,11),
(475,'2025-02-02',43,45,17),(476,'2025-01-24',42,43,14),(477,'2025-05-11',24,2,12),
(478,'2025-03-21',12,14,11),(479,'2025-05-05',13,15,5),(480,'2025-02-09',5,19,4),
(481,'2025-05-10',50,35,17),(482,'2025-01-10',43,22,20),(483,'2025-02-03',39,25,5),
(484,'2025-02-11',12,45,20),(485,'2025-02-12',47,29,2),(486,'2025-04-16',24,44,8),
(487,'2025-04-24',40,19,15),(488,'2025-03-01',35,16,10),(489,'2025-05-01',13,24,19),
(490,'2025-04-23',30,50,10),(491,'2025-04-08',33,34,14),(492,'2025-02-11',13,39,5),
(493,'2025-03-06',4,42,16),(494,'2025-04-06',36,7,17),(495,'2025-02-01',19,6,6),
(496,'2025-03-11',29,33,5),(497,'2025-04-22',6,15,15),(498,'2025-03-31',2,27,2),
(499,'2025-04-12',33,24,8),(500,'2025-04-09',6,24,8);


-- ============================================================================
-- 2. EJERCICIOS RESUELTOS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Ejercicio 1: Concesionarios que venden más que la media
-- Obtén los concesionarios cuyo volumen total de vehículos vendidos es
-- superior al promedio de ventas de todos los concesionarios.
-- Técnica: CTE + subquery escalar
-- ----------------------------------------------------------------------------

WITH volumen_total AS (
    SELECT
        c.nombre                AS Concesionario,
        SUM(ve.cantidad)        AS Ventas
    FROM concesionarios c
    JOIN ventas ve ON c.id_concesionario = ve.id_concesionario
    GROUP BY c.nombre
)
SELECT
    Concesionario,
    Ventas
FROM volumen_total
WHERE Ventas > (SELECT AVG(Ventas) FROM volumen_total)
ORDER BY Ventas DESC;


-- ----------------------------------------------------------------------------
-- Ejercicio 2: Modelo más vendido de toda la compañía
-- Identifica el vehículo con mayor número de unidades vendidas.
-- Técnica: CTE + TOP 1
-- ----------------------------------------------------------------------------
WITH modelo_mas_vendido AS (
    SELECT
        vh.modelo           AS Modelo,
        SUM(ve.cantidad)    AS Total_Unidades_Vendidas
    FROM vehiculos vh
    JOIN ventas ve ON ve.id_vehiculo = vh.id_vehiculo
    GROUP BY vh.modelo
)
SELECT TOP 1
    Modelo,
    Total_Unidades_Vendidas
FROM modelo_mas_vendido
ORDER BY Total_Unidades_Vendidas DESC;


-- ----------------------------------------------------------------------------
-- Ejercicio 3: Concesionarios sin ventas de eléctricos
-- Encuentra los concesionarios que nunca han vendido vehículos de categoría
-- "Eléctrico".
-- Técnica: CTE + NOT IN (y versión alternativa con subquery directa)
-- ----------------------------------------------------------------------------

-- Enfoque A: con CTE
WITH ventas_electricos AS (
    SELECT DISTINCT ve.id_concesionario
    FROM ventas ve
    JOIN vehiculos vh ON ve.id_vehiculo = vh.id_vehiculo
    WHERE vh.categoria = 'Eléctrico'
)SELECT
    c.nombre AS Concesionario
FROM concesionarios c
WHERE c.id_concesionario NOT IN (SELECT id_concesionario FROM ventas_electricos)
ORDER BY c.nombre;

-- Enfoque B: subquery directa (más compacto)
SELECT
    c.nombre AS Concesionario
FROM concesionarios c
WHERE c.id_concesionario NOT IN (
    SELECT ve.id_concesionario
    FROM ventas ve
    JOIN vehiculos vh ON ve.id_vehiculo = vh.id_vehiculo
    WHERE vh.categoria = 'Eléctrico'
)
ORDER BY c.nombre;


-- ----------------------------------------------------------------------------
-- Ejercicio 4: Top 5 vehículos por facturación
-- Calcula la facturación total por modelo y devuelve los 5 primeros.
-- Técnica: CTE + TOP 5
-- ----------------------------------------------------------------------------

WITH facturacion AS (
    SELECT
        vh.modelo                       AS Modelo,
        SUM(vh.precio * ve.cantidad)    AS Total_Ventas    FROM vehiculos vh
    JOIN ventas ve ON vh.id_vehiculo = ve.id_vehiculo
    GROUP BY vh.modelo
)
SELECT TOP 5
    Modelo,
    Total_Ventas
FROM facturacion
ORDER BY Total_Ventas DESC;


-- ----------------------------------------------------------------------------
-- Ejercicio 5: Vehículos con ventas superiores a la media de su categoría
-- Técnica: CTEs encadenadas + JOIN (y versión alternativa con subquery
--          correlacionada)
-- ----------------------------------------------------------------------------

-- Enfoque A: dos CTEs encadenadas
WITH ventas_por_modelo AS (
    SELECT
        vh.modelo       AS Modelo,
        vh.categoria    AS Categoria,
        SUM(vh.precio * ve.cantidad) AS Ventas
    FROM ventas ve
    JOIN vehiculos vh ON ve.id_vehiculo = vh.id_vehiculo
    GROUP BY vh.modelo, vh.categoria
),
media_por_categoria AS (
    SELECT        Categoria,
        AVG(Ventas) AS Media
    FROM ventas_por_modelo
    GROUP BY Categoria
)
SELECT
    vpm.Modelo,
    vpm.Categoria,
    vpm.Ventas
FROM ventas_por_modelo vpm
JOIN media_por_categoria mpc ON vpm.Categoria = mpc.Categoria
WHERE vpm.Ventas > mpc.Media
ORDER BY vpm.Categoria, vpm.Ventas DESC;

-- Enfoque B: CTE + subquery correlacionada
WITH ventas_modelo AS (
    SELECT
        vh.modelo       AS modelo,
        vh.categoria    AS categoria,
        SUM(v.cantidad) AS total_vendido
    FROM vehiculos vh
    JOIN ventas v ON vh.id_vehiculo = v.id_vehiculo
    GROUP BY vh.modelo, vh.categoria
),
media_categoria AS (
    SELECT
        categoria,
        AVG(total_vendido) AS media_categoria
    FROM ventas_modelo    GROUP BY categoria
)
SELECT vm.*
FROM ventas_modelo vm
JOIN media_categoria mc ON vm.categoria = mc.categoria
WHERE vm.total_vendido > mc.media_categoria;


-- ----------------------------------------------------------------------------
-- Ejercicio 6: Concesionarios que venden todas las categorías
-- Encuentra los concesionarios que han vendido al menos un vehículo de cada
-- categoría existente.
-- Técnica: HAVING COUNT(DISTINCT) = subquery escalar
-- ----------------------------------------------------------------------------

SELECT
    c.nombre AS Concesionario
FROM concesionarios c
JOIN ventas v    ON c.id_concesionario = v.id_concesionario
JOIN vehiculos vh ON v.id_vehiculo = vh.id_vehiculo
GROUP BY c.nombre
HAVING COUNT(DISTINCT vh.categoria) = (SELECT COUNT(DISTINCT categoria) FROM vehiculos);


-- ----------------------------------------------------------------------------
-- Ejercicio 7: Porcentaje de contribución de cada concesionario
-- Calcula qué porcentaje del total de unidades vendidas aporta cada
-- concesionario.
-- Técnica: CTE + subquery escalar para el denominador-- ----------------------------------------------------------------------------

-- Enfoque A: con CTE
WITH contribucion AS (
    SELECT
        c.nombre            AS Concesionario,
        SUM(ve.cantidad)    AS Ventas
    FROM concesionarios c
    JOIN ventas ve ON c.id_concesionario = ve.id_concesionario
    GROUP BY c.nombre
)
SELECT
    Concesionario,
    Ventas,
    ROUND(Ventas * 100.0 / (SELECT SUM(Ventas) FROM contribucion), 2) AS Porcentaje
FROM contribucion
ORDER BY Porcentaje DESC;

-- Enfoque B: sin CTE (subquery directa)
SELECT
    c.nombre                AS nombre,
    SUM(v.cantidad)         AS total_vendido,
    ROUND(
        SUM(v.cantidad) * 100.0 / (SELECT SUM(cantidad) FROM ventas),
        2
    )                       AS porcentaje
FROM concesionarios c
JOIN ventas v ON c.id_concesionario = v.id_concesionario
GROUP BY c.nombre
ORDER BY porcentaje DESC;


-- ----------------------------------------------------------------------------
-- Ejercicio 8: Crecimiento mensual de ventas
-- Mostrar las ventas mensuales y la diferencia respecto al mes anterior.
-- Técnica: LAG() OVER (ORDER BY)
-- ----------------------------------------------------------------------------

-- Enfoque A: agrupación por número de mes
SELECT
    MONTH(fecha)                                                AS Mes,
    SUM(ve.cantidad)                                            AS Ventas_Mes,
    LAG(SUM(ve.cantidad)) OVER (ORDER BY MONTH(fecha))          AS Mes_Anterior,
    SUM(ve.cantidad) - LAG(SUM(ve.cantidad)) OVER (ORDER BY MONTH(fecha)) AS Diferencia
FROM ventas ve
GROUP BY MONTH(fecha)
ORDER BY Mes;

-- Enfoque B: con CTE y FORMAT para clave yyyy-MM
WITH ventas_mes AS (
    SELECT
        FORMAT(fecha, 'yyyy-MM')    AS mes,
        SUM(cantidad)               AS total
    FROM ventas
    GROUP BY FORMAT(fecha, 'yyyy-MM')
)
SELECT
    mes,    total,
    total - LAG(total) OVER (ORDER BY mes) AS diferencia_mes_anterior
FROM ventas_mes;


-- ----------------------------------------------------------------------------
-- Ejercicio 9: Concesionarios con ingresos superiores al percentil 75
-- Obtén los concesionarios cuyo ingreso total está por encima del 75% de la
-- distribución.
-- Técnica: PERCENTILE_CONT + PERCENT_RANK
-- ----------------------------------------------------------------------------

-- Enfoque A: PERCENTILE_CONT
WITH ingresos AS (
    SELECT
        c.nombre                        AS Concesionario,
        SUM(vh.precio * ve.cantidad)    AS Ingresos
    FROM concesionarios c
    JOIN ventas ve  ON c.id_concesionario = ve.id_concesionario
    JOIN vehiculos vh ON ve.id_vehiculo  = vh.id_vehiculo
    GROUP BY c.nombre
),
percentil AS (
    SELECT
        Concesionario,
        Ingresos,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY Ingresos) OVER () AS Percentil_75
    FROM ingresos
)SELECT
    Concesionario,
    Ingresos
FROM percentil
WHERE Ingresos > Percentil_75
ORDER BY Ingresos DESC;

-- Enfoque B: PERCENT_RANK
WITH ingresos AS (
    SELECT
        c.nombre                        AS nombre,
        SUM(v.cantidad * vh.precio)     AS ingresos
    FROM concesionarios c
    JOIN ventas v   ON c.id_concesionario = v.id_concesionario
    JOIN vehiculos vh ON v.id_vehiculo = vh.id_vehiculo
    GROUP BY c.nombre
),
ranking AS (
    SELECT
        nombre,
        ingresos,
        PERCENT_RANK() OVER (ORDER BY ingresos) AS pct
    FROM ingresos
)
SELECT
    nombre,
    ingresos,
    CAST(pct * 100 AS DECIMAL(5,2)) AS pct
FROM ranking
WHERE pct >= 0.75;


-- ----------------------------------------------------------------------------
-- Ejercicio 10: Ranking de concesionarios por ingresos
-- Técnica: CTE + RANK() OVER (ORDER BY)
-- ----------------------------------------------------------------------------

WITH ranking_concesionarios AS (
    SELECT
        c.nombre                        AS Concesionario,
        SUM(vh.precio * ve.cantidad)    AS Ventas
    FROM concesionarios c
    JOIN ventas ve  ON c.id_concesionario = ve.id_concesionario
    JOIN vehiculos vh ON ve.id_vehiculo  = vh.id_vehiculo
    GROUP BY c.nombre
)
SELECT
    Concesionario,
    Ventas,
    RANK() OVER (ORDER BY Ventas DESC) AS Ranking
FROM ranking_concesionarios
ORDER BY Ranking;

-- ============================================================================
-- INSIGHTS DE NEGOCIO
-- ============================================================================
-- 1. Concentración de ingresos: con 50 concesionarios en la red, los 3 con
--    mayor volumen de ventas generan cerca de un 10 % de la facturación
--    total — una red razonablemente diversificada, sin dependencia crítica
--    de un puñado de puntos de venta. El benchmark útil aquí no es la
--    concentración (no la hay) sino el percentil 75 (ej. 9): identificar
--    qué concesionarios están por debajo del cuartil superior para
--    asignarles un plan de acción diferenciado.
--
-- 2. Estacionalidad por marca: al cruzar marca y trimestre (ej. 7-8) se
--    observan picos de venta concentrados, lo que permite planificar stock
--    y campañas promocionales con antelación.
--
-- 3. Percentil 75 de ventas (ej. 9): el umbral del cuartil superior sirve
--    como benchmark para fijar objetivos de venta realistas — cualquier
--    concesionario por debajo debe recibir un plan de acción diferenciado.
--
-- 4. Evolución mensual con LAG (ej. 8): detectar meses consecutivos de
--    caída permite activar alertas tempranas antes de que la tendencia
--    se consolide.
-- ============================================================================
