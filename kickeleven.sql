-- phpMyAdmin SQL Dump
-- version 4.4.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2015-10-23 18:34:16
-- 服务器版本： 5.6.21
-- PHP Version: 5.6.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `kickeleven`
--

-- --------------------------------------------------------

--
-- 表的结构 `city`
--

CREATE TABLE IF NOT EXISTS `city` (
  `id` int(10) unsigned NOT NULL,
  `city_name` varchar(60) NOT NULL,
  `nation_id` int(10) unsigned NOT NULL,
  `capital` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `citytranslation`
--

CREATE TABLE IF NOT EXISTS `citytranslation` (
  `id` int(10) unsigned NOT NULL,
  `city_name` varchar(60) NOT NULL,
  `city_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `club`
--

CREATE TABLE IF NOT EXISTS `club` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(40) NOT NULL,
  `foundation` date DEFAULT NULL,
  `nation_id` tinyint(3) unsigned DEFAULT NULL,
  `logo_id` int(10) unsigned DEFAULT NULL COMMENT 'fm logo id',
  `home_kit` char(37) DEFAULT NULL,
  `away_kit` char(37) DEFAULT NULL,
  `third_kit` char(37) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='俱乐部';

-- --------------------------------------------------------

--
-- 表的结构 `clubtranslation`
--

CREATE TABLE IF NOT EXISTS `clubtranslation` (
  `id` int(10) unsigned NOT NULL,
  `language_code` char(5) NOT NULL,
  `name` varchar(60) NOT NULL,
  `club` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `competition`
--

CREATE TABLE IF NOT EXISTS `competition` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `code` varchar(4) DEFAULT NULL,
  `nation_id` tinyint(3) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `competition_category`
--

CREATE TABLE IF NOT EXISTS `competition_category` (
  `id` tinyint(2) unsigned NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `competition_type`
--

CREATE TABLE IF NOT EXISTS `competition_type` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `continent`
--

CREATE TABLE IF NOT EXISTS `continent` (
  `id` tinyint(1) unsigned NOT NULL,
  `name` varchar(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='大洲';

-- --------------------------------------------------------

--
-- 表的结构 `error_uri`
--

CREATE TABLE IF NOT EXISTS `error_uri` (
  `uri` varchar(200) NOT NULL,
  `error_code` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `event`
--

CREATE TABLE IF NOT EXISTS `event` (
  `id` int(10) unsigned NOT NULL,
  `competition_id` int(10) unsigned NOT NULL,
  `season_id` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `events_teams`
--

CREATE TABLE IF NOT EXISTS `events_teams` (
  `id` int(10) unsigned NOT NULL,
  `event_id` int(10) unsigned NOT NULL,
  `team_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `fm_player`
--

CREATE TABLE IF NOT EXISTS `fm_player` (
  `id` int(10) unsigned NOT NULL,
  `fm_player_id` int(10) unsigned NOT NULL,
  `player_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `goal_events`
--

CREATE TABLE IF NOT EXISTS `goal_events` (
  `id` int(10) unsigned NOT NULL,
  `event_id` int(10) unsigned NOT NULL,
  `penalty` tinyint(1) NOT NULL DEFAULT '0',
  `owngoal` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `matchs`
--

CREATE TABLE IF NOT EXISTS `matchs` (
  `id` int(10) unsigned NOT NULL,
  `round_id` int(10) unsigned NOT NULL,
  `team1_id` int(10) unsigned NOT NULL,
  `team2_id` int(10) unsigned NOT NULL,
  `play_at` datetime NOT NULL,
  `score1` tinyint(3) unsigned DEFAULT NULL,
  `score2` tinyint(3) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `match_events`
--

CREATE TABLE IF NOT EXISTS `match_events` (
  `id` int(10) unsigned NOT NULL,
  `player_id` int(10) unsigned NOT NULL,
  `match_id` int(10) unsigned NOT NULL,
  `team_id` int(10) unsigned NOT NULL,
  `minute` tinyint(3) unsigned NOT NULL,
  `offset` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `match_player_statistics`
--

CREATE TABLE IF NOT EXISTS `match_player_statistics` (
  `id` int(10) unsigned NOT NULL,
  `playerId` int(10) DEFAULT NULL,
  `age` tinyint(1) unsigned DEFAULT '0',
  `isManOfTheMatch` tinyint(1) DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '0',
  `positionText` char(3) DEFAULT NULL,
  `teamId` smallint(5) unsigned DEFAULT '0',
  `rating` float(4,2) DEFAULT NULL,
  `positionOrder` tinyint(4) DEFAULT '0',
  `shotOnTarget` tinyint(4) DEFAULT '0',
  `shotsTotal` tinyint(4) DEFAULT '0',
  `shotBlocked` tinyint(4) DEFAULT '0',
  `passLongBallAccurate` tinyint(4) DEFAULT '0',
  `passLongBallTotal` tinyint(4) DEFAULT '0',
  `passTotal` tinyint(4) DEFAULT '0',
  `passCrossAccurate` tinyint(4) DEFAULT '0',
  `passCrossTotal` tinyint(4) DEFAULT '0',
  `passThroughBallTotal` tinyint(4) DEFAULT '0',
  `passThroughBallAccurate` tinyint(4) DEFAULT '0',
  `keyPassTotal` tinyint(4) DEFAULT '0',
  `dribbleWon` tinyint(4) DEFAULT '0',
  `dribbleTotal` tinyint(4) DEFAULT '0',
  `tackleWon` tinyint(4) DEFAULT '0',
  `tackleLost` tinyint(4) DEFAULT '0',
  `tackleWonTotal` tinyint(4) DEFAULT '0',
  `tackleTotalAttempted` tinyint(4) DEFAULT '0',
  `challengeLost` tinyint(4) DEFAULT '0',
  `interceptionLost` tinyint(4) DEFAULT '0',
  `interceptionAll` tinyint(4) DEFAULT '0',
  `clearanceTotal` tinyint(4) DEFAULT '0',
  `offsideGiven` tinyint(4) DEFAULT '0',
  `offsideProvoked` tinyint(4) DEFAULT '0',
  `foulGiven` tinyint(4) DEFAULT '0',
  `foulCommitted` tinyint(4) DEFAULT '0',
  `turnover` tinyint(4) DEFAULT '0',
  `dispossessed` tinyint(4) DEFAULT '0',
  `duelAerialWon` tinyint(4) DEFAULT '0',
  `duelAerialTotal` tinyint(4) DEFAULT '0',
  `touches` tinyint(4) DEFAULT '0',
  `totalPasses` tinyint(4) DEFAULT '0',
  `passSuccessInMatch` float(5,2) DEFAULT NULL,
  `matchId` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `nation`
--

CREATE TABLE IF NOT EXISTS `nation` (
  `id` tinyint(3) unsigned NOT NULL,
  `name` varchar(60) NOT NULL,
  `continent_id` tinyint(3) unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='国家';

-- --------------------------------------------------------

--
-- 表的结构 `nation2player`
--

CREATE TABLE IF NOT EXISTS `nation2player` (
  `id` int(10) unsigned NOT NULL,
  `nation_id` int(10) unsigned NOT NULL,
  `player_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='球员国籍';

-- --------------------------------------------------------

--
-- 表的结构 `nationtranslation`
--

CREATE TABLE IF NOT EXISTS `nationtranslation` (
  `id` int(10) unsigned NOT NULL,
  `language_code` char(5) NOT NULL,
  `full_name` varchar(60) NOT NULL,
  `short_name` varchar(30) NOT NULL,
  `capital_city` varchar(60) NOT NULL,
  `nationality` varchar(30) NOT NULL,
  `nation_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `player`
--

CREATE TABLE IF NOT EXISTS `player` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(60) NOT NULL,
  `date_of_birth` date NOT NULL,
  `height` tinyint(3) unsigned DEFAULT NULL,
  `weight` tinyint(4) unsigned DEFAULT NULL,
  `foot` char(5) NOT NULL DEFAULT 'right',
  `avatar_id` int(10) unsigned NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='球员';

-- --------------------------------------------------------

--
-- 表的结构 `player2position`
--

CREATE TABLE IF NOT EXISTS `player2position` (
  `id` int(10) unsigned NOT NULL,
  `player_id` int(10) unsigned NOT NULL,
  `position_id` tinyint(3) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='球员位置';

-- --------------------------------------------------------

--
-- 表的结构 `playertranslation`
--

CREATE TABLE IF NOT EXISTS `playertranslation` (
  `id` int(10) unsigned NOT NULL,
  `player` int(10) unsigned NOT NULL,
  `language_code` char(6) NOT NULL,
  `full_name` varchar(60) NOT NULL,
  `short_name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `position`
--

CREATE TABLE IF NOT EXISTS `position` (
  `id` tinyint(3) unsigned NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='位置';

-- --------------------------------------------------------

--
-- 表的结构 `registrationprofile`
--

CREATE TABLE IF NOT EXISTS `registrationprofile` (
  `id` int(10) unsigned NOT NULL,
  `user_id` int(11) NOT NULL,
  `activation_key` char(41) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `round`
--

CREATE TABLE IF NOT EXISTS `round` (
  `id` int(10) unsigned NOT NULL,
  `event_id` int(10) unsigned NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `round` int(2) unsigned NOT NULL,
  `start_at` date NOT NULL,
  `end_at` date DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `season`
--

CREATE TABLE IF NOT EXISTS `season` (
  `id` int(10) unsigned NOT NULL,
  `year` int(11) NOT NULL,
  `title` char(5) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) NOT NULL,
  `atime` datetime NOT NULL,
  `data` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `tables`
--

CREATE TABLE IF NOT EXISTS `tables` (
  `id` int(10) unsigned NOT NULL,
  `event_id` int(10) unsigned NOT NULL,
  `team_id` int(10) unsigned NOT NULL,
  `wins` tinyint(2) unsigned DEFAULT NULL,
  `draws` tinyint(2) unsigned DEFAULT NULL,
  `loses` tinyint(2) unsigned DEFAULT NULL,
  `goals_for` tinyint(2) unsigned DEFAULT NULL,
  `goals_against` tinyint(2) unsigned DEFAULT NULL,
  `init_point` int(10) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `team`
--

CREATE TABLE IF NOT EXISTS `team` (
  `id` int(10) unsigned NOT NULL,
  `club` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否是俱乐部',
  `national` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否是国家队',
  `name` varchar(40) NOT NULL,
  `country_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `teamplayer`
--

CREATE TABLE IF NOT EXISTS `teamplayer` (
  `id` int(10) unsigned NOT NULL,
  `team_id` int(4) unsigned NOT NULL,
  `player_id` int(6) unsigned NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfer`
--

CREATE TABLE IF NOT EXISTS `transfer` (
  `id` int(11) unsigned NOT NULL,
  `taking_team_id` int(6) unsigned NOT NULL,
  `releasing_team_id` int(6) unsigned NOT NULL,
  `season` int(4) unsigned NOT NULL,
  `transfer_date` date NOT NULL,
  `transfer_sum` int(11) unsigned NOT NULL,
  `player_id` int(6) unsigned NOT NULL,
  `contract_period` date NOT NULL,
  `loan` char(3) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarket_club`
--

CREATE TABLE IF NOT EXISTS `transfermarket_club` (
  `club_name` varchar(60) NOT NULL,
  `foundation` date DEFAULT NULL,
  `id` int(6) unsigned NOT NULL,
  `profile_uri` varchar(78) DEFAULT NULL,
  `nation_id` int(5) unsigned DEFAULT NULL,
  `club_ref_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='俱乐部';

-- --------------------------------------------------------

--
-- 表的结构 `transfermarket_competition_category`
--

CREATE TABLE IF NOT EXISTS `transfermarket_competition_category` (
  `id` tinyint(2) unsigned NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarket_competition_competition`
--

CREATE TABLE IF NOT EXISTS `transfermarket_competition_competition` (
  `id` int(10) unsigned NOT NULL,
  `transfermarket_competition_id` varchar(4) NOT NULL,
  `competition_id` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarket_competition_level`
--

CREATE TABLE IF NOT EXISTS `transfermarket_competition_level` (
  `id` int(10) unsigned NOT NULL,
  `type_name` char(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarket_competition_team`
--

CREATE TABLE IF NOT EXISTS `transfermarket_competition_team` (
  `team_id` int(10) unsigned NOT NULL,
  `competition_id` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarket_position`
--

CREATE TABLE IF NOT EXISTS `transfermarket_position` (
  `id` tinyint(2) unsigned NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='位置';

-- --------------------------------------------------------

--
-- 表的结构 `transfermarket_team_player`
--

CREATE TABLE IF NOT EXISTS `transfermarket_team_player` (
  `id` int(10) unsigned NOT NULL,
  `team_id` int(10) unsigned NOT NULL,
  `player_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarket_transfer`
--

CREATE TABLE IF NOT EXISTS `transfermarket_transfer` (
  `id` int(11) NOT NULL,
  `taking_team_id` int(6) unsigned NOT NULL,
  `releasing_team_id` int(6) unsigned NOT NULL,
  `season` int(4) unsigned NOT NULL,
  `transfer_date` date NOT NULL,
  `transfer_sum` int(11) unsigned NOT NULL,
  `player_id` int(6) unsigned NOT NULL,
  `contract_period` date DEFAULT NULL,
  `loan` char(3) NOT NULL,
  `transfer_ref_id` int(10) unsigned NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_competition`
--

CREATE TABLE IF NOT EXISTS `transfermarkt_competition` (
  `id` int(10) unsigned NOT NULL,
  `name` char(60) NOT NULL,
  `code` char(10) NOT NULL,
  `nation_id` int(4) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_competition_competition`
--

CREATE TABLE IF NOT EXISTS `transfermarkt_competition_competition` (
  `id` int(10) unsigned NOT NULL,
  `transfermarkt_competition_id` int(10) unsigned NOT NULL,
  `competition_id` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_event`
--

CREATE TABLE IF NOT EXISTS `transfermarkt_event` (
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

CREATE TABLE IF NOT EXISTS `transfermarkt_event_event` (
  `id` int(10) unsigned NOT NULL,
  `transfermarkt_event_id` int(10) unsigned NOT NULL,
  `event_id` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_match`
--

CREATE TABLE IF NOT EXISTS `transfermarkt_match` (
  `id` int(10) unsigned NOT NULL,
  `round_id` int(10) unsigned NOT NULL,
  `team1_id` int(10) unsigned NOT NULL,
  `team2_id` int(10) unsigned NOT NULL,
  `play_at` datetime NOT NULL,
  `score1` tinyint(3) unsigned DEFAULT NULL,
  `score2` tinyint(3) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_match_match`
--

CREATE TABLE IF NOT EXISTS `transfermarkt_match_match` (
  `id` int(10) unsigned NOT NULL,
  `transfermarkt_match_id` int(10) unsigned NOT NULL,
  `match_id` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_nation`
--

CREATE TABLE IF NOT EXISTS `transfermarkt_nation` (
  `id` int(10) unsigned NOT NULL,
  `name` char(30) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='记录http://www.transfermarkt.co.uk/的国家数据';

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_nation_nation`
--

CREATE TABLE IF NOT EXISTS `transfermarkt_nation_nation` (
  `id` int(10) unsigned NOT NULL,
  `transfermarkt_nation_id` int(10) unsigned NOT NULL,
  `nation_id` int(10) unsigned NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_player`
--

CREATE TABLE IF NOT EXISTS `transfermarkt_player` (
  `id` int(6) unsigned NOT NULL DEFAULT '0',
  `full_name` varchar(60) NOT NULL,
  `name_in_native_country` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `height` tinyint(3) unsigned DEFAULT NULL,
  `market_value` varchar(20) DEFAULT NULL,
  `foot` varchar(10) DEFAULT NULL,
  `position` varchar(20) DEFAULT NULL,
  `profile_uri` varchar(100) DEFAULT NULL,
  `nation_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='球员';

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_player_player`
--

CREATE TABLE IF NOT EXISTS `transfermarkt_player_player` (
  `id` int(11) NOT NULL,
  `transfermarkt_player_id` int(10) unsigned NOT NULL,
  `player_id` int(10) unsigned NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_round`
--

CREATE TABLE IF NOT EXISTS `transfermarkt_round` (
  `id` int(10) unsigned NOT NULL,
  `event_id` int(10) unsigned NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `round` int(2) unsigned NOT NULL,
  `start_at` date DEFAULT NULL,
  `end_at` date DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_round_round`
--

CREATE TABLE IF NOT EXISTS `transfermarkt_round_round` (
  `id` int(10) unsigned NOT NULL,
  `transfermarkt_round_id` int(10) unsigned NOT NULL,
  `round_id` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_season`
--

CREATE TABLE IF NOT EXISTS `transfermarkt_season` (
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

CREATE TABLE IF NOT EXISTS `transfermarkt_season_season` (
  `id` int(10) unsigned NOT NULL,
  `transfermarkt_season_id` int(10) unsigned NOT NULL,
  `season_id` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_team`
--

CREATE TABLE IF NOT EXISTS `transfermarkt_team` (
  `id` int(11) unsigned NOT NULL,
  `team_name` char(40) NOT NULL,
  `club` tinyint(1) NOT NULL DEFAULT '0',
  `national` tinyint(1) NOT NULL DEFAULT '0',
  `owner_id` int(4) DEFAULT NULL,
  `country_id` int(10) unsigned NOT NULL,
  `foundation` date DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `profile_uri` varchar(200) DEFAULT NULL,
  `order_by` tinyint(2) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_team_team`
--

CREATE TABLE IF NOT EXISTS `transfermarkt_team_team` (
  `id` int(10) unsigned NOT NULL,
  `transfermarkt_team_id` int(10) unsigned NOT NULL,
  `team_id` int(10) unsigned NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `transfermarkt_transfer_transfer`
--

CREATE TABLE IF NOT EXISTS `transfermarkt_transfer_transfer` (
  `id` int(10) unsigned NOT NULL,
  `transfermarkt_transfer_id` int(10) unsigned NOT NULL,
  `transfer_id` int(10) unsigned NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(10) unsigned NOT NULL,
  `date_joined` datetime NOT NULL,
  `username` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` char(60) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `privilege` tinyint(1) unsigned NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_event_event`
--

CREATE TABLE IF NOT EXISTS `whoscored_event_event` (
  `id` int(10) unsigned NOT NULL,
  `whoscored_event_id` int(10) unsigned NOT NULL,
  `event_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_goals`
--

CREATE TABLE IF NOT EXISTS `whoscored_goals` (
  `id` int(10) unsigned NOT NULL,
  `event_id` int(10) unsigned NOT NULL,
  `penalty` tinyint(1) NOT NULL DEFAULT '0',
  `owngoal` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_matches`
--

CREATE TABLE IF NOT EXISTS `whoscored_matches` (
  `id` int(10) unsigned NOT NULL,
  `stage_id` smallint(5) unsigned NOT NULL,
  `team1_id` smallint(5) unsigned NOT NULL,
  `team2_id` smallint(5) unsigned NOT NULL,
  `play_at` datetime NOT NULL,
  `score1` tinyint(3) unsigned DEFAULT NULL,
  `score2` tinyint(3) unsigned DEFAULT NULL,
  `score1i` tinyint(2) unsigned DEFAULT NULL,
  `score2i` tinyint(2) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_match_events`
--

CREATE TABLE IF NOT EXISTS `whoscored_match_events` (
  `id` int(10) unsigned NOT NULL,
  `player_id` int(10) unsigned NOT NULL,
  `match_id` int(10) unsigned NOT NULL,
  `team_id` int(10) unsigned NOT NULL,
  `minute` tinyint(3) unsigned NOT NULL,
  `offset` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_match_match`
--

CREATE TABLE IF NOT EXISTS `whoscored_match_match` (
  `id` int(10) unsigned NOT NULL,
  `whoscored_match_id` int(10) unsigned NOT NULL,
  `match_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_match_player_statistics`
--

CREATE TABLE IF NOT EXISTS `whoscored_match_player_statistics` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `wSName` varchar(30) DEFAULT NULL,
  `playerId` int(10) DEFAULT NULL,
  `age` tinyint(3) unsigned DEFAULT '0',
  `isManOfTheMatch` tinyint(1) DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '0',
  `isOpta` tinyint(1) DEFAULT '0',
  `positionText` varchar(30) DEFAULT NULL,
  `teamId` smallint(5) unsigned DEFAULT '0',
  `regionCode` varchar(30) DEFAULT NULL,
  `rating` float(4,2) DEFAULT NULL,
  `positionOrder` tinyint(4) DEFAULT '0',
  `shotOnTarget` tinyint(4) DEFAULT '0',
  `shotsTotal` tinyint(4) DEFAULT '0',
  `shotBlocked` tinyint(4) DEFAULT '0',
  `passLongBallAccurate` tinyint(4) DEFAULT '0',
  `passLongBallTotal` tinyint(4) DEFAULT '0',
  `passTotal` tinyint(4) DEFAULT '0',
  `passCrossAccurate` tinyint(4) DEFAULT '0',
  `passCrossTotal` tinyint(4) DEFAULT '0',
  `passThroughBallTotal` tinyint(4) DEFAULT '0',
  `passThroughBallAccurate` tinyint(4) DEFAULT '0',
  `keyPassTotal` tinyint(4) DEFAULT '0',
  `dribbleWon` tinyint(4) DEFAULT '0',
  `dribbleTotal` tinyint(4) DEFAULT '0',
  `tackleWon` tinyint(4) DEFAULT '0',
  `tackleLost` tinyint(4) DEFAULT '0',
  `tackleWonTotal` tinyint(4) DEFAULT '0',
  `tackleTotalAttempted` tinyint(4) DEFAULT '0',
  `challengeLost` tinyint(4) DEFAULT '0',
  `interceptionLost` tinyint(4) DEFAULT '0',
  `interceptionAll` tinyint(4) DEFAULT '0',
  `clearanceTotal` tinyint(4) DEFAULT '0',
  `offsideGiven` tinyint(4) DEFAULT '0',
  `offsideProvoked` tinyint(4) DEFAULT '0',
  `foulGiven` tinyint(4) DEFAULT '0',
  `foulCommitted` tinyint(4) DEFAULT '0',
  `turnover` tinyint(4) DEFAULT '0',
  `dispossessed` tinyint(4) DEFAULT '0',
  `duelAerialWon` tinyint(4) DEFAULT '0',
  `duelAerialTotal` tinyint(4) DEFAULT '0',
  `touches` tinyint(4) DEFAULT '0',
  `totalPasses` tinyint(4) DEFAULT '0',
  `passSuccessInMatch` float(5,2) DEFAULT NULL,
  `matchId` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_player`
--

CREATE TABLE IF NOT EXISTS `whoscored_player` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(40) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `height` tinyint(1) unsigned DEFAULT NULL,
  `weight` tinyint(1) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_player_player`
--

CREATE TABLE IF NOT EXISTS `whoscored_player_player` (
  `id` int(10) unsigned NOT NULL,
  `whoscored_player_id` int(10) unsigned NOT NULL,
  `player_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_regions`
--

CREATE TABLE IF NOT EXISTS `whoscored_regions` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `short_name` varchar(10) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_registration`
--

CREATE TABLE IF NOT EXISTS `whoscored_registration` (
  `id` int(10) unsigned NOT NULL,
  `match_id` int(10) unsigned NOT NULL,
  `player_id` int(10) unsigned NOT NULL,
  `shirt_no` tinyint(3) unsigned DEFAULT NULL,
  `team_id` int(10) unsigned NOT NULL,
  `is_first_eleven` tinyint(1) NOT NULL DEFAULT '0',
  `is_man_of_the_match` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_seasons`
--

CREATE TABLE IF NOT EXISTS `whoscored_seasons` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(10) NOT NULL,
  `year` int(4) unsigned NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_stages`
--

CREATE TABLE IF NOT EXISTS `whoscored_stages` (
  `id` int(10) unsigned NOT NULL,
  `tournament_id` int(10) unsigned NOT NULL,
  `season_id` int(10) unsigned NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_teams`
--

CREATE TABLE IF NOT EXISTS `whoscored_teams` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(40) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_team_team`
--

CREATE TABLE IF NOT EXISTS `whoscored_team_team` (
  `id` int(10) unsigned NOT NULL,
  `whoscored_team_id` int(10) unsigned NOT NULL,
  `team_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `whoscored_tournaments`
--

CREATE TABLE IF NOT EXISTS `whoscored_tournaments` (
  `id` int(10) unsigned NOT NULL,
  `region_id` int(10) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `short_name` varchar(10) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
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
-- Indexes for table `events_teams`
--
ALTER TABLE `events_teams`
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
-- Indexes for table `matchs`
--
ALTER TABLE `matchs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `match_events`
--
ALTER TABLE `match_events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `match_player_statistics`
--
ALTER TABLE `match_player_statistics`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nation`
--
ALTER TABLE `nation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `continent` (`continent_id`);

--
-- Indexes for table `nation2player`
--
ALTER TABLE `nation2player`
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
-- Indexes for table `transfermarket_competition_competition`
--
ALTER TABLE `transfermarket_competition_competition`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `competition_id` (`competition_id`);

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
-- Indexes for table `transfermarket_transfer`
--
ALTER TABLE `transfermarket_transfer`
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
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `whoscored_matches`
--
ALTER TABLE `whoscored_matches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_match_events`
--
ALTER TABLE `whoscored_match_events`
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
-- Indexes for table `whoscored_registration`
--
ALTER TABLE `whoscored_registration`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_seasons`
--
ALTER TABLE `whoscored_seasons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_stages`
--
ALTER TABLE `whoscored_stages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whoscored_teams`
--
ALTER TABLE `whoscored_teams`
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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `citytranslation`
--
ALTER TABLE `citytranslation`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `club`
--
ALTER TABLE `club`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `clubtranslation`
--
ALTER TABLE `clubtranslation`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `competition`
--
ALTER TABLE `competition`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `competition_category`
--
ALTER TABLE `competition_category`
  MODIFY `id` tinyint(2) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `competition_type`
--
ALTER TABLE `competition_type`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `continent`
--
ALTER TABLE `continent`
  MODIFY `id` tinyint(1) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `events_teams`
--
ALTER TABLE `events_teams`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `fm_player`
--
ALTER TABLE `fm_player`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `goal_events`
--
ALTER TABLE `goal_events`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `matchs`
--
ALTER TABLE `matchs`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `match_events`
--
ALTER TABLE `match_events`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `match_player_statistics`
--
ALTER TABLE `match_player_statistics`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `nation`
--
ALTER TABLE `nation`
  MODIFY `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `nation2player`
--
ALTER TABLE `nation2player`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `nationtranslation`
--
ALTER TABLE `nationtranslation`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `player`
--
ALTER TABLE `player`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `player2position`
--
ALTER TABLE `player2position`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `playertranslation`
--
ALTER TABLE `playertranslation`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `position`
--
ALTER TABLE `position`
  MODIFY `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `registrationprofile`
--
ALTER TABLE `registrationprofile`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `round`
--
ALTER TABLE `round`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `season`
--
ALTER TABLE `season`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `team`
--
ALTER TABLE `team`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `teamplayer`
--
ALTER TABLE `teamplayer`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfer`
--
ALTER TABLE `transfer`
  MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarket_competition_category`
--
ALTER TABLE `transfermarket_competition_category`
  MODIFY `id` tinyint(2) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarket_competition_competition`
--
ALTER TABLE `transfermarket_competition_competition`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarket_competition_level`
--
ALTER TABLE `transfermarket_competition_level`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarket_team_player`
--
ALTER TABLE `transfermarket_team_player`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarkt_competition`
--
ALTER TABLE `transfermarkt_competition`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarkt_competition_competition`
--
ALTER TABLE `transfermarkt_competition_competition`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarkt_event`
--
ALTER TABLE `transfermarkt_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarkt_event_event`
--
ALTER TABLE `transfermarkt_event_event`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarkt_match`
--
ALTER TABLE `transfermarkt_match`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarkt_match_match`
--
ALTER TABLE `transfermarkt_match_match`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarkt_nation_nation`
--
ALTER TABLE `transfermarkt_nation_nation`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarkt_player_player`
--
ALTER TABLE `transfermarkt_player_player`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarkt_round`
--
ALTER TABLE `transfermarkt_round`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarkt_round_round`
--
ALTER TABLE `transfermarkt_round_round`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarkt_season_season`
--
ALTER TABLE `transfermarkt_season_season`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarkt_team_team`
--
ALTER TABLE `transfermarkt_team_team`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transfermarkt_transfer_transfer`
--
ALTER TABLE `transfermarkt_transfer_transfer`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `whoscored_event_event`
--
ALTER TABLE `whoscored_event_event`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `whoscored_goals`
--
ALTER TABLE `whoscored_goals`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `whoscored_match_events`
--
ALTER TABLE `whoscored_match_events`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `whoscored_match_match`
--
ALTER TABLE `whoscored_match_match`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `whoscored_match_player_statistics`
--
ALTER TABLE `whoscored_match_player_statistics`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `whoscored_player_player`
--
ALTER TABLE `whoscored_player_player`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `whoscored_registration`
--
ALTER TABLE `whoscored_registration`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `whoscored_team_team`
--
ALTER TABLE `whoscored_team_team`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
