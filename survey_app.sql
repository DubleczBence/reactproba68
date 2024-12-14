-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Dec 15. 00:42
-- Kiszolgáló verziója: 10.4.24-MariaDB
-- PHP verzió: 8.1.6

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
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `companies`
--

INSERT INTO `companies` (`id`, `cegnev`, `telefon`, `ceg_email`, `jelszo`, `telepules`, `megye`, `ceges_szamla`, `hitelkartya`, `adoszam`, `cegjegyzek`, `helyrajziszam`, `createdAt`) VALUES
(1, 'Ploba.kft', 2147483647, 'plobakft@gmail.com', '$2b$10$2TqwJ2YUYabvqBUV4NTlzucM2SRTJ8eLBK6Mi8OYa5S1rsgSyMXNe', 'Cserszegtomaj', 'Zala', 2147483647, 2147483647, 324234326, '624346363', '3634634', '2024-12-14 16:13:17'),
(2, 'ValamiCég', 2147483647, 'valamiceg@gmail.com', '$2b$10$EZFHkT.f6GiGh6aQXRyRc.d9CmNVjJLyosgzWQF6S1IYC3F663hq.', 'dwadada', 'dwadwa', 2147483647, 2147483647, 423424234, '2434242', '423423', '2024-12-14 18:05:43'),
(3, 'csgo.fos', 2147483647, 'csgofos@gmail.com', '$2b$10$Zc/SaLslYAZxTgtxQNux4uwVv09uV.XDsStOLoQ7eW11l6NkGn262', 'Cserszegtomaj', 'Zala', 2147483647, 2147483647, 235243564, '53534524', '3224', '2024-12-14 19:42:32');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(1, 'Bence Dublecz', 'dubleczbence@gmail.com', '$2b$10$VrFX9fT3xe.QC3CppHAO0OmOB3/hBGVfPZTjEYBhHIw7uPK7/7UwG'),
(2, 'Trap Antal', 'trabantal@gmail.com', '$2b$10$z9az0CCTfU0khB.e0mStRuKuT6lUGZY2G.I2.sPxs1Qhrs9Xfu2Ji'),
(3, 'ddada', 'ddaa@gmail.com', '$2b$10$/VH20Js/eGzkFPU5oQx/5O88a3.3rRGNvMQLuW2tDiwy70Rrd3LUe'),
(4, 'Gipsz Jakab', 'gipszjakab@gmail.com', '$2b$10$TQotQcXx4aQA5adtLH6vTe0F/cD2Yl8wR665TQLHtlMH2I2l3xjme'),
(5, 'Kutya Máté', 'kutyamate@gmail.com', '$2b$10$yLtfqzTguU4ODelfDbPFvevADBp/wF2B4Zp/1IGt680KNP9cflAvm'),
(6, 'Kiss Péter', 'kisspeter@gmail.com', '$2b$10$CicuT4tmxb2TDzOsIa04yO6KLWYPLChoyoYEEg3rWYgQzRTgs8qfC'),
(7, 'Nagy Jenő', 'nagyjeno@gmail.com', '$2b$10$7qzmJhNDR121wUHFOXNiq.fWgJgDw0balN1DYHlVgagJcGDAIzYVO'),
(8, 'dawdaw', 'dad@gmail.com', '$2b$10$o85IodPE8sNAHYdEMGbLce3H.h3ZPqEYd3ZsSrXBAOhOvQDb05vdK');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`ceg_email`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
