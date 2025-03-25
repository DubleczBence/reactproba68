-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 25. 13:38
-- Kiszolgáló verziója: 10.4.27-MariaDB
-- PHP verzió: 8.2.0

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
  `user_id` int(11) NOT NULL,
  `answer` text NOT NULL,
  `question_id` int(30) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `answers`
--

INSERT INTO `answers` (`id`, `user_id`, `answer`, `question_id`, `date_created`) VALUES
(1, 1, '\"fa\"', 89, '2025-02-26 22:12:03'),
(268, 1, '\"igen\"', 248, '2025-03-15 21:52:43');

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
  `reset_code_expires` datetime DEFAULT NULL,
  `credits` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `companies`
--

INSERT INTO `companies` (`id`, `cegnev`, `telefon`, `ceg_email`, `jelszo`, `telepules`, `megye`, `ceges_szamla`, `hitelkartya`, `adoszam`, `cegjegyzek`, `helyrajziszam`, `createdAt`, `reset_code`, `reset_code_expires`, `credits`) VALUES
(1, 'Ploba.kft', 2147483647, 'plobakft@gmail.com', '$2b$10$eT1rYnYOFLVGLj7uhQhkeuUbiDiBc5K2wjOCkL3Pq5lgHzL6A4y26', 'Cserszegtomaj', 'Zala', 2147483647, 2147483647, 23131313, '1233124536', '1243-3', '2025-02-05 19:22:44', NULL, NULL, 6800),
(2, 'cselszegKft', 2147483647, 'cselszeg@gmail.com', '$2b$10$EquHGzFOap22ijVtMAgNVOaCmYG5eTkIwv1TxDNrsv7PBikP.QaVK', 'Cserszegtomaj', 'Zala', 2147483647, 2147483647, 23432563, '2353252622', '2232-1', '2025-02-11 17:42:43', NULL, NULL, 0),
(3, 'ValamiCég', 2147483647, 'valamikft@gmail.com', '$2b$10$T6a2nj8BoESwmvLF0y96B.twIB9sbrVaSGinQ2w6lab.jS1HMa0Fa', 'Cserszegtomaj', 'Zala', 2147483647, 2147483647, 23432563, '2353252622', '2345-2', '2025-02-12 16:52:20', NULL, NULL, 0),
(4, 'hhdsdh.kft', 2147483647, 'elod@]mail.com', '$2b$10$1kyRepEjOGhK9iDVHwBu2.XDT7iwrplSIR1FWU8fktyBYTYEdDttO', 'Cserszegtomaj', 'Zala', 2147483647, 2147483647, 23432563, '2353252633', '3233/3', '2025-02-19 14:42:03', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `company_connections`
--

CREATE TABLE `company_connections` (
  `id` int(11) NOT NULL,
  `company_id` int(30) NOT NULL,
  `connection_type` enum('survey','transaction') NOT NULL,
  `connection_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `company_connections`
--

INSERT INTO `company_connections` (`id`, `company_id`, `connection_type`, `connection_id`, `created_at`) VALUES
(1, 1, 'survey', 18, '2025-03-14 16:58:05'),
(108, 1, 'transaction', 32, '2025-03-17 21:32:10');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `credit_transactions`
--

CREATE TABLE `credit_transactions` (
  `id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `transaction_type` enum('purchase','spend') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `credit_transactions`
--

INSERT INTO `credit_transactions` (`id`, `amount`, `transaction_type`, `created_at`) VALUES
(1, 1000, 'purchase', '2025-03-08 22:46:17'),
(32, 500, 'purchase', '2025-03-17 21:32:10');

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
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `questions`
--

INSERT INTO `questions` (`id`, `question`, `frm_option`, `type`, `order_by`, `date_created`) VALUES
(63, 'wdadaw', '[{\"id\":1,\"label\":\"dwada\"},{\"id\":\"d4107d0e-2182-4841-aca7-41a895274de5\",\"label\":\"dawdwa\"},{\"id\":\"82205c59-8c2f-4ab7-8665-bcc9ec9f82e5\",\"label\":\"awd\"},{\"id\":\"96869347-02c5-4ba7-93a2-9a85a907a027\",\"label\":\"awda\"}]', 'radio', 0, '2025-02-12 20:02:38'),
(252, 'gjfj', '[{\"id\":\"751b719d-d5a1-4b35-8c59-ba76b5fcb1d8\",\"label\":\"\"}]', 'text', 0, '2025-03-17 21:57:38');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `survey_connections`
--

CREATE TABLE `survey_connections` (
  `id` int(11) NOT NULL,
  `survey_id` int(30) NOT NULL,
  `connection_type` enum('answer','question','transaction') NOT NULL,
  `connection_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `survey_connections`
--

INSERT INTO `survey_connections` (`id`, `survey_id`, `connection_type`, `connection_id`, `created_at`) VALUES
(1, 18, 'question', 63, '2025-03-14 14:31:42'),
(685, 58, 'transaction', 29, '2025-03-17 20:57:38');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `survey_set`
--

CREATE TABLE `survey_set` (
  `id` int(30) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `mintavetel` int(11) NOT NULL DEFAULT 0,
  `vegzettseg` varchar(255) DEFAULT NULL,
  `korcsoport` varchar(255) DEFAULT NULL,
  `regio` varchar(255) DEFAULT NULL,
  `nem` varchar(255) DEFAULT NULL,
  `anyagi` varchar(255) DEFAULT NULL,
  `credit_cost` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `survey_set`
--

INSERT INTO `survey_set` (`id`, `title`, `description`, `start_date`, `end_date`, `date_created`, `mintavetel`, `vegzettseg`, `korcsoport`, `regio`, `nem`, `anyagi`, `credit_cost`, `is_active`) VALUES
(18, 'dadaw', '', '0000-00-00', '0000-00-00', '2025-02-12 20:02:38', 148, NULL, NULL, NULL, '21', NULL, 0, 1),
(58, 'dwasds', '', '0000-00-00', '0000-00-00', '2025-03-17 21:57:38', 353, NULL, NULL, NULL, '20', NULL, 140, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `transaction_type` enum('purchase','survey') NOT NULL,
  `transaction_date` datetime NOT NULL,
  `voucher_name` varchar(255) DEFAULT NULL,
  `survey_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `amount`, `transaction_type`, `transaction_date`, `voucher_name`, `survey_id`) VALUES
(1, 2, 20, 'survey', '2025-03-10 22:54:19', 'gessg', NULL),
(40, 1, 100, 'purchase', '2025-03-17 22:24:21', '3000 Ft', NULL);

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
  `reset_code_expires` datetime DEFAULT NULL,
  `credits` int(11) DEFAULT 0,
  `role` enum('user','admin') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `reset_code`, `reset_code_expires`, `credits`, `role`) VALUES
(1, 'Bence Dublecz', 'dubleczbence@gmail.com', '$2b$10$Ywrk5Vhq2SMcbIs4RgjWB.0cSGFsL4S7hYfqzO2sIaFVWcgqSei8O', NULL, NULL, 59, 'user'),
(1014, 'Admin', 'admin@admin.com', '$2b$10$ZKRYoR6jVbZXZIrZnEiZ2e6k2uHCoK7B/VEyvrhVlMRZP4rax1GKu', NULL, NULL, 0, 'admin');

-- --------------------------------------------------------

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
-- A tábla adatainak kiíratása `users_responses`
--

INSERT INTO `users_responses` (`id`, `user_id`, `korcsoport`, `vegzettseg`, `regio`, `nem`, `anyagi_helyzet`, `created_at`) VALUES
(1, 1, '2005-07-14', '5', '14', '20', '23', '2025-02-05 19:11:38'),
(1014, 1013, '2017-03-16', '6', '17', '20', '27', '2025-03-04 19:18:33');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_connections`
--

CREATE TABLE `user_connections` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `connection_type` enum('voucher','transaction','answer','response') NOT NULL,
  `connection_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `user_connections`
--

INSERT INTO `user_connections` (`id`, `user_id`, `connection_type`, `connection_id`, `created_at`) VALUES
(1, 1, 'voucher', 1, '2025-03-13 23:10:35'),
(1319, 1, 'transaction', 40, '2025-03-17 21:24:21');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `credit_cost` int(11) NOT NULL,
  `purchase_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `vouchers`
--

INSERT INTO `vouchers` (`id`, `user_id`, `name`, `credit_cost`, `purchase_date`) VALUES
(1, 1, '3000 Ft Steam kártya', 100, '2025-03-10 23:15:47'),
(11, 1, '3000 Ft', 100, '2025-03-17 22:24:21');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `question_id` (`question_id`);

--
-- A tábla indexei `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`ceg_email`);

