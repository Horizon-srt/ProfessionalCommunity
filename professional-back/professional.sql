/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80028
 Source Host           : localhost:3306
 Source Schema         : professional

 Target Server Type    : MySQL
 Target Server Version : 80028
 File Encoding         : 65001

 Date: 03/04/2024 20:16:09
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `aid` int NOT NULL AUTO_INCREMENT,
  `building` varchar(255) DEFAULT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `room` varchar(255) DEFAULT NULL,
  `uid` int DEFAULT NULL,
  PRIMARY KEY (`aid`),
  KEY `address_user` (`uid`),
  CONSTRAINT `address_user` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for alert
-- ----------------------------
DROP TABLE IF EXISTS `alert`;
CREATE TABLE `alert` (
  `alert_id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `value` int DEFAULT NULL,
  `aid` int DEFAULT NULL,
  PRIMARY KEY (`alert_id`),
  KEY `alert_address` (`aid`),
  CONSTRAINT `alert_address` FOREIGN KEY (`aid`) REFERENCES `address` (`aid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for ebook
-- ----------------------------
DROP TABLE IF EXISTS `ebook`;
CREATE TABLE `ebook` (
  `bid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `content` blob,
  `cover` longblob,
  `description` varchar(255) DEFAULT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `uid` int DEFAULT NULL,
  PRIMARY KEY (`bid`),
  KEY `ebook_user` (`uid`),
  CONSTRAINT `ebook_user` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for enterprise_user
-- ----------------------------
DROP TABLE IF EXISTS `enterprise_user`;
CREATE TABLE `enterprise_user` (
  `uid` int NOT NULL,
  `ename` varchar(255) DEFAULT NULL,
  `description` blob,
  `cover` longblob,
  PRIMARY KEY (`uid`),
  CONSTRAINT `enterprise_user` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for fixed_service
-- ----------------------------
DROP TABLE IF EXISTS `fixed_service`;
CREATE TABLE `fixed_service` (
  `sid` int NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `map` varchar(255) DEFAULT NULL,
  `video` longblob,
  PRIMARY KEY (`sid`),
  CONSTRAINT `fixed_service` FOREIGN KEY (`sid`) REFERENCES `service` (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for guide
-- ----------------------------
DROP TABLE IF EXISTS `guide`;
CREATE TABLE `guide` (
  `gid` int NOT NULL AUTO_INCREMENT,
  `author` varchar(255) DEFAULT NULL,
  `content` blob,
  `date` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `cover` longblob,
  `uid` int DEFAULT NULL,
  PRIMARY KEY (`gid`),
  KEY `guide_user` (`uid`),
  CONSTRAINT `guide_user` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for hire
-- ----------------------------
DROP TABLE IF EXISTS `hire`;
CREATE TABLE `hire` (
  `hid` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` blob,
  `start_time` varchar(255) DEFAULT NULL,
  `end_time` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `uid` int DEFAULT NULL,
  PRIMARY KEY (`hid`),
  KEY `hire_user` (`uid`),
  CONSTRAINT `hire_user` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for label_ebook
-- ----------------------------
DROP TABLE IF EXISTS `label_ebook`;
CREATE TABLE `label_ebook` (
  `bid` int NOT NULL,
  `label` varchar(255) NOT NULL,
  PRIMARY KEY (`bid`,`label`),
  CONSTRAINT `label_ebook` FOREIGN KEY (`bid`) REFERENCES `ebook` (`bid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for normal_user
-- ----------------------------
DROP TABLE IF EXISTS `normal_user`;
CREATE TABLE `normal_user` (
  `uid` int NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `proof` longblob,
  PRIMARY KEY (`uid`),
  CONSTRAINT `normal_user` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for notify
-- ----------------------------
DROP TABLE IF EXISTS `notify`;
CREATE TABLE `notify` (
  `nid` int NOT NULL AUTO_INCREMENT,
  `content` blob,
  `title` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `uid` int DEFAULT NULL,
  PRIMARY KEY (`nid`),
  KEY `notify_user` (`uid`),
  CONSTRAINT `notify_user` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for ondoor_service
-- ----------------------------
DROP TABLE IF EXISTS `ondoor_service`;
CREATE TABLE `ondoor_service` (
  `sid` int NOT NULL,
  `line` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`sid`),
  CONSTRAINT `ondoor_service` FOREIGN KEY (`sid`) REFERENCES `service` (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for reading_record
-- ----------------------------
DROP TABLE IF EXISTS `reading_record`;
CREATE TABLE `reading_record` (
  `rrid` int NOT NULL AUTO_INCREMENT,
  `page` int DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `bid` int DEFAULT NULL,
  `uid` int DEFAULT NULL,
  PRIMARY KEY (`rrid`),
  KEY `reading_record` (`bid`),
  KEY `reading_record_user` (`uid`),
  CONSTRAINT `reading_record` FOREIGN KEY (`bid`) REFERENCES `ebook` (`bid`),
  CONSTRAINT `reading_record_user` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for resource
-- ----------------------------
DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource` (
  `resource_id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `value` int DEFAULT NULL,
  `year` varchar(255) DEFAULT NULL,
  `month` varchar(255) DEFAULT NULL,
  `aid` int DEFAULT NULL,
  PRIMARY KEY (`resource_id`),
  KEY `resource_address` (`aid`),
  CONSTRAINT `resource_address` FOREIGN KEY (`aid`) REFERENCES `address` (`aid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for resume
-- ----------------------------
DROP TABLE IF EXISTS `resume`;
CREATE TABLE `resume` (
  `resume_id` int NOT NULL AUTO_INCREMENT,
  `content` blob,
  `position` varchar(255) DEFAULT NULL,
  `hid` int DEFAULT NULL,
  `uid` int DEFAULT NULL,
  PRIMARY KEY (`resume_id`),
  KEY `resume_user` (`uid`),
  KEY `resume_hire` (`hid`),
  CONSTRAINT `resume_hire` FOREIGN KEY (`hid`) REFERENCES `hire` (`hid`),
  CONSTRAINT `resume_user` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for service
-- ----------------------------
DROP TABLE IF EXISTS `service`;
CREATE TABLE `service` (
  `sid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `cover` longblob,
  `available` varchar(255) DEFAULT NULL,
  `detail` blob,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for service_record
-- ----------------------------
DROP TABLE IF EXISTS `service_record`;
CREATE TABLE `service_record` (
  `srid` int NOT NULL AUTO_INCREMENT,
  `time` varchar(255) DEFAULT NULL,
  `detail` blob,
  `sid` int DEFAULT NULL,
  `aid` int DEFAULT NULL,
  PRIMARY KEY (`srid`),
  KEY `service_record` (`sid`),
  KEY `service_record_address` (`aid`),
  CONSTRAINT `service_record` FOREIGN KEY (`sid`) REFERENCES `service` (`sid`),
  CONSTRAINT `service_record_address` FOREIGN KEY (`aid`) REFERENCES `address` (`aid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avator` longblob,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
