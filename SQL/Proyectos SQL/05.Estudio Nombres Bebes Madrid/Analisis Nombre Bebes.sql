/* =========================================================
   PROYECTO: Nombres Bebé Madrid 2022
   AUTOR: Borja
   ========================================================= */

CREATE DATABASE IF NOT EXISTS names;
USE names;

CREATE TABLE IF NOT EXISTS baby_names (
  year INT,
  name VARCHAR(64),
  gender VARCHAR(1),
  num INT
);

-- Total bebés
SELECT SUM(num) AS total_babies
FROM baby_names
WHERE year = 2022;

-- Nombres únicos
SELECT COUNT(DISTINCT name) AS unique_names
FROM baby_names
WHERE year = 2022;

-- Top 5 concentración
SELECT SUM(num) / 
      (SELECT SUM(num) FROM baby_names WHERE year = 2022) AS top5_share
FROM (
    SELECT num
    FROM baby_names
    WHERE year = 2022
    ORDER BY num DESC
    LIMIT 5
) AS top5;

-- Top 10 concentración
SELECT SUM(num) / 
      (SELECT SUM(num) FROM baby_names WHERE year = 2022) AS top10_share
FROM (
    SELECT num
    FROM baby_names
    WHERE year = 2022
    ORDER BY num DESC
    LIMIT 10
) AS top10;

-- Top 20 concentración
SELECT SUM(num) / 
      (SELECT SUM(num) FROM baby_names WHERE year = 2022) AS top20_share
FROM (
    SELECT num
    FROM baby_names
    WHERE year = 2022
    ORDER BY num DESC
    LIMIT 20
) AS top20;

-- HHI
SELECT SUM(POWER(share,2)) AS hhi
FROM (
    SELECT num / (SELECT SUM(num) FROM baby_names WHERE year = 2022) AS share
    FROM baby_names
    WHERE year = 2022
) AS shares;

-- Entropía
SELECT -SUM(share * LOG2(share)) AS entropy
FROM (
    SELECT num / (SELECT SUM(num) FROM baby_names WHERE year = 2022) AS share
    FROM baby_names
    WHERE year = 2022
) AS shares;

-- Probabilidad por género
SELECT name,
       SUM(num) AS total_name_count,
       (SUM(num) / (SELECT SUM(num) FROM baby_names WHERE year = 2022 AND gender = 'M')) * 100 AS probabilidad
FROM baby_names
WHERE year = 2022 AND gender = 'M'
GROUP BY name;

SELECT name,
       SUM(num) AS total_name_count,
       (SUM(num) / (SELECT SUM(num) FROM baby_names WHERE year = 2022 AND gender = 'F')) * 100 AS probabilidad
FROM baby_names
WHERE year = 2022 AND gender = 'F'
GROUP BY name;