--
-- A tábla indexei `company_connections`
--
ALTER TABLE `company_connections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- A tábla indexei `credit_transactions`
--
ALTER TABLE `credit_transactions`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `survey_connections`
--
ALTER TABLE `survey_connections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `survey_id` (`survey_id`);

--
-- A tábla indexei `survey_set`
--
ALTER TABLE `survey_set`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

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
-- A tábla indexei `user_connections`
--
ALTER TABLE `user_connections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=269;

--
-- AUTO_INCREMENT a táblához `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `company_connections`
--
ALTER TABLE `company_connections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT a táblához `credit_transactions`
--
ALTER TABLE `credit_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT a táblához `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=253;

--
-- AUTO_INCREMENT a táblához `survey_connections`
--
ALTER TABLE `survey_connections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=686;

--
-- AUTO_INCREMENT a táblához `survey_set`
--
ALTER TABLE `survey_set`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT a táblához `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1015;

--
-- AUTO_INCREMENT a táblához `users_responses`
--
ALTER TABLE `users_responses`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1015;

--
-- AUTO_INCREMENT a táblához `user_connections`
--
ALTER TABLE `user_connections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1320;

--
-- AUTO_INCREMENT a táblához `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_3` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `company_connections`
--
ALTER TABLE `company_connections`
  ADD CONSTRAINT `company_connections_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `survey_connections`
--
ALTER TABLE `survey_connections`
  ADD CONSTRAINT `survey_connections_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `survey_set` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `user_connections`
--
ALTER TABLE `user_connections`
  ADD CONSTRAINT `user_connections_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
