/* =========================================================
   PROYECTO: Censo Animales Madrid 2014-2022
   AUTOR: Borja
   ========================================================= */

CREATE DATABASE IF NOT EXISTS censo_animal;
USE censo_animal;

-- =========================================================
-- 1️⃣ TOTALES GENERALES POR AÑO
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
-- 2️⃣ EVOLUCIÓN INTERANUAL (TASA DE CRECIMIENTO)
-- =========================================================

SELECT 
    año,
    ROUND(
        (SUM(perros) - LAG(SUM(perros)) OVER (ORDER BY año)) 
        / LAG(SUM(perros)) OVER (ORDER BY año) * 100, 2
    ) AS tasa_crecimiento_perros,
    ROUND(
        (SUM(gatos) - LAG(SUM(gatos)) OVER (ORDER BY año)) 
        / LAG(SUM(gatos)) OVER (ORDER BY año) * 100, 2
    ) AS tasa_crecimiento_gatos
FROM censo_animales
GROUP BY año
ORDER BY año;

-- =========================================================
-- 3️⃣ RANKING DISTRITOS (2022)
-- =========================================================

SELECT distrito, perros, gatos
FROM censo_animales
WHERE año = 2022
ORDER BY perros DESC;

-- =========================================================
-- 4️⃣ CRECIMIENTO POR DISTRITO (2014 vs 2022)
-- =========================================================

SELECT 
    distrito,
    ROUND(
        (SUM(CASE WHEN año = 2022 THEN perros END) -
         SUM(CASE WHEN año = 2014 THEN perros END)) 
         / NULLIF(SUM(CASE WHEN año = 2014 THEN perros END),0) * 100, 2
    ) AS crecimiento_perros,
    ROUND(
        (SUM(CASE WHEN año = 2022 THEN gatos END) -
         SUM(CASE WHEN año = 2014 THEN gatos END)) 
         / NULLIF(SUM(CASE WHEN año = 2014 THEN gatos END),0) * 100, 2
    ) AS crecimiento_gatos
FROM censo_animales
GROUP BY distrito
ORDER BY crecimiento_gatos DESC;

-- =========================================================
-- 5️⃣ DIFERENCIA PERROS VS GATOS (2022)
-- =========================================================

SELECT 
    distrito,
    ABS(perros - gatos) AS diferencia_especies
FROM censo_animales
WHERE año = 2022
ORDER BY diferencia_especies DESC;

-- =========================================================
-- 6️⃣ ANÁLISIS POR ZONAS GEOGRÁFICAS (2022)
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
    SUM(gatos) AS total_gatos
FROM censo_animales
WHERE año = 2022
GROUP BY zona
ORDER BY zona;
