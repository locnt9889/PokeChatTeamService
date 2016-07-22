-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 22, 2016 at 06:46 AM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 5.5.37

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
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `accountId` int(8) NOT NULL,
  `facebookId` varchar(255) NOT NULL,
  `facebookEmail` varchar(255) NOT NULL,
  `facebookToken` varchar(255) NOT NULL,
  `fullname` varchar(1024) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birthday` date NOT NULL,
  `gender` tinyint(1) NOT NULL,
  `avatarImage` varchar(1024) NOT NULL,
  `coverImage` varchar(1024) NOT NULL,
  `gpsLongitude` float NOT NULL,
  `gpsLatitude` float NOT NULL,
  `isActive` tinyint(4) NOT NULL,
  `added` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `isUpdatedInfo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`accountId`, `facebookId`, `facebookEmail`, `facebookToken`, `fullname`, `phone`, `email`, `password`, `birthday`, `gender`, `avatarImage`, `coverImage`, `gpsLongitude`, `gpsLatitude`, `isActive`, `added`, `updated`, `isUpdatedInfo`) VALUES
(1, '', '', '', '', '', 'locnt@gmail.com', 'fcea920f7412b5da7be0cf42b8c93759', '0000-00-00', 0, '', '', 0, 0, 1, '2016-07-21 19:29:31', '2016-07-21 19:29:31', 0);

-- --------------------------------------------------------

--
-- Table structure for table `accounts_device`
--

CREATE TABLE `accounts_device` (
  `id` int(8) NOT NULL,
  `accountId` int(8) NOT NULL,
  `deviceToken` varchar(255) NOT NULL,
  `deviceType` varchar(255) NOT NULL,
  `accessToken` varchar(255) NOT NULL,
  `isOnline` tinyint(4) NOT NULL,
  `isActive` tinyint(4) NOT NULL,
  `added` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `accounts_phone_contact`
--

CREATE TABLE `accounts_phone_contact` (
  `id` int(8) NOT NULL,
  `accountId` int(8) NOT NULL,
  `value` varchar(255) NOT NULL,
  `isActive` tinyint(4) NOT NULL,
  `added` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Persons`
--

CREATE TABLE `Persons` (
  `id` int(11) NOT NULL,
  `name` varchar(1024) NOT NULL,
  `email` varchar(1024) NOT NULL,
  `birthday` date NOT NULL DEFAULT '0000-00-00',
  `isActive` tinyint(2) NOT NULL,
  `added` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Persons`
--

INSERT INTO `Persons` (`id`, `name`, `email`, `birthday`, `isActive`, `added`, `updated`) VALUES
(1, 'hello1', 'hell2o', '0000-00-00', 1, '2016-07-14 07:25:35', '2016-07-20 10:39:51'),
(2, 'string', 'string', '0000-00-00', 1, '2016-07-14 07:26:49', '2016-07-14 07:26:49'),
(3, 'string', 'string', '0000-00-00', 1, '2016-07-14 07:27:13', '2016-07-14 07:27:13'),
(4, 'string', 'string', '0000-00-00', 1, '2016-07-14 07:29:26', '2016-07-14 07:29:26'),
(5, '', '', '0000-00-00', 1, '2016-07-14 07:30:42', '2016-07-14 07:30:42'),
(6, '', '', '0000-00-00', 1, '2016-07-14 07:33:44', '2016-07-14 07:33:44'),
(7, 'loc', 'locnt@gmail.com', '1989-08-09', 1, '2016-07-14 07:33:57', '2016-07-14 07:33:57'),
(8, 'duc', 'duc@gmail.com', '2016-04-25', 1, '2016-07-14 07:34:22', '2016-07-14 07:34:22'),
(9, 'Nguyen Tien Loc', 'nguyentienloc.it@gmail.com', '0000-00-00', 1, '2016-07-14 08:00:17', '2016-07-14 08:00:17'),
(10, 'Nguyen Tien Loc', 'nguyentienloc.it@gmail.com', '0000-00-00', 1, '2016-07-14 08:05:20', '2016-07-14 08:05:20'),
(11, 'Nguyen Tien Loc', 'nguyentienloc.it@gmail.com', '0000-00-00', 1, '2016-07-14 08:05:37', '2016-07-14 08:05:37'),
(12, 'Nguyen Tien Loc', 'nguyentienloc.it@gmail.com', '0000-00-00', 1, '2016-07-14 08:05:39', '2016-07-14 08:05:39'),
(13, 'Nguyen Tien Loc', 'nguyentienloc.it@gmail.com', '0000-00-00', 1, '2016-07-14 08:05:43', '2016-07-14 08:05:43'),
(14, 'Nguyen Tien Loc', 'nguyentienloc.it@gmail.com', '0000-00-00', 1, '2016-07-14 08:06:50', '2016-07-14 08:06:50'),
(15, 'jjo', 'okpop', '0000-00-00', 1, '2016-07-14 08:07:15', '2016-07-14 08:07:15'),
(16, 'jjo', 'okpop', '0000-00-00', 1, '2016-07-14 08:07:48', '2016-07-14 08:07:48'),
(17, 'dasd', 'dasdasdad', '0000-00-00', 1, '2016-07-14 08:12:30', '2016-07-14 08:12:30'),
(18, 'dasd', 'dasdasdad', '0000-00-00', 1, '2016-07-14 08:13:18', '2016-07-14 08:13:18'),
(19, 'dasd', 'dasdasdad', '0000-00-00', 1, '2016-07-14 08:14:47', '2016-07-14 08:14:47'),
(20, 's', 'd', '0000-00-00', 1, '2016-07-14 08:17:52', '2016-07-14 08:17:52'),
(21, 'sd', 'dasd', '0000-00-00', 1, '2016-07-14 08:20:41', '2016-07-14 08:20:41'),
(22, 'da', 'fasf', '0000-00-00', 1, '2016-07-14 08:24:17', '2016-07-14 08:24:17'),
(23, 'da', 'fasf', '0000-00-00', 1, '2016-07-14 08:24:26', '2016-07-14 08:24:26'),
(24, 'dasd', 'aada', '0000-00-00', 1, '2016-07-14 08:26:40', '2016-07-14 08:26:40'),
(25, '', '', '0000-00-00', 1, '2016-07-14 08:28:48', '2016-07-14 08:28:48'),
(26, '', '', '0000-00-00', 1, '2016-07-14 08:29:52', '2016-07-14 08:29:52'),
(27, 'duc', 'duc@gmail.com', '2016-04-25', 1, '2016-07-14 08:51:34', '2016-07-14 08:51:34'),
(28, '', '', '0000-00-00', 1, '2016-07-14 09:04:55', '2016-07-14 09:04:55'),
(29, 'string', 'string', '2016-01-01', 1, '2016-07-14 09:06:06', '2016-07-14 09:06:06'),
(30, 'string', 'string', '0000-00-00', 1, '2016-07-20 10:38:29', '2016-07-20 10:38:29'),
(31, 'string', 'string', '0000-00-00', 1, '2016-07-20 10:39:06', '2016-07-20 10:39:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`accountId`);

--
-- Indexes for table `accounts_device`
--
ALTER TABLE `accounts_device`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `accounts_phone_contact`
--
ALTER TABLE `accounts_phone_contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Persons`
--
ALTER TABLE `Persons`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `accountId` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `accounts_device`
--
ALTER TABLE `accounts_device`
  MODIFY `id` int(8) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `accounts_phone_contact`
--
ALTER TABLE `accounts_phone_contact`
  MODIFY `id` int(8) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Persons`
--
ALTER TABLE `Persons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
