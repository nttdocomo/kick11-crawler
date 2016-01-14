-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2016-01-11 15:44:15
-- 服务器版本： 5.6.21
-- PHP Version: 5.6.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kickeleven`
--

-- --------------------------------------------------------

--
-- 表的结构 `event_standings`
--

CREATE TABLE `event_standings` (
  `id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `event_standing_entries`
--

CREATE TABLE `event_standing_entries` (
  `id` int(10) UNSIGNED NOT NULL,
  `event_standing_id` int(10) UNSIGNED NOT NULL,
  `team_id` int(10) UNSIGNED NOT NULL,
  `pos` tinyint(3) UNSIGNED NOT NULL DEFAULT '1',
  `played` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `won` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `lost` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `drawn` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `goals_for` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `goals_against` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `pts` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `event_standings`
--
ALTER TABLE `event_standings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_standing_entries`
--
ALTER TABLE `event_standing_entries`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `event_standings`
--
ALTER TABLE `event_standings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `event_standing_entries`
--
ALTER TABLE `event_standing_entries`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
