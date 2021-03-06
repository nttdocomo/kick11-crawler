-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2015-12-17 11:23:50
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
-- 表的结构 `city`
--

CREATE TABLE `city` (
  `id` int(10) UNSIGNED NOT NULL,
  `city_name` varchar(60) NOT NULL,
  `nation_id` int(10) UNSIGNED NOT NULL,
  `capital` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `citytranslation`
--

CREATE TABLE `citytranslation` (
  `id` int(10) UNSIGNED NOT NULL,
  `city_name` varchar(60) NOT NULL,
  `city_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `club`
--

CREATE TABLE `club` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(40) NOT NULL,
  `foundation` date DEFAULT NULL,
  `nation_id` tinyint(3) UNSIGNED DEFAULT NULL,
  `logo_id` int(10) UNSIGNED DEFAULT NULL COMMENT 'fm logo id',
  `home_kit` char(37) DEFAULT NULL,
  `away_kit` char(37) DEFAULT NULL,
  `third_kit` char(37) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='俱乐部';

-- --------------------------------------------------------

--
-- 表的结构 `clubtranslation`
--

CREATE TABLE `clubtranslation` (
  `id` int(10) UNSIGNED NOT NULL,
  `language_code` char(5) NOT NULL,
  `name` varchar(60) NOT NULL,
  `club` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `competition`
--

CREATE TABLE `competition` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `code` varchar(4) DEFAULT NULL,
  `nation_id` tinyint(3) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- 表的结构 `competition_category`
--

CREATE TABLE `competition_category` (
  `id` tinyint(2) UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `competition_type`
--

CREATE TABLE `competition_type` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `continent`
--

CREATE TABLE `continent` (
  `id` tinyint(1) UNSIGNED NOT NULL,
  `name` varchar(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='大洲';

-- --------------------------------------------------------

--
-- 表的结构 `event`
--

CREATE TABLE `event` (
  `id` int(10) UNSIGNED NOT NULL,
  `competition_id` int(10) UNSIGNED NOT NULL,
  `season_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `event_team`
--

CREATE TABLE `event_team` (
  `id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `team_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `fm_player`
--

CREATE TABLE `fm_player` (
  `id` int(10) UNSIGNED NOT NULL,
  `fm_player_id` int(10) UNSIGNED NOT NULL,
  `player_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `goal_events`
--

CREATE TABLE `goal_events` (
  `id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `penalty` tinyint(1) NOT NULL DEFAULT '0',
  `owngoal` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `match`
--

CREATE TABLE `match` (
  `id` int(10) UNSIGNED NOT NULL,
  `round_id` int(10) UNSIGNED NOT NULL,
  `team1_id` smallint(5) UNSIGNED NOT NULL,
  `team2_id` smallint(5) UNSIGNED NOT NULL,
  `play_at` datetime NOT NULL,
  `score1` tinyint(3) UNSIGNED DEFAULT NULL,
  `score2` tinyint(3) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `match_event`
--

CREATE TABLE `match_event` (
  `id` int(10) UNSIGNED NOT NULL,
  `player_id` mediumint(8) UNSIGNED DEFAULT '0',
  `match_id` int(10) UNSIGNED NOT NULL,
  `team_id` int(10) UNSIGNED NOT NULL,
  `minute` tinyint(3) UNSIGNED NOT NULL,
  `offset` tinyint(2) UNSIGNED NOT NULL DEFAULT '0',
  `event_type_id` tinyint(3) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `match_event_type`
--

CREATE TABLE `match_event_type` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `displayName` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `match_player_statistics`
--

CREATE TABLE `match_player_statistics` (
  `id` int(10) UNSIGNED NOT NULL,
  `wSName` varchar(30) DEFAULT NULL,
  `playerId` mediumint(8) UNSIGNED NOT NULL,
  `age` tinyint(3) UNSIGNED DEFAULT '0',
  `isManOfTheMatch` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `isOpta` tinyint(1) NOT NULL DEFAULT '0',
  `positionText` varchar(30) DEFAULT NULL,
  `teamId` smallint(5) UNSIGNED NOT NULL,
  `regionCode` varchar(30) DEFAULT NULL,
  `rating` float(4,2) DEFAULT NULL,
  `positionOrder` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `shotOnTarget` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `shotsTotal` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `shotBlocked` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `passLongBallAccurate` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `passLongBallTotal` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `passTotal` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `passCrossAccurate` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `passCrossTotal` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `passThroughBallTotal` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `passThroughBallAccurate` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `keyPassTotal` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `dribbleWon` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `dribbleTotal` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `tackleWon` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `tackleLost` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `tackleWonTotal` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `tackleTotalAttempted` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `challengeLost` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `interceptionLost` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `interceptionAll` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `clearanceTotal` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `offsideGiven` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `offsideProvoked` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `foulGiven` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `foulCommitted` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `turnover` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `dispossessed` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `duelAerialWon` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `duelAerialTotal` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `touches` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `totalPasses` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `passSuccessInMatch` float(5,2) DEFAULT NULL,
  `matchId` mediumint(8) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `match_registration`
--

CREATE TABLE `match_registration` (
  `id` int(10) UNSIGNED NOT NULL,
  `match_id` int(10) UNSIGNED NOT NULL,
  `player_id` int(10) UNSIGNED NOT NULL,
  `shirt_no` tinyint(3) UNSIGNED DEFAULT NULL,
  `team_id` int(10) UNSIGNED NOT NULL,
  `is_first_eleven` tinyint(1) NOT NULL DEFAULT '0',
  `is_man_of_the_match` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `nation`
--

CREATE TABLE `nation` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `name` varchar(60) NOT NULL,
  `continent_id` tinyint(3) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='国家';

-- --------------------------------------------------------

--
-- 表的结构 `nationality`
--

CREATE TABLE `nationality` (
  `id` int(10) UNSIGNED NOT NULL,
  `country_id` int(10) UNSIGNED NOT NULL,
  `player_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='球员国籍';

-- --------------------------------------------------------

--
-- 表的结构 `nationtranslation`
--

CREATE TABLE `nationtranslation` (
  `id` int(10) UNSIGNED NOT NULL,
  `language_code` char(5) NOT NULL,
  `full_name` varchar(60) NOT NULL,
  `short_name` varchar(30) NOT NULL,
  `capital_city` varchar(60) NOT NULL,
  `nationality` varchar(30) NOT NULL,
  `nation_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `player`
--

CREATE TABLE `player` (
  `id` mediumint(6) UNSIGNED NOT NULL,
  `name` varchar(60) NOT NULL,
  `date_of_birth` date NOT NULL,
  `height` tinyint(3) UNSIGNED DEFAULT NULL,
  `weight` tinyint(4) UNSIGNED DEFAULT NULL,
  `foot` char(5) NOT NULL DEFAULT 'right',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='球员';

-- --------------------------------------------------------

--
-- 表的结构 `player2position`
--

CREATE TABLE `player2position` (
  `id` int(10) UNSIGNED NOT NULL,
  `player_id` int(10) UNSIGNED NOT NULL,
  `position_id` tinyint(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='球员位置';

-- --------------------------------------------------------

--
-- 表的结构 `playertranslation`
--

CREATE TABLE `playertranslation` (
  `id` int(10) UNSIGNED NOT NULL,
  `player` int(10) UNSIGNED NOT NULL,
  `language_code` char(6) NOT NULL,
  `full_name` varchar(60) NOT NULL,
  `short_name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `position`
--

CREATE TABLE `position` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='位置';

-- --------------------------------------------------------

--
-- 表的结构 `registrationprofile`
--

CREATE TABLE `registrationprofile` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `activation_key` char(41) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `round`
--

CREATE TABLE `round` (
  `id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `round` int(2) UNSIGNED NOT NULL,
  `start_at` date DEFAULT NULL,
  `end_at` date DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `season`
--

CREATE TABLE `season` (
  `id` int(10) UNSIGNED NOT NULL,
  `year` int(11) NOT NULL,
  `title` char(5) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) NOT NULL,
  `atime` datetime NOT NULL,
  `data` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `tables`
--

CREATE TABLE `tables` (
  `id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `team_id` int(10) UNSIGNED NOT NULL,
  `wins` tinyint(2) UNSIGNED DEFAULT NULL,
  `draws` tinyint(2) UNSIGNED DEFAULT NULL,
  `loses` tinyint(2) UNSIGNED DEFAULT NULL,
  `goals_for` tinyint(2) UNSIGNED DEFAULT NULL,
  `goals_against` tinyint(2) UNSIGNED DEFAULT NULL,
  `init_point` int(10) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `team`
--

CREATE TABLE `team` (
  `id` int(10) UNSIGNED NOT NULL,
  `club` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否是俱乐部',
  `national` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否是国家队',
  `name` varchar(40) NOT NULL,
  `country_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `teamplayer`
--

CREATE TABLE `teamplayer` (
  `id` int(10) UNSIGNED NOT NULL,
  `team_id` int(4) UNSIGNED NOT NULL,
  `player_id` int(6) UNSIGNED NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfer`
--

CREATE TABLE `transfer` (
  `id` int(11) UNSIGNED NOT NULL,
  `taking_team_id` smallint(6) UNSIGNED NOT NULL,
  `releasing_team_id` smallint(6) UNSIGNED NOT NULL,
  `season` int(4) UNSIGNED NOT NULL,
  `transfer_date` date NOT NULL,
  `transfer_sum` int(11) UNSIGNED DEFAULT NULL,
  `player_id` int(6) UNSIGNED NOT NULL,
  `contract_period` date DEFAULT NULL,
  `loan` char(3) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarket_club`
--

CREATE TABLE `transfermarket_club` (
  `club_name` varchar(60) NOT NULL,
  `foundation` date DEFAULT NULL,
  `id` int(6) UNSIGNED NOT NULL,
  `profile_uri` varchar(78) DEFAULT NULL,
  `nation_id` int(5) UNSIGNED DEFAULT NULL,
  `club_ref_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='俱乐部';

-- --------------------------------------------------------

--
-- 表的结构 `transfermarket_competition_category`
--

CREATE TABLE `transfermarket_competition_category` (
  `id` tinyint(2) UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarket_competition_level`
--

CREATE TABLE `transfermarket_competition_level` (
  `id` int(10) UNSIGNED NOT NULL,
  `type_name` char(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarket_competition_team`
--

CREATE TABLE `transfermarket_competition_team` (
  `team_id` int(10) UNSIGNED NOT NULL,
  `competition_id` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarket_position`
--

CREATE TABLE `transfermarket_position` (
  `id` tinyint(2) UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='位置';

-- --------------------------------------------------------

--
-- 表的结构 `transfermarket_team_player`
--

CREATE TABLE `transfermarket_team_player` (
  `id` int(10) UNSIGNED NOT NULL,
  `team_id` int(10) UNSIGNED NOT NULL,
  `player_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_competition`
--

CREATE TABLE `transfermarkt_competition` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` char(60) NOT NULL,
  `code` char(10) NOT NULL,
  `nation_id` int(4) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_competition_competition`
--

CREATE TABLE `transfermarkt_competition_competition` (
  `id` int(10) UNSIGNED NOT NULL,
  `transfermarkt_competition_id` int(10) UNSIGNED NOT NULL,
  `competition_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_event`
--

CREATE TABLE `transfermarkt_event` (
  `id` int(11) NOT NULL,
  `competition_id` int(11) NOT NULL,
  `season_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_event_event`
--

CREATE TABLE `transfermarkt_event_event` (
  `id` int(10) UNSIGNED NOT NULL,
  `transfermarkt_event_id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_event_team`
--

CREATE TABLE `transfermarkt_event_team` (
  `id` int(11) UNSIGNED NOT NULL,
  `event_id` int(11) UNSIGNED NOT NULL,
  `team_id` int(11) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_match`
--

CREATE TABLE `transfermarkt_match` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `round_id` smallint(5) UNSIGNED NOT NULL,
  `team1_id` smallint(5) UNSIGNED NOT NULL,
  `team2_id` smallint(5) UNSIGNED NOT NULL,
  `play_at` datetime NOT NULL,
  `score1` tinyint(3) UNSIGNED DEFAULT NULL,
  `score2` tinyint(3) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_match_match`
--

CREATE TABLE `transfermarkt_match_match` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `transfermarkt_match_id` mediumint(8) UNSIGNED NOT NULL,
  `match_id` mediumint(8) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_nation`
--

CREATE TABLE `transfermarkt_nation` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` char(30) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='记录http://www.transfermarkt.co.uk/的国家数据';

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_nation_nation`
--

CREATE TABLE `transfermarkt_nation_nation` (
  `id` int(10) UNSIGNED NOT NULL,
  `transfermarkt_nation_id` int(10) UNSIGNED NOT NULL,
  `nation_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_player`
--

CREATE TABLE `transfermarkt_player` (
  `id` mediumint(6) UNSIGNED NOT NULL DEFAULT '0',
  `full_name` varchar(60) NOT NULL,
  `name_in_native_country` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `height` tinyint(3) UNSIGNED DEFAULT NULL,
  `market_value` varchar(20) DEFAULT NULL,
  `foot` varchar(10) DEFAULT NULL,
  `position` varchar(20) DEFAULT NULL,
  `profile_uri` varchar(100) DEFAULT NULL,
  `nation_id` smallint(5) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='球员';

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_player_player`
--

CREATE TABLE `transfermarkt_player_player` (
  `id` int(11) NOT NULL,
  `transfermarkt_player_id` int(10) UNSIGNED NOT NULL,
  `player_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_round`
--

CREATE TABLE `transfermarkt_round` (
  `id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `round` int(2) UNSIGNED NOT NULL,
  `start_at` date DEFAULT NULL,
  `end_at` date DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_round_round`
--

CREATE TABLE `transfermarkt_round_round` (
  `id` int(10) UNSIGNED NOT NULL,
  `transfermarkt_round_id` int(10) UNSIGNED NOT NULL,
  `round_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_season`
--

CREATE TABLE `transfermarkt_season` (
  `id` int(11) NOT NULL,
  `year` char(4) NOT NULL,
  `title` char(5) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_season_season`
--

CREATE TABLE `transfermarkt_season_season` (
  `id` int(10) UNSIGNED NOT NULL,
  `transfermarkt_season_id` int(10) UNSIGNED NOT NULL,
  `season_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_team`
--

CREATE TABLE `transfermarkt_team` (
  `id` smallint(6) UNSIGNED NOT NULL,
  `team_name` char(40) NOT NULL,
  `club` tinyint(1) NOT NULL DEFAULT '0',
  `national` tinyint(1) NOT NULL DEFAULT '0',
  `owner_id` int(4) DEFAULT NULL,
  `country_id` int(10) UNSIGNED DEFAULT NULL,
  `foundation` date DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `profile_uri` varchar(200) DEFAULT NULL,
  `order_by` tinyint(2) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_team_team`
--

CREATE TABLE `transfermarkt_team_team` (
  `id` int(10) UNSIGNED NOT NULL,
  `transfermarkt_team_id` smallint(5) UNSIGNED NOT NULL,
  `team_id` smallint(5) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_transfer`
--

CREATE TABLE `transfermarkt_transfer` (
  `id` mediumint(7) UNSIGNED NOT NULL,
  `taking_team_id` int(6) UNSIGNED NOT NULL,
  `releasing_team_id` int(6) UNSIGNED NOT NULL,
  `season` int(4) UNSIGNED NOT NULL,
  `transfer_date` date NOT NULL,
  `transfer_sum` int(11) UNSIGNED DEFAULT NULL,
  `player_id` int(6) UNSIGNED NOT NULL,
  `contract_period` date DEFAULT NULL,
  `loan` char(3) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_transfer_transfer`
--

CREATE TABLE `transfermarkt_transfer_transfer` (
  `id` mediumint(7) UNSIGNED NOT NULL,
  `transfermarkt_transfer_id` mediumint(7) UNSIGNED NOT NULL,
  `transfer_id` mediumint(7) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `id` int(10) UNSIGNED NOT NULL,
  `date_joined` datetime NOT NULL,
  `username` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` char(60) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `privilege` tinyint(1) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_event`
--

CREATE TABLE `whoscored_event` (
  `id` int(10) UNSIGNED NOT NULL,
  `tournament_id` int(10) UNSIGNED NOT NULL,
  `season_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_event_event`
--

CREATE TABLE `whoscored_event_event` (
  `id` int(10) UNSIGNED NOT NULL,
  `whoscored_event_id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_goals`
--

CREATE TABLE `whoscored_goals` (
  `id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `penalty` tinyint(1) NOT NULL DEFAULT '0',
  `owngoal` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_match`
--

CREATE TABLE `whoscored_match` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `stage_id` smallint(5) UNSIGNED NOT NULL,
  `team1_id` smallint(5) UNSIGNED NOT NULL,
  `team2_id` smallint(5) UNSIGNED NOT NULL,
  `play_at` datetime NOT NULL,
  `score1` tinyint(3) UNSIGNED DEFAULT NULL,
  `score2` tinyint(3) UNSIGNED DEFAULT NULL,
  `score1i` tinyint(2) UNSIGNED DEFAULT NULL,
  `score2i` tinyint(2) UNSIGNED DEFAULT NULL,
  `weatherCode` tinyint(2) UNSIGNED NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_match_event`
--

CREATE TABLE `whoscored_match_event` (
  `id` int(10) UNSIGNED NOT NULL,
  `player_id` mediumint(8) UNSIGNED DEFAULT '0',
  `match_id` mediumint(8) UNSIGNED NOT NULL,
  `team_id` smallint(5) UNSIGNED NOT NULL,
  `minute` tinyint(3) UNSIGNED NOT NULL,
  `offset` tinyint(2) UNSIGNED NOT NULL DEFAULT '0',
  `event_type_id` smallint(5) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_match_event_match_event`
--

CREATE TABLE `whoscored_match_event_match_event` (
  `id` int(10) UNSIGNED NOT NULL,
  `whoscored_match_event_id` int(10) UNSIGNED NOT NULL,
  `match_event_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_match_event_type`
--

CREATE TABLE `whoscored_match_event_type` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `displayName` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_match_event_type_relation`
--

CREATE TABLE `whoscored_match_event_type_relation` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `whoscored_match_event_type_id` smallint(5) UNSIGNED NOT NULL,
  `match_event_type_id` tinyint(3) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_match_match`
--

CREATE TABLE `whoscored_match_match` (
  `id` int(10) UNSIGNED NOT NULL,
  `whoscored_match_id` int(10) UNSIGNED NOT NULL,
  `match_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_match_player_statistics`
--

CREATE TABLE `whoscored_match_player_statistics` (
  `id` int(10) UNSIGNED NOT NULL,
  `wSName` varchar(30) DEFAULT NULL,
  `playerId` mediumint(8) DEFAULT NULL,
  `age` tinyint(3) UNSIGNED DEFAULT '0',
  `isManOfTheMatch` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `isOpta` tinyint(1) NOT NULL DEFAULT '0',
  `positionText` varchar(30) DEFAULT NULL,
  `teamId` smallint(5) UNSIGNED DEFAULT '0',
  `regionCode` varchar(30) DEFAULT NULL,
  `rating` float(4,2) DEFAULT NULL,
  `positionOrder` tinyint(3) UNSIGNED DEFAULT '0',
  `shotOnTarget` tinyint(3) UNSIGNED DEFAULT '0',
  `shotsTotal` tinyint(3) UNSIGNED DEFAULT '0',
  `shotBlocked` tinyint(3) UNSIGNED DEFAULT '0',
  `passLongBallAccurate` tinyint(3) UNSIGNED DEFAULT '0',
  `passLongBallTotal` tinyint(3) UNSIGNED DEFAULT '0',
  `passTotal` tinyint(3) UNSIGNED DEFAULT '0',
  `passCrossAccurate` tinyint(3) UNSIGNED DEFAULT '0',
  `passCrossTotal` tinyint(3) UNSIGNED DEFAULT '0',
  `passThroughBallTotal` tinyint(3) UNSIGNED DEFAULT '0',
  `passThroughBallAccurate` tinyint(3) UNSIGNED DEFAULT '0',
  `keyPassTotal` tinyint(3) UNSIGNED DEFAULT '0',
  `dribbleWon` tinyint(3) UNSIGNED DEFAULT '0',
  `dribbleTotal` tinyint(3) UNSIGNED DEFAULT '0',
  `tackleWon` tinyint(3) UNSIGNED DEFAULT '0',
  `tackleLost` tinyint(3) UNSIGNED DEFAULT '0',
  `tackleWonTotal` tinyint(3) UNSIGNED DEFAULT '0',
  `tackleTotalAttempted` tinyint(3) UNSIGNED DEFAULT '0',
  `challengeLost` tinyint(3) UNSIGNED DEFAULT '0',
  `interceptionLost` tinyint(3) UNSIGNED DEFAULT '0',
  `interceptionAll` tinyint(3) UNSIGNED DEFAULT '0',
  `clearanceTotal` tinyint(3) UNSIGNED DEFAULT '0',
  `offsideGiven` tinyint(3) UNSIGNED DEFAULT '0',
  `offsideProvoked` tinyint(3) UNSIGNED DEFAULT '0',
  `foulGiven` tinyint(3) UNSIGNED DEFAULT '0',
  `foulCommitted` tinyint(3) UNSIGNED DEFAULT '0',
  `turnover` tinyint(3) UNSIGNED DEFAULT '0',
  `dispossessed` tinyint(3) UNSIGNED DEFAULT '0',
  `duelAerialWon` tinyint(3) UNSIGNED DEFAULT '0',
  `duelAerialTotal` tinyint(3) UNSIGNED DEFAULT '0',
  `touches` tinyint(3) UNSIGNED DEFAULT '0',
  `totalPasses` tinyint(3) UNSIGNED DEFAULT '0',
  `passSuccessInMatch` float(5,2) DEFAULT NULL,
  `matchId` mediumint(8) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_match_player_statistics_relation`
--

CREATE TABLE `whoscored_match_player_statistics_relation` (
  `id` int(10) UNSIGNED NOT NULL,
  `whoscored_match_player_statistics_id` int(10) UNSIGNED NOT NULL,
  `match_player_statistics_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_match_registration`
--

CREATE TABLE `whoscored_match_registration` (
  `id` int(10) UNSIGNED NOT NULL,
  `match_id` int(10) UNSIGNED NOT NULL,
  `player_id` int(10) UNSIGNED NOT NULL,
  `shirt_no` tinyint(3) UNSIGNED DEFAULT NULL,
  `team_id` int(10) UNSIGNED NOT NULL,
  `is_first_eleven` tinyint(1) NOT NULL DEFAULT '0',
  `is_man_of_the_match` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_player`
--

CREATE TABLE `whoscored_player` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(40) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `height` tinyint(1) UNSIGNED DEFAULT NULL,
  `weight` tinyint(1) UNSIGNED DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_player_player`
--

CREATE TABLE `whoscored_player_player` (
  `id` int(10) UNSIGNED NOT NULL,
  `whoscored_player_id` int(10) UNSIGNED NOT NULL,
  `player_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_regions`
--

CREATE TABLE `whoscored_regions` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `short_name` varchar(10) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_season`
--

CREATE TABLE `whoscored_season` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(10) DEFAULT NULL,
  `year` int(4) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_season_season`
--

CREATE TABLE `whoscored_season_season` (
  `id` int(10) UNSIGNED NOT NULL,
  `whoscored_season_id` int(10) UNSIGNED NOT NULL,
  `season_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_stage`
--

CREATE TABLE `whoscored_stage` (
  `id` int(10) UNSIGNED NOT NULL,
  `tournament_id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_team`
--

CREATE TABLE `whoscored_team` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(40) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_team_team`
--

CREATE TABLE `whoscored_team_team` (
  `id` int(10) UNSIGNED NOT NULL,
  `whoscored_team_id` int(10) UNSIGNED NOT NULL,
  `team_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_tournaments`
--

CREATE TABLE `whoscored_tournaments` (
  `id` int(10) UNSIGNED NOT NULL,
  `region_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `short_name` varchar(10) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_tournament_competition`
--

CREATE TABLE `whoscored_tournament_competition` (
  `id` int(10) UNSIGNED NOT NULL,
  `whoscored_tournament_id` int(10) UNSIGNED NOT NULL,
  `competition_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `citytranslation`
--
ALTER TABLE `citytranslation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `club`
--
ALTER TABLE `club`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nation_2` (`nation_id`),
  ADD KEY `nation_3` (`nation_id`),
  ADD KEY `nation_4` (`nation_id`),
  ADD KEY `nation_5` (`nation_id`);

--
-- Indexes for table `clubtranslation`
--
ALTER TABLE `clubtranslation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `competition`
--
ALTER TABLE `competition`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `competition_category`
--
ALTER TABLE `competition_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `competition_type`
--
ALTER TABLE `competition_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `continent`
--
ALTER TABLE `continent`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_team`
--
ALTER TABLE `event_team`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fm_player`
--
ALTER TABLE `fm_player`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `goal_events`
--
ALTER TABLE `goal_events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `match`
--
ALTER TABLE `match`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `match_event`
--
ALTER TABLE `match_event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `match_event_type`
--
ALTER TABLE `match_event_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `match_player_statistics`
--
ALTER TABLE `match_player_statistics`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `match_registration`
--
ALTER TABLE `match_registration`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nation`
--
ALTER TABLE `nation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `continent` (`continent_id`);

--
-- Indexes for table `nationality`
--
ALTER TABLE `nationality`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nationtranslation`
--
ALTER TABLE `nationtranslation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `player2position`
--
ALTER TABLE `player2position`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `playertranslation`
--
ALTER TABLE `playertranslation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `position`
--
ALTER TABLE `position`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registrationprofile`
--
ALTER TABLE `registrationprofile`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `round`
--
ALTER TABLE `round`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `season`
--
ALTER TABLE `season`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teamplayer`
--
ALTER TABLE `teamplayer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfer`
--
ALTER TABLE `transfer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarket_club`
--
ALTER TABLE `transfermarket_club`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarket_competition_category`
--
ALTER TABLE `transfermarket_competition_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarket_competition_level`
--
ALTER TABLE `transfermarket_competition_level`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarket_position`
--
ALTER TABLE `transfermarket_position`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarket_team_player`
--
ALTER TABLE `transfermarket_team_player`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarkt_competition`
--
ALTER TABLE `transfermarkt_competition`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarkt_competition_competition`
--
ALTER TABLE `transfermarkt_competition_competition`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transfermarkt_competition_id` (`transfermarkt_competition_id`),
  ADD UNIQUE KEY `competition_id` (`competition_id`);

--
-- Indexes for table `transfermarkt_event`
--
ALTER TABLE `transfermarkt_event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarkt_event_event`
--
ALTER TABLE `transfermarkt_event_event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarkt_event_team`
--
ALTER TABLE `transfermarkt_event_team`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarkt_match`
--
ALTER TABLE `transfermarkt_match`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarkt_match_match`
--
ALTER TABLE `transfermarkt_match_match`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarkt_nation`
--
ALTER TABLE `transfermarkt_nation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarkt_nation_nation`
--
ALTER TABLE `transfermarkt_nation_nation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transfermarkt_nation_id` (`transfermarkt_nation_id`,`nation_id`);

--
-- Indexes for table `transfermarkt_player`
--
ALTER TABLE `transfermarkt_player`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `transfermarkt_player_player`
--
ALTER TABLE `transfermarkt_player_player`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transfermarkt_player_id` (`transfermarkt_player_id`,`player_id`);

--
-- Indexes for table `transfermarkt_round`
--
ALTER TABLE `transfermarkt_round`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarkt_round_round`
--
ALTER TABLE `transfermarkt_round_round`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarkt_season`
--
ALTER TABLE `transfermarkt_season`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarkt_season_season`
--
ALTER TABLE `transfermarkt_season_season`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfermarkt_team`
--
ALTER TABLE `transfermarkt_team`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `transfermarkt_team_team`
--
ALTER TABLE `transfermarkt_team_team`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transfermarkt_team_id` (`transfermarkt_team_id`),
  ADD UNIQUE KEY `team_id` (`team_id`);

--
-- Indexes for table `transfermarkt_transfer`
--
ALTER TABLE `transfermarkt_transfer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `transfermarkt_transfer_transfer`
--
ALTER TABLE `transfermarkt_transfer_transfer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transfer_id` (`transfer_id`),
  ADD UNIQUE KEY `transfermarkt_transfer_id` (`transfermarkt_transfer_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_event`
--
ALTER TABLE `whoscored_event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_event_event`
--
ALTER TABLE `whoscored_event_event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_goals`
--
ALTER TABLE `whoscored_goals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_match`
--
ALTER TABLE `whoscored_match`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_match_event`
--
ALTER TABLE `whoscored_match_event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_match_event_match_event`
--
ALTER TABLE `whoscored_match_event_match_event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_match_event_type`
--
ALTER TABLE `whoscored_match_event_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_match_event_type_relation`
--
ALTER TABLE `whoscored_match_event_type_relation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_match_match`
--
ALTER TABLE `whoscored_match_match`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_match_player_statistics`
--
ALTER TABLE `whoscored_match_player_statistics`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_match_player_statistics_relation`
--
ALTER TABLE `whoscored_match_player_statistics_relation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_match_registration`
--
ALTER TABLE `whoscored_match_registration`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_player`
--
ALTER TABLE `whoscored_player`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_player_player`
--
ALTER TABLE `whoscored_player_player`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_regions`
--
ALTER TABLE `whoscored_regions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_season`
--
ALTER TABLE `whoscored_season`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_season_season`
--
ALTER TABLE `whoscored_season_season`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_stage`
--
ALTER TABLE `whoscored_stage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_team`
--
ALTER TABLE `whoscored_team`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_team_team`
--
ALTER TABLE `whoscored_team_team`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_tournaments`
--
ALTER TABLE `whoscored_tournaments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_tournament_competition`
--
ALTER TABLE `whoscored_tournament_competition`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `city`
--
ALTER TABLE `city`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `citytranslation`
--
ALTER TABLE `citytranslation`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `club`
--
ALTER TABLE `club`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `clubtranslation`
--
ALTER TABLE `clubtranslation`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `competition`
--
ALTER TABLE `competition`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `competition_category`
--
ALTER TABLE `competition_category`
  MODIFY `id` tinyint(2) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `competition_type`
--
ALTER TABLE `competition_type`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `continent`
--
ALTER TABLE `continent`
  MODIFY `id` tinyint(1) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `event`
--
ALTER TABLE `event`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `event_team`
--
ALTER TABLE `event_team`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `fm_player`
--
ALTER TABLE `fm_player`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `goal_events`
--
ALTER TABLE `goal_events`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `match`
--
ALTER TABLE `match`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `match_event`
--
ALTER TABLE `match_event`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `match_event_type`
--
ALTER TABLE `match_event_type`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `match_player_statistics`
--
ALTER TABLE `match_player_statistics`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `match_registration`
--
ALTER TABLE `match_registration`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `nation`
--
ALTER TABLE `nation`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `nationality`
--
ALTER TABLE `nationality`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `nationtranslation`
--
ALTER TABLE `nationtranslation`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `player`
--
ALTER TABLE `player`
  MODIFY `id` mediumint(6) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `player2position`
--
ALTER TABLE `player2position`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `playertranslation`
--
ALTER TABLE `playertranslation`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `position`
--
ALTER TABLE `position`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `registrationprofile`
--
ALTER TABLE `registrationprofile`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `round`
--
ALTER TABLE `round`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `season`
--
ALTER TABLE `season`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `tables`
--
ALTER TABLE `tables`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `team`
--
ALTER TABLE `team`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `teamplayer`
--
ALTER TABLE `teamplayer`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfer`
--
ALTER TABLE `transfer`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarket_competition_category`
--
ALTER TABLE `transfermarket_competition_category`
  MODIFY `id` tinyint(2) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarket_competition_level`
--
ALTER TABLE `transfermarket_competition_level`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarket_team_player`
--
ALTER TABLE `transfermarket_team_player`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarkt_competition`
--
ALTER TABLE `transfermarkt_competition`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarkt_competition_competition`
--
ALTER TABLE `transfermarkt_competition_competition`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarkt_event`
--
ALTER TABLE `transfermarkt_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarkt_event_event`
--
ALTER TABLE `transfermarkt_event_event`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarkt_event_team`
--
ALTER TABLE `transfermarkt_event_team`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarkt_match`
--
ALTER TABLE `transfermarkt_match`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarkt_match_match`
--
ALTER TABLE `transfermarkt_match_match`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarkt_nation_nation`
--
ALTER TABLE `transfermarkt_nation_nation`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarkt_player_player`
--
ALTER TABLE `transfermarkt_player_player`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarkt_round`
--
ALTER TABLE `transfermarkt_round`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarkt_round_round`
--
ALTER TABLE `transfermarkt_round_round`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarkt_season`
--
ALTER TABLE `transfermarkt_season`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarkt_season_season`
--
ALTER TABLE `transfermarkt_season_season`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarkt_team_team`
--
ALTER TABLE `transfermarkt_team_team`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `transfermarkt_transfer_transfer`
--
ALTER TABLE `transfermarkt_transfer_transfer`
  MODIFY `id` mediumint(7) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `whoscored_event`
--
ALTER TABLE `whoscored_event`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `whoscored_event_event`
--
ALTER TABLE `whoscored_event_event`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `whoscored_goals`
--
ALTER TABLE `whoscored_goals`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `whoscored_match_event`
--
ALTER TABLE `whoscored_match_event`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `whoscored_match_event_match_event`
--
ALTER TABLE `whoscored_match_event_match_event`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `whoscored_match_event_type_relation`
--
ALTER TABLE `whoscored_match_event_type_relation`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `whoscored_match_match`
--
ALTER TABLE `whoscored_match_match`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `whoscored_match_player_statistics`
--
ALTER TABLE `whoscored_match_player_statistics`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `whoscored_match_player_statistics_relation`
--
ALTER TABLE `whoscored_match_player_statistics_relation`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `whoscored_match_registration`
--
ALTER TABLE `whoscored_match_registration`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `whoscored_player_player`
--
ALTER TABLE `whoscored_player_player`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `whoscored_season`
--
ALTER TABLE `whoscored_season`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `whoscored_season_season`
--
ALTER TABLE `whoscored_season_season`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `whoscored_team_team`
--
ALTER TABLE `whoscored_team_team`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `whoscored_tournament_competition`
--
ALTER TABLE `whoscored_tournament_competition`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
