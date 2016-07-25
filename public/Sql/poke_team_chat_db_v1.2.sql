-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 25, 2016 at 04:41 PM
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
  `gender` varchar(255) NOT NULL,
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
(1, '', '', '', '', '', 'locnt@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '0000-00-00', '0', '', '', 0, 0, 1, '2016-07-21 19:29:31', '2016-07-25 09:25:31', 0),
(2, '101309679870980512', 'quatangbanthan@yahoo.com', 'EAAXMdUm5zJcBAIcZA2hrRCq3EBe7faQVr4An6c188dpgQ1hD6s6B65FZBQwZCy65yVi8JECJh8gx7makllZBLPd67nhuZCsQagj4YrJiuZBKZCUVQCNfbX15XEljJjE4VJUyv1GCw4xaZAXQIKZBLT77Sp4ofCf5jTCHYWDPOKHx7twZDZD', 'Nguyen Duc Thuan', '', '', '', '0000-00-00', 'MALE', 'https://graph.facebook.com/1013096798709805/picture?type=large', '', 0, 0, 1, '2016-07-25 14:22:43', '2016-07-25 14:31:41', 0),
(3, '1013096798709805w333', 'quatangbanthan@yahoo.com', 'EAAXMdUm5zJcBAIcZA2hrRCq3EBe7faQVr4An6c188dpgQ1hD6s6B65FZBQwZCy65yVi8JECJh8gx7makllZBLPd67nhuZCsQagj4YrJiuZBKZCUVQCNfbX15XEljJjE4VJUyv1GCw4xaZAXQIKZBLT77Sp4ofCf5jTCHYWDPOKHx7twZDZD', 'Nguyen Duc Thuan', '', '', '', '0000-00-00', 'MALE', 'https://graph.facebook.com/1013096798709805/picture?type=large', '', 0, 0, 1, '2016-07-25 14:31:58', '2016-07-25 14:33:22', 0),
(4, '101309679870980543', 'quatangbanthan@yahoo.com', 'EAAXMdUm5zJcBAIcZA2hrRCq3EBe7faQVr4An6c188dpgQ1hD6s6B65FZBQwZCy65yVi8JECJh8gx7makllZBLPd67nhuZCsQagj4YrJiuZBKZCUVQCNfbX15XEljJjE4VJUyv1GCw4xaZAXQIKZBLT77Sp4ofCf5jTCHYWDPOKHx7twZDZD', 'Nguyen Duc Thuan', '', '', '', '0000-00-00', 'MALE', 'https://graph.facebook.com/1013096798709805/picture?type=large', '', 0, 0, 1, '2016-07-25 14:33:34', '2016-07-25 14:36:29', 0),
(5, '1013096798709805', 'quatangbanthan@yahoo.com', 'EAAXMdUm5zJcBAIcZA2hrRCq3EBe7faQVr4An6c188dpgQ1hD6s6B65FZBQwZCy65yVi8JECJh8gx7makllZBLPd67nhuZCsQagj4YrJiuZBKZCUVQCNfbX15XEljJjE4VJUyv1GCw4xaZAXQIKZBLT77Sp4ofCf5jTCHYWDPOKHx7twZDZD', 'Nguyen Duc Thuan', '', '', '', '0000-00-00', 'MALE', 'https://graph.facebook.com/1013096798709805/picture?type=large', '', 0, 0, 1, '2016-07-25 14:36:41', '2016-07-25 14:36:41', 0);

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

--
-- Dumping data for table `accounts_device`
--

INSERT INTO `accounts_device` (`id`, `accountId`, `deviceToken`, `deviceType`, `accessToken`, `isOnline`, `isActive`, `added`, `updated`) VALUES
(1, 1, 'deviceToken-string', 'iOS', 'cd9f53c0-5249-11e6-9bca-95a1e69cb789', 0, 1, '2016-07-25 09:26:01', '2016-07-25 09:26:01'),
(2, 1, 'deviceToken-string', 'Android', 'feee2910-5249-11e6-87d6-cb800389169e', 0, 1, '2016-07-25 09:27:24', '2016-07-25 09:27:24'),
(3, 2, 'string', 'iOS', '2b621130-5274-11e6-95d0-ed23da0482c0', 0, 1, '2016-07-25 14:29:17', '2016-07-25 14:29:17'),
(4, 4, 'string', 'iOS', '2438eae0-5275-11e6-95d0-ed23da0482c0', 0, 1, '2016-07-25 14:36:15', '2016-07-25 14:36:15'),
(5, 5, 'string', 'iOS', '9afcf860-5275-11e6-a419-3378edd63625', 0, 1, '2016-07-25 14:39:34', '2016-07-25 14:39:34');

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
  MODIFY `accountId` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `accounts_device`
--
ALTER TABLE `accounts_device`
  MODIFY `id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
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
