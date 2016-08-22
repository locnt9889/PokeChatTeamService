-- phpMyAdmin SQL Dump
-- version 4.4.15.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 22, 2016 at 03:02 PM
-- Server version: 5.5.46
-- PHP Version: 5.4.45

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `poke_team_chat_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat_group`
--

CREATE TABLE IF NOT EXISTS `chat_group` (
  `id` int(11) NOT NULL,
  `uuid` varchar(100) NOT NULL,
  `groupName` varchar(100) NOT NULL,
  `createdUserId` int(11) NOT NULL,
  `isActive` tinyint(4) NOT NULL,
  `added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `chat_group_member`
--

CREATE TABLE IF NOT EXISTS `chat_group_member` (
  `id` int(11) NOT NULL,
  `group_uuid` varchar(100) NOT NULL,
  `accountId` int(11) NOT NULL,
  `isShowGps` tinyint(4) NOT NULL,
  `added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `chat_group_message`
--

CREATE TABLE IF NOT EXISTS `chat_group_message` (
  `id` int(11) NOT NULL,
  `uuid` varchar(100) NOT NULL,
  `groupUuid` varchar(100) NOT NULL,
  `accountId` int(11) NOT NULL,
  `messageType` varchar(20) NOT NULL,
  `messageValue` varchar(1000) NOT NULL,
  `mediaType` varchar(20) NOT NULL,
  `isActive` tinyint(4) NOT NULL,
  `added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat_group`
--
ALTER TABLE `chat_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid` (`uuid`);

--
-- Indexes for table `chat_group_member`
--
ALTER TABLE `chat_group_member`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat_group_message`
--
ALTER TABLE `chat_group_message`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid` (`uuid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat_group`
--
ALTER TABLE `chat_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `chat_group_member`
--
ALTER TABLE `chat_group_member`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `chat_group_message`
--
ALTER TABLE `chat_group_message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
