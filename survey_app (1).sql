-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 04. 20:23
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `survey_app`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `answers`
--

CREATE TABLE `answers` (
  `id` int(30) NOT NULL,
  `survey_id` int(30) NOT NULL,
  `user_id` int(11) NOT NULL,
  `answer` text NOT NULL,
  `question_id` int(30) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `answers`
--

INSERT INTO `answers` (`id`, `survey_id`, `user_id`, `answer`, `question_id`, `date_created`) VALUES
(1, 25, 1, '\"fa\"', 89, '2025-02-26 22:12:03'),
(2, 25, 1, '[\"a\",\"f\"]', 90, '2025-02-26 22:12:03'),
(3, 25, 1, '\"dwadwa\"', 91, '2025-02-26 22:12:03'),
(4, 27, 1, '\"dwad\"', 95, '2025-03-02 17:28:04'),
(5, 27, 1, '[\"dawddddd\"]', 96, '2025-03-02 17:28:04'),
(6, 27, 1, '\"dwad\"', 97, '2025-03-02 17:28:04'),
(7, 27, 3, '\"dwad\"', 95, '2025-03-02 17:33:17'),
(8, 27, 3, '[\"dawddddd\",\"adaa\"]', 96, '2025-03-02 17:33:17'),
(9, 27, 3, '\"dwa\"', 97, '2025-03-02 17:33:17'),
(10, 25, 1009, '\"fwa\"', 89, '2025-03-04 19:31:17'),
(11, 25, 1009, '[\"f\",\"ffffffwa\"]', 90, '2025-03-04 19:31:17'),
(12, 25, 1009, '\"fesesf\"', 91, '2025-03-04 19:31:17');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `companies`
--

CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `cegnev` varchar(255) NOT NULL,
  `telefon` int(255) NOT NULL,
  `ceg_email` varchar(255) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `telepules` varchar(20) NOT NULL,
  `megye` varchar(20) NOT NULL,
  `ceges_szamla` int(55) NOT NULL,
  `hitelkartya` int(55) NOT NULL,
  `adoszam` int(55) NOT NULL,
  `cegjegyzek` varchar(255) NOT NULL,
  `helyrajziszam` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `reset_code` varchar(5) DEFAULT NULL,
  `reset_code_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `companies`
--

INSERT INTO `companies` (`id`, `cegnev`, `telefon`, `ceg_email`, `jelszo`, `telepules`, `megye`, `ceges_szamla`, `hitelkartya`, `adoszam`, `cegjegyzek`, `helyrajziszam`, `createdAt`, `reset_code`, `reset_code_expires`) VALUES
(1, 'Ploba.kft', 2147483647, 'plobakft@gmail.com', '$2b$10$eT1rYnYOFLVGLj7uhQhkeuUbiDiBc5K2wjOCkL3Pq5lgHzL6A4y26', 'Cserszegtomaj', 'Zala', 2147483647, 2147483647, 23131313, '1233124536', '1243-3', '2025-02-05 19:22:44', NULL, NULL),
(2, 'cselszegKft', 2147483647, 'cselszeg@gmail.com', '$2b$10$EquHGzFOap22ijVtMAgNVOaCmYG5eTkIwv1TxDNrsv7PBikP.QaVK', 'Cserszegtomaj', 'Zala', 2147483647, 2147483647, 23432563, '2353252622', '2232-1', '2025-02-11 17:42:43', NULL, NULL),
(3, 'ValamiCég', 2147483647, 'valamikft@gmail.com', '$2b$10$T6a2nj8BoESwmvLF0y96B.twIB9sbrVaSGinQ2w6lab.jS1HMa0Fa', 'Cserszegtomaj', 'Zala', 2147483647, 2147483647, 23432563, '2353252622', '2345-2', '2025-02-12 16:52:20', NULL, NULL),
(4, 'hhdsdh.kft', 2147483647, 'elod@]mail.com', '$2b$10$1kyRepEjOGhK9iDVHwBu2.XDT7iwrplSIR1FWU8fktyBYTYEdDttO', 'Cserszegtomaj', 'Zala', 2147483647, 2147483647, 23432563, '2353252633', '3233/3', '2025-02-19 14:42:03', NULL, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `questions`
--

CREATE TABLE `questions` (
  `id` int(30) NOT NULL,
  `question` text NOT NULL,
  `frm_option` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `order_by` int(11) NOT NULL,
  `survey_id` int(30) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `questions`
--

INSERT INTO `questions` (`id`, `question`, `frm_option`, `type`, `order_by`, `survey_id`, `date_created`) VALUES
(63, 'wdadaw', '[{\"id\":1,\"label\":\"dwada\"},{\"id\":\"d4107d0e-2182-4841-aca7-41a895274de5\",\"label\":\"dawdwa\"},{\"id\":\"82205c59-8c2f-4ab7-8665-bcc9ec9f82e5\",\"label\":\"awd\"},{\"id\":\"96869347-02c5-4ba7-93a2-9a85a907a027\",\"label\":\"awda\"}]', 'radio', 0, 18, '2025-02-12 20:02:38'),
(64, 'daw', '[{\"id\":\"fbb3435d-b684-40ec-9027-38d792d1ab53\",\"label\":\"dawd\"},{\"id\":\"cf21b2db-33f6-4e09-9531-c5f6247fa486\",\"label\":\"adwa\"},{\"id\":\"318e4f6b-9e87-4a1b-b7f9-e9118dc4eb49\",\"label\":\"awdda\"},{\"id\":\"4f007f3d-c6de-41d9-a889-2cbd165ad267\",\"label\":\"adw\"}]', 'checkbox', 0, 18, '2025-02-12 20:02:38'),
(65, 'dad', '[{\"id\":\"5055bbad-bf2d-4d5c-8610-62703fabb4f5\",\"label\":\"\"},{\"id\":\"a5ddc31d-4f01-4659-a32f-275761d0dff4\",\"label\":\"Option 2\"}]', 'text', 0, 18, '2025-02-12 20:02:38'),
(66, 'dawd', '[{\"id\":\"6790db23-7b48-48b7-951a-f536bc1af4ea\",\"label\":\"daw\"},{\"id\":\"0c5ed2bc-bd07-4f99-aa26-b489adf708b6\",\"label\":\"awda\"},{\"id\":\"887d2a38-9130-49c4-a2f7-159c2cf97598\",\"label\":\"awda\"},{\"id\":\"00e2c87f-466d-4c86-b31d-fbe2858c3425\",\"label\":\"daw\"}]', 'checkbox', 0, 18, '2025-02-12 20:02:39'),
(67, 'wdadawdawd', '[{\"id\":1,\"label\":\"d\"},{\"id\":\"d4107d0e-2182-4841-aca7-41a895274de5\",\"label\":\"dawdwaa\"},{\"id\":\"82205c59-8c2f-4ab7-8665-bcc9ec9f82e5\",\"label\":\"awdda\"},{\"id\":\"96869347-02c5-4ba7-93a2-9a85a907a027\",\"label\":\"awdad\"},{\"id\":\"fd20b8b1-7ac5-4cc2-94b9-6285458b194f\",\"label\":\"dawdd\"}]', 'radio', 0, 19, '2025-02-12 20:04:14'),
(68, 'dawddd', '[{\"id\":\"fbb3435d-b684-40ec-9027-38d792d1ab53\",\"label\":\"dawda\"},{\"id\":\"cf21b2db-33f6-4e09-9531-c5f6247fa486\",\"label\":\"adwad\"},{\"id\":\"318e4f6b-9e87-4a1b-b7f9-e9118dc4eb49\",\"label\":\"awddaa\"},{\"id\":\"4f007f3d-c6de-41d9-a889-2cbd165ad267\",\"label\":\"adw\"}]', 'checkbox', 0, 19, '2025-02-12 20:04:14'),
(69, 'daddd', '[{\"id\":\"5055bbad-bf2d-4d5c-8610-62703fabb4f5\",\"label\":\"\"},{\"id\":\"a5ddc31d-4f01-4659-a32f-275761d0dff4\",\"label\":\"Option 2\"}]', 'text', 0, 19, '2025-02-12 20:04:14'),
(70, 'dawdaaa', '[{\"id\":\"6790db23-7b48-48b7-951a-f536bc1af4ea\",\"label\":\"dawda\"},{\"id\":\"0c5ed2bc-bd07-4f99-aa26-b489adf708b6\",\"label\":\"awdada\"},{\"id\":\"887d2a38-9130-49c4-a2f7-159c2cf97598\",\"label\":\"awdaad\"},{\"id\":\"00e2c87f-466d-4c86-b31d-fbe2858c3425\",\"label\":\"dawda\"},{\"id\":\"192a9cc4-bb44-44b7-9dcb-9a233c667907\",\"label\":\"adad\"}]', 'checkbox', 0, 19, '2025-02-12 20:04:14'),
(71, 'dwad', '[{\"id\":1,\"label\":\"waddwa\"},{\"id\":\"2bd2eb88-a755-4cc5-a5b2-592739e2ac22\",\"label\":\"dwadaw\"},{\"id\":\"713bd0ac-ed0f-48b6-b12f-6eb8637f86d4\",\"label\":\"dwa\"},{\"id\":\"2c638023-0f66-4243-8d54-3cd0071012c8\",\"label\":\"daw\"}]', 'radio', 0, 20, '2025-02-12 20:28:31'),
(72, 'da', '[{\"id\":\"ebae6fbf-1170-4aa4-983a-c1dd021ccbd0\",\"label\":\"dwad\"},{\"id\":\"72170922-da17-4e45-a488-e48470ab2aa7\",\"label\":\"adw\"},{\"id\":\"f684875c-54c1-4da7-8595-494b1dfa06d8\",\"label\":\"daw\"}]', 'checkbox', 0, 20, '2025-02-12 20:28:31'),
(73, 'da', '[{\"id\":\"be7c7ed4-6407-4a1f-8b7c-53b09a9b7209\",\"label\":\"\"}]', 'text', 0, 20, '2025-02-12 20:28:31'),
(74, 'dwa', '[{\"id\":\"a19a421e-5e13-470e-a4ef-8f7a087e07d2\",\"label\":\"dwa\"},{\"id\":\"de35b21b-c183-4867-a812-b7bd533ed42d\",\"label\":\"daw\"},{\"id\":\"35ce03a6-dedd-4ad1-9b99-05251abe6b4f\",\"label\":\"ddd\"}]', 'radio', 0, 20, '2025-02-12 20:28:31'),
(75, 'dwadwa', '[{\"id\":1,\"label\":\"daw\"},{\"id\":\"f4233cc2-ed66-401f-a38d-8ba1683d0f97\",\"label\":\"awd\"},{\"id\":\"0040f87d-908b-4eb4-ba08-8a284ce4e579\",\"label\":\"dawd\"},{\"id\":\"6a2ae133-fb47-4a13-8001-2b8d485c29c0\",\"label\":\"dwa\"}]', 'radio', 0, 21, '2025-02-19 16:01:41'),
(76, 'dawdwa', '[{\"id\":\"f282939a-9da2-43e3-8291-a2cd715443e9\",\"label\":\"wdadwa\"},{\"id\":\"a0663e3e-0c16-4c28-8e04-17c6bfa9d4bd\",\"label\":\"dwadwa\"},{\"id\":\"8e10a235-b3f9-4d1c-86c6-64523adf91d0\",\"label\":\"dwa\"},{\"id\":\"d695ec8c-f5bd-4b3e-9350-204a2353ab9e\",\"label\":\"dwa\"}]', 'checkbox', 0, 21, '2025-02-19 16:01:41'),
(77, 'dawda', '[{\"id\":\"fc08ecfe-62f1-4d13-a304-23c00cec6904\",\"label\":\"\"}]', 'text', 0, 21, '2025-02-19 16:01:41'),
(78, 'aaaa', '[{\"id\":1,\"label\":\"dwadwa\"},{\"id\":\"cf52a21d-f66d-47f3-9c39-75bc196fa2f9\",\"label\":\"dawdwa\"},{\"id\":\"b5e01f3f-b301-43fa-a21e-c6b8c10a4da9\",\"label\":\"awdawd\"},{\"id\":\"7c207f25-5612-4579-abf7-570d43f29fed\",\"label\":\"dawdaw\"},{\"id\":\"f679107c-7165-4001-9a4d-bed4ba18d8d9\",\"label\":\"dwada\"}]', 'radio', 0, 22, '2025-02-19 19:34:02'),
(79, 'dwad', '[{\"id\":\"2b23d10a-b05e-4cee-94dd-6db6fe079440\",\"label\":\"dwad\"},{\"id\":\"495696e5-0095-489d-a0d5-8db22a0b54b5\",\"label\":\"dawd\"},{\"id\":\"fb77acc7-1edc-4f14-b7ae-07aa3d7dee2f\",\"label\":\"daw\"},{\"id\":\"6966173e-436f-4d54-93d9-7c9397fbbfcc\",\"label\":\"ddd\"}]', 'checkbox', 0, 22, '2025-02-19 19:34:02'),
(80, 'dawd', '[{\"id\":\"f1ba5087-1d66-4805-8c0b-d09516b8ab98\",\"label\":\"\"}]', 'text', 0, 22, '2025-02-19 19:34:02'),
(81, 'dwadwad', '[{\"id\":1,\"label\":\"dwad\"},{\"id\":\"3f40c30a-e38a-4bf1-80f7-b0d2cae77d7c\",\"label\":\"dwadwa\"},{\"id\":\"19208970-36c9-440a-b3be-39f0c5f6d998\",\"label\":\"daw\"},{\"id\":\"b5db4507-e6f3-4a36-8331-2000d8a252a6\",\"label\":\"dddddddd\"}]', 'radio', 0, 23, '2025-02-21 20:29:05'),
(82, 'dwad', '[{\"id\":\"cca6136f-6265-44a3-b4fe-df6ae15ba473\",\"label\":\"dwa\"},{\"id\":\"04c71e24-7b71-4ea9-824a-e8d609862f2f\",\"label\":\"daw\"},{\"id\":\"769a7900-7dd9-4452-b8dc-ceac9d8c4266\",\"label\":\"dwa\"},{\"id\":\"741f4161-b8ce-4f26-b32d-e79926c957bb\",\"label\":\"dwa\"}]', 'checkbox', 0, 23, '2025-02-21 20:29:05'),
(83, 'dad', '[{\"id\":\"68fa7d21-26a0-4c63-a3e3-e4dd6a19c568\",\"label\":\"d\"},{\"id\":\"e2afe0ae-7feb-408e-b299-249fdd0578c5\",\"label\":\"dddd\"},{\"id\":\"f95d0adb-c253-4af7-9d3b-6bcbe9cfaf4b\",\"label\":\"aaadawdd\"}]', 'radio', 0, 23, '2025-02-21 20:29:05'),
(84, 'll', '[{\"id\":\"8c84cddd-8e57-4234-ac0a-976f83300ce8\",\"label\":\"\"}]', 'text', 0, 23, '2025-02-21 20:29:05'),
(85, 'dwa', '[{\"id\":1,\"label\":\"dwad\"},{\"id\":\"b42b33e7-f84a-43cb-a241-430f7bc5d2d4\",\"label\":\"dada\"},{\"id\":\"4fb20f30-2d6d-4930-a641-a5a90da074be\",\"label\":\"dadawddda\"}]', 'radio', 0, 24, '2025-02-21 20:37:01'),
(86, 'da', '[{\"id\":\"27a0256d-18d5-427c-b938-973c0aa3e31b\",\"label\":\"dada\"},{\"id\":\"bcc26ec0-4288-45d1-b3df-669211ecae53\",\"label\":\"aaaaaaaaa\"},{\"id\":\"23416cb3-6c5e-4968-9d8f-aad9a40d4e69\",\"label\":\"dddddddddd\"}]', 'checkbox', 0, 24, '2025-02-21 20:37:01'),
(87, 'dwad', '[{\"id\":\"a720c3f1-9b61-4e66-8146-b14f5b1865a7\",\"label\":\"ddddddddd\"},{\"id\":\"803f73a0-5cb7-48f4-987f-b5ee74bc2503\",\"label\":\"ddddddddddddddda\"},{\"id\":\"5d2ed9ea-c0de-4bf3-b46c-fc1103d3ba92\",\"label\":\"addaad\"}]', 'radio', 0, 24, '2025-02-21 20:37:01'),
(88, 'dawaddad', '[{\"id\":\"c8ee137d-9769-4949-b7d5-25153a2e464a\",\"label\":\"\"}]', 'text', 0, 24, '2025-02-21 20:37:02'),
(89, 'fwa', '[{\"id\":1,\"label\":\"fwa\"},{\"id\":\"be282db5-71cb-4838-9d2d-edb06e916f7e\",\"label\":\"fa\"},{\"id\":\"021b7d10-6d9e-422e-b9f6-e7008efc10ed\",\"label\":\"faaa\"},{\"id\":\"9fd226d1-0d63-4350-8eb2-a98798839e75\",\"label\":\"ffffff\"}]', 'radio', 0, 25, '2025-02-26 22:11:28'),
(90, 'ffaf', '[{\"id\":\"6933b884-2ec6-487c-8106-2a5a792669f1\",\"label\":\"f\"},{\"id\":\"88e0b7ae-0708-4ea0-8977-86ed1afc5b8d\",\"label\":\"a\"},{\"id\":\"80ec3dfa-b6f7-49b3-adaf-3f129fd4f2bd\",\"label\":\"ffffffwa\"}]', 'checkbox', 0, 25, '2025-02-26 22:11:28'),
(91, 'ffa', '[{\"id\":\"d57615a8-ac71-4bba-bea1-8d66570643c4\",\"label\":\"\"}]', 'text', 0, 25, '2025-02-26 22:11:28'),
(92, 'ges', '[{\"id\":1,\"label\":\"ges\"},{\"id\":\"6591b50f-9bc9-4c1b-a51f-914a0e783cd4\",\"label\":\"gsegse\"}]', 'radio', 0, 26, '2025-02-27 22:25:15'),
(93, 'gesh', '[{\"id\":\"398da9e5-6a8e-43e1-aff9-c4aadb211dd4\",\"label\":\"hrd\"},{\"id\":\"18871dc0-253c-42fc-92f5-985ec8419ea7\",\"label\":\"jjgfj\"},{\"id\":\"44ad52d7-e1b2-46bc-a5e5-dadf350d7531\",\"label\":\"khgk\"}]', 'checkbox', 0, 26, '2025-02-27 22:25:15'),
(94, 'khg', '[{\"id\":\"5712635f-0dce-4296-9c9f-49255a330b1d\",\"label\":\"\"}]', 'text', 0, 26, '2025-02-27 22:25:15'),
(95, 'dwadwa', '[{\"id\":1,\"label\":\"dwad\"},{\"id\":\"b61605ba-4b86-41b8-a5f5-bd5b278132a6\",\"label\":\"dwa\"}]', 'radio', 0, 27, '2025-02-27 22:42:14'),
(96, 'dawd', '[{\"id\":\"75486b62-1c4e-4f20-bc16-0ad4eb86de62\",\"label\":\"dawd\"},{\"id\":\"ef3d0c21-8d3d-4f4f-808b-5e9139f86632\",\"label\":\"dawddddd\"},{\"id\":\"c0c8076b-2f83-4ddf-b0f3-4f30679085f1\",\"label\":\"adaa\"}]', 'checkbox', 0, 27, '2025-02-27 22:42:14'),
(97, 'daw', '[{\"id\":\"d9277940-842b-4c6f-9861-942b51880f15\",\"label\":\"\"}]', 'text', 0, 27, '2025-02-27 22:42:14');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `survey_set`
--

CREATE TABLE `survey_set` (
  `id` int(30) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `ceg_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `mintavetel` int(11) NOT NULL DEFAULT 0,
  `vegzettseg` varchar(255) DEFAULT NULL,
  `korcsoport` varchar(255) DEFAULT NULL,
  `regio` varchar(255) DEFAULT NULL,
  `nem` varchar(255) DEFAULT NULL,
  `anyagi` varchar(255) DEFAULT NULL,
  `credit_cost` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `survey_set`
--

INSERT INTO `survey_set` (`id`, `title`, `description`, `ceg_id`, `start_date`, `end_date`, `date_created`, `mintavetel`, `vegzettseg`, `korcsoport`, `regio`, `nem`, `anyagi`, `credit_cost`) VALUES
(18, 'dadaw', '', 1, '0000-00-00', '0000-00-00', '2025-02-12 20:02:38', 148, NULL, NULL, NULL, '21', NULL, 0),
(19, 'dadawda', '', 1, '0000-00-00', '0000-00-00', '2025-02-12 20:04:14', 173, NULL, NULL, NULL, '20', NULL, 0),
(20, 'dadw', '', 1, '0000-00-00', '0000-00-00', '2025-02-12 20:28:31', 182, NULL, NULL, NULL, '20', NULL, 0),
(21, 'hdjhwa', '', 4, '0000-00-00', '0000-00-00', '2025-02-19 16:01:40', 300, NULL, NULL, NULL, '20', NULL, 0),
(22, 'NA Na NA', '', 1, '0000-00-00', '0000-00-00', '2025-02-19 19:34:02', 167, NULL, NULL, NULL, '20', NULL, 0),
(23, 'dwadwa', '', 1, '0000-00-00', '0000-00-00', '2025-02-21 20:29:05', 154, NULL, NULL, NULL, NULL, '25', 0),
(24, 'll', '', 1, '0000-00-00', '0000-00-00', '2025-02-21 20:37:01', 132, NULL, NULL, '16', NULL, NULL, 90),
(25, 'sfa', '', 1, '0000-00-00', '0000-00-00', '2025-02-26 22:11:28', 274, NULL, NULL, NULL, '20', NULL, 60),
(26, 'gessg', '', 1, '0000-00-00', '0000-00-00', '2025-02-27 22:25:15', 220, NULL, NULL, NULL, '20', NULL, 60),
(27, 'dwadwa', '', 1, '0000-00-00', '0000-00-00', '2025-02-27 22:42:14', 341, NULL, NULL, NULL, '20', NULL, 60);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `reset_code` varchar(5) DEFAULT NULL,
  `reset_code_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



--
-- Tábla szerkezet ehhez a táblához `users_responses`
--

CREATE TABLE `users_responses` (
  `id` int(255) NOT NULL,
  `user_id` int(255) NOT NULL,
  `korcsoport` date NOT NULL,
  `vegzettseg` varchar(255) NOT NULL,
  `regio` varchar(255) NOT NULL,
  `nem` varchar(255) NOT NULL,
  `anyagi_helyzet` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



--
-- A tábla indexei `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `survey_id` (`survey_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `question_id` (`question_id`);

--
-- A tábla indexei `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`ceg_email`);

--
-- A tábla indexei `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `survey_id` (`survey_id`);

--
-- A tábla indexei `survey_set`
--
ALTER TABLE `survey_set`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ceg_id` (`ceg_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A tábla indexei `users_responses`
--
ALTER TABLE `users_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT a táblához `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT a táblához `survey_set`
--
ALTER TABLE `survey_set`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1014;

--
-- AUTO_INCREMENT a táblához `users_responses`
--
ALTER TABLE `users_responses`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1015;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `survey_set` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `answers_ibfk_3` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `survey_set` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `survey_set`
--
ALTER TABLE `survey_set`
  ADD CONSTRAINT `survey_set_ibfk_1` FOREIGN KEY (`ceg_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `users_responses`
--
ALTER TABLE `users_responses`
  ADD CONSTRAINT `users_responses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
