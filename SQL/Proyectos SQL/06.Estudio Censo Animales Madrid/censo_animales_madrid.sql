/* =========================================================
   PROYECTO: Censo Animales Madrid 2014-2022
   VERSIÓN DEFINITIVA
   ========================================================= */

CREATE DATABASE IF NOT EXISTS censo_animal;
USE censo_animal;

-- =========================================================
-- 1️⃣ ¿QUÉ ESPECIE DOMINA?
-- =========================================================

SELECT 
    año,
    SUM(perros) AS total_perros,
    SUM(gatos) AS total_gatos,
    ROUND(SUM(perros) / SUM(gatos), 2) AS ratio_perro_gato
FROM censo_animales
GROUP BY año
ORDER BY año;

-- =========================================================
-- 2️⃣ EVOLUCIÓN TOTAL DE MASCOTAS (PERROS + GATOS)
-- =========================================================

SELECT 
    año,
    SUM(perros + gatos) AS total_mascotas,
    ROUND(
        (SUM(perros + gatos) - LAG(SUM(perros + gatos)) OVER (ORDER BY año))
        / LAG(SUM(perros + gatos)) OVER (ORDER BY año) * 100,
    2) AS crecimiento_total_pct
FROM censo_animales
GROUP BY año
ORDER BY año;

-- =========================================================
-- 3️⃣ RANKING COMBINADO POR DISTRITO (2022)
-- =========================================================

SELECT 
    distrito,
    perros,
    gatos,
    (perros + gatos) AS total_animales
FROM censo_animales
WHERE año = 2022
ORDER BY total_animales DESC;

-- =========================================================
-- 4️⃣ DISTRITO CON MAYOR CRECIMIENTO FELINO ABSOLUTO
-- =========================================================

SELECT 
    distrito,
    SUM(CASE WHEN año = 2022 THEN gatos END) -
    SUM(CASE WHEN año = 2014 THEN gatos END) AS crecimiento_gatos_abs
FROM censo_animales
GROUP BY distrito
ORDER BY crecimiento_gatos_abs DESC;

-- =========================================================
-- 5️⃣ RATIO PERRO/GATO POR DISTRITO (2022)
-- =========================================================

SELECT 
    distrito,
    ROUND(perros / gatos, 2) AS ratio_perro_gato
FROM censo_animales
WHERE año = 2022
ORDER BY ratio_perro_gato DESC;

-- =========================================================
-- 6️⃣ ANÁLISIS POR ZONAS (2022)
-- =========================================================

SELECT
    CASE 
        WHEN distrito IN ('Fuencarral-El Pardo','Hortaleza') THEN 'Zona Norte'
        WHEN distrito IN ('Carabanchel','Moratalaz','Puente De Vallecas','Usera','Villaverde','Villa De Vallecas') THEN 'Zona Sur'
        WHEN distrito IN ('Ciudad Lineal','Barajas','San Blas-Canillejas','Vicalvaro') THEN 'Zona Este'
        WHEN distrito IN ('Latina','Moncloa-Aravaca') THEN 'Zona Oeste'
        WHEN distrito IN ('Chamberi','Tetuan','Chamartin','Salamanca','Centro','Retiro','Arganzuela') THEN 'Zona Centro'
        ELSE 'Otra Zona'
    END AS zona,
    SUM(perros) AS total_perros,
    SUM(gatos) AS total_gatos,
    ROUND(SUM(gatos) * 100.0 / SUM(perros + gatos), 2) AS porcentaje_gatos
FROM censo_animales
WHERE año = 2022
GROUP BY zona
ORDER BY zona;

-- =========================================================
-- 7️⃣ ¿SE REDUCE LA BRECHA PERRO-GATO?
-- =========================================================

SELECT 
    año,
    SUM(perros) - SUM(gatos) AS diferencia_absoluta,
    ROUND(SUM(perros) / SUM(gatos), 2) AS ratio
FROM censo_animales
GROUP BY año
ORDER BY año;
