/* =========================================================
   PROYECTO: Bienes Muebles Histórico-Artísticos
   Madrid 2022
   ========================================================= */

CREATE DATABASE IF NOT EXISTS patrimonio_madrid;
USE patrimonio_madrid;

CREATE TABLE IF NOT EXISTS bienes (
    subepigrafe VARCHAR(255),
    apartado VARCHAR(255),
    catalogacion VARCHAR(255),
    numero_archivo INT,
    descripcion TEXT
);

-- 1️⃣ Total de bienes
SELECT COUNT(*) AS total_bienes
FROM bienes;

-- 2️⃣ Ranking por catalogación
SELECT catalogacion,
       COUNT(*) AS total
FROM bienes
GROUP BY catalogacion
ORDER BY total DESC;

-- 3️⃣ Porcentaje por catalogación
SELECT catalogacion,
       COUNT(*) AS total,
       ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM bienes),2) AS porcentaje
FROM bienes
GROUP BY catalogacion
ORDER BY porcentaje DESC;

-- 4️⃣ Ranking por subepígrafe
SELECT subepigrafe,
       COUNT(*) AS total
FROM bienes
GROUP BY subepigrafe
ORDER BY total DESC;

-- 5️⃣ Diversidad de catalogaciones
SELECT COUNT(DISTINCT catalogacion) AS tipos_distintos
FROM bienes;

-- 6️⃣ Top palabras en descripción (básico)
SELECT 
    SUBSTRING_INDEX(descripcion, ' ', 1) AS primera_palabra,
    COUNT(*) AS frecuencia
FROM bienes
GROUP BY primera_palabra
ORDER BY frecuencia DESC
LIMIT 10;
