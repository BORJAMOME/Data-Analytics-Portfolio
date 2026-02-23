/* =========================================================
   PROYECTO: Análisis Airbnb Menorca 2022
   AUTOR: Borja
   STACK: MySQL 8.0+
   ========================================================= */

-- =========================================================
-- 0️⃣ Creación y selección de base de datos
-- =========================================================

CREATE DATABASE IF NOT EXISTS Airbnb_Menorca;
USE Airbnb_Menorca;


-- =========================================================
-- 1️⃣ DISTRIBUCIÓN GENERAL
-- =========================================================

-- Top 10 alojamientos con más reseñas
SELECT *
FROM airbnb_menorca
ORDER BY number_of_reviews DESC
LIMIT 10;

-- Número de alojamientos por barrio
SELECT neighbourhood, COUNT(*) AS num_airbnb
FROM airbnb_menorca
GROUP BY neighbourhood
ORDER BY num_airbnb DESC;

-- Top 10 anfitriones con más propiedades
SELECT host_id, COUNT(*) AS num_properties
FROM airbnb_menorca
GROUP BY host_id
ORDER BY num_properties DESC
LIMIT 10;


-- =========================================================
-- 2️⃣ SEGMENTACIÓN POR UBICACIÓN
-- =========================================================

-- Precio medio por barrio (función de ventana)
SELECT DISTINCT neighbourhood,
       ROUND(AVG(price) OVER (PARTITION BY neighbourhood), 2) AS avg_price
FROM airbnb_menorca
ORDER BY avg_price DESC;

-- Precio medio por barrio (formato monetario)
SELECT neighbourhood,
       CONCAT(ROUND(AVG(price), 2), ' €') AS avg_price
FROM airbnb_menorca
GROUP BY neighbourhood
ORDER BY AVG(price) DESC;

-- Precio medio por tipo de habitación y barrio
SELECT neighbourhood,
       room_type,
       ROUND(AVG(price), 2) AS avg_price
FROM airbnb_menorca
GROUP BY neighbourhood, room_type
ORDER BY avg_price DESC;


-- =========================================================
-- 3️⃣ ANÁLISIS POR TIPO DE ALOJAMIENTO
-- =========================================================

-- Número de alojamientos por tipo
SELECT room_type, COUNT(*) AS num_airbnb
FROM airbnb_menorca
GROUP BY room_type
ORDER BY num_airbnb DESC;

-- Disponibilidad media por tipo
SELECT room_type,
       ROUND(AVG(availability_365), 2) AS avg_availability
FROM airbnb_menorca
GROUP BY room_type;

-- Comparación de estancia mínima por tipo y barrio
SELECT neighbourhood,
       room_type,
       ROUND(AVG(minimum_nights), 2) AS avg_min_nights
FROM airbnb_menorca
GROUP BY neighbourhood, room_type;


-- =========================================================
-- 4️⃣ DISPONIBILIDAD Y OCUPACIÓN
-- =========================================================

-- Disponibilidad media por barrio
SELECT neighbourhood,
       ROUND(AVG(availability_365), 2) AS avg_availability
FROM airbnb_menorca
GROUP BY neighbourhood;

-- Estadísticas generales de disponibilidad anual
SELECT 
    ROUND(AVG(availability_365), 2) AS avg_availability,
    MAX(availability_365) AS max_availability,
    MIN(availability_365) AS min_availability
FROM airbnb_menorca;


-- =========================================================
-- 5️⃣ PRECIO Y DEMANDA
-- =========================================================

-- Precio medio según estancia mínima
SELECT minimum_nights,
       ROUND(AVG(price), 2) AS avg_price,
       COUNT(*) AS num_listings
FROM airbnb_menorca
GROUP BY minimum_nights
ORDER BY minimum_nights;

-- Precio medio según rango de reseñas
SELECT 
    CASE 
        WHEN number_of_reviews <= 10 THEN '0-10'
        WHEN number_of_reviews <= 50 THEN '11-50'
        WHEN number_of_reviews <= 100 THEN '51-100'
        ELSE '101+'
    END AS review_range,
    ROUND(AVG(price), 2) AS avg_price
FROM airbnb_menorca
GROUP BY review_range;

-- Reseñas en los últimos 12 meses por barrio
SELECT neighbourhood,
       SUM(number_of_reviews_ltm) AS total_reviews_ltm
FROM airbnb_menorca
GROUP BY neighbourhood;
