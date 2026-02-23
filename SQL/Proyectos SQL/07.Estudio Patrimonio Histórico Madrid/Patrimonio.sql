/* =========================================================
   PROYECTO: Bienes Muebles Histórico-Artísticos
   Madrid 2022
   Autor: Borja
   ========================================================= */

CREATE DATABASE IF NOT EXISTS patrimonio_madrid;
USE patrimonio_madrid;

/* =========================================================
   1️⃣ TOTAL DE BIENES
   ========================================================= */

SELECT 
    COUNT(*) AS total_bienes
FROM bienes;


/* =========================================================
   2️⃣ RANKING DE TIPOLOGÍAS (TOP 5)
   ========================================================= */

SELECT 
    catalogacion,
    COUNT(*) AS total_registros,
    ROUND(
        COUNT(*) * 100.0 / (SELECT COUNT(*) FROM bienes),
        2
    ) AS porcentaje_sobre_total
FROM bienes
GROUP BY catalogacion
ORDER BY total_registros DESC
LIMIT 5;


/* =========================================================
   3️⃣ PORCENTAJE ACUMULADO TOP 5
   ========================================================= */

SELECT 
    ROUND(
        SUM(total) * 100.0 /
        (SELECT COUNT(*) FROM bienes),
        2
    ) AS porcentaje_top5
FROM (
    SELECT COUNT(*) AS total
    FROM bienes
    GROUP BY catalogacion
    ORDER BY total DESC
    LIMIT 5
) AS top5;


/* =========================================================
   4️⃣ CONCENTRACIÓN POR SUBEPÍGRAFE
   ========================================================= */

SELECT 
    subepigrafe,
    COUNT(*) AS total_registros,
    ROUND(
        COUNT(*) * 100.0 / (SELECT COUNT(*) FROM bienes),
        2
    ) AS porcentaje_sobre_total
FROM bienes
GROUP BY subepigrafe
ORDER BY total_registros DESC;


/* =========================================================
   5️⃣ ÍNDICE HHI (CONCENTRACIÓN TIPOLÓGICA)
   ========================================================= */

SELECT 
    ROUND(
        SUM(POWER(share, 2)),
        6
    ) AS hhi
FROM (
    SELECT 
        COUNT(*) /
        (SELECT COUNT(*) FROM bienes) AS share
    FROM bienes
    GROUP BY catalogacion
) AS shares;


/* =========================================================
   6️⃣ ENTROPÍA (DIVERSIDAD TIPOLÓGICA)
   ========================================================= */

SELECT 
    ROUND(
        -SUM(share * LOG2(share)),
        4
    ) AS entropia
FROM (
    SELECT 
        COUNT(*) /
        (SELECT COUNT(*) FROM bienes) AS share
    FROM bienes
    GROUP BY catalogacion
) AS shares;


/* =========================================================
   7️⃣ FRECUENCIA DE PALABRAS EN DESCRIPCIÓN (APROXIMACIÓN)
   ========================================================= */

-- Extrae la primera palabra como aproximación simple
SELECT 
    LOWER(SUBSTRING_INDEX(descripcion, ' ', 1)) AS palabra,
    COUNT(*) AS frecuencia
FROM bienes
GROUP BY palabra
ORDER BY frecuencia DESC
LIMIT 20;
