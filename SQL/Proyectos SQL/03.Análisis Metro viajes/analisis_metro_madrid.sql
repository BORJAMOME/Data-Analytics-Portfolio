/* =========================================================
   PROYECTO: Análisis de Pasajeros del Metro de Madrid
   AUTOR: Borja
   STACK: MySQL 8.0+
   ========================================================= */

-- =========================================================
-- 1️⃣ CREACIÓN DE BASE DE DATOS Y TABLA
-- =========================================================

CREATE DATABASE IF NOT EXISTS metro;
USE metro;

CREATE TABLE IF NOT EXISTS metro_madrid (
    Linea INT,
    Mes VARCHAR(20),
    Valores INT
);

-- =========================================================
-- 2️⃣ ANÁLISIS POR LÍNEA
-- =========================================================

-- Total de pasajeros por línea durante todo el año
SELECT Linea, 
       SUM(Valores) AS Total_Pasajeros
FROM metro_madrid
GROUP BY Linea
ORDER BY Total_Pasajeros DESC;

-- Promedio de pasajeros por línea durante el año
SELECT Linea, 
       ROUND(AVG(Valores), 2) AS Promedio_Pasajeros
FROM metro_madrid
GROUP BY Linea
ORDER BY Promedio_Pasajeros DESC;

-- Porcentaje de pasajeros por línea respecto al total anual
SELECT Linea, 
       SUM(Valores) AS Total_Pasajeros, 
       ROUND(
           SUM(Valores) * 100.0 / (SELECT SUM(Valores) FROM metro_madrid),
           2
       ) AS Porcentaje_Total
FROM metro_madrid
GROUP BY Linea
ORDER BY Porcentaje_Total DESC;

-- Mes con mayor número de pasajeros para cada línea
SELECT Linea, Mes, Valores
FROM metro_madrid
WHERE (Linea, Valores) IN (
    SELECT Linea, MAX(Valores)
    FROM metro_madrid
    GROUP BY Linea
)
ORDER BY Linea;

-- Mes con menor número de pasajeros para cada línea
SELECT Linea, Mes, Valores
FROM metro_madrid
WHERE (Linea, Valores) IN (
    SELECT Linea, MIN(Valores)
    FROM metro_madrid
    GROUP BY Linea
)
ORDER BY Linea;

-- =========================================================
-- 3️⃣ ANÁLISIS MENSUAL
-- =========================================================

-- Pasajeros mensuales por línea
SELECT Linea, 
       Mes, 
       SUM(Valores) AS Total_Pasajeros
FROM metro_madrid
GROUP BY Linea, Mes
ORDER BY Linea, Mes;

-- =========================================================
-- 4️⃣ ANÁLISIS GLOBAL DE LA RED
-- =========================================================

-- Mes con mayor número de pasajeros global
SELECT Mes, 
       SUM(Valores) AS Total_Pasajeros
FROM metro_madrid
GROUP BY Mes
ORDER BY Total_Pasajeros DESC
LIMIT 1;

-- Mes con menor número de pasajeros global
SELECT Mes, 
       SUM(Valores) AS Total_Pasajeros
FROM metro_madrid
GROUP BY Mes
ORDER BY Total_Pasajeros ASC
LIMIT 1;
