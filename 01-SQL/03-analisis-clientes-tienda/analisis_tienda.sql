-- ============================================================================
-- ANÁLISIS DE CLIENTES — TIENDA DE ALIMENTACIÓN
-- ============================================================================
-- Caso de negocio: explotación de datos transaccionales de una tienda de
-- alimentación para segmentar clientes, clasificar productos, detectar
-- patrones de compra y construir rankings cruzados.
--
-- 40 ejercicios en 8 bloques progresivos.
--
-- Técnicas: LEFT JOIN, subqueries (escalares, IN/NOT IN, correlacionadas),
--           CASE, CTEs, Window Functions (RANK, DENSE_RANK, ROW_NUMBER,
--           NTILE, LAG, LEAD), PARTITION BY, sumas acumuladas.
--
-- Autor: Borja Mora Méndez
-- Stack: T-SQL · SQL Server
-- ============================================================================

USE Tienda;
GO


-- ============================================================================
-- BLOQUE 1 — LEFT JOIN
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Todos los clientes con su número de pedidos (aunque no tengan)
-- ----------------------------------------------------------------------------
SELECT
    c.nombre            AS Cliente,
    COUNT(p.id_pedido)  AS Total_Pedidos
FROM clientes c
LEFT JOIN pedidos p ON c.id_cliente = p.id_cliente
GROUP BY c.nombre
ORDER BY Total_Pedidos DESC;


-- ----------------------------------------------------------------------------
-- 2. Clientes sin pedidos
-- ----------------------------------------------------------------------------

SELECT
    c.nombre AS Cliente
FROM clientes c
LEFT JOIN pedidos p ON c.id_cliente = p.id_cliente
WHERE p.id_pedido IS NULL;


-- ----------------------------------------------------------------------------
-- 3. Productos sin ventas
-- ----------------------------------------------------------------------------

SELECT
    pr.nombre AS Producto
FROM productos pr
LEFT JOIN detalle_pedidos dp ON pr.id_producto = dp.id_producto
WHERE dp.id_pedido IS NULL;

-- ----------------------------------------------------------------------------
-- 4. Pedidos sin detalle (si existieran)
-- ----------------------------------------------------------------------------

SELECT
    p.id_pedido AS Pedido
FROM pedidos p
LEFT JOIN detalle_pedidos dp ON p.id_pedido = dp.id_pedido
WHERE dp.id_pedido IS NULL;


-- ----------------------------------------------------------------------------
-- 5. Proveedores sin productos
-- ----------------------------------------------------------------------------

SELECT
    pr.nombre AS Proveedor
FROM proveedores pr
LEFT JOIN productos p ON pr.id_proveedor = p.id_proveedor
WHERE p.id_proveedor IS NULL;


-- ============================================================================
-- BLOQUE 2 — SUBQUERIES BÁSICAS
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 6. Productos más caros que la media
-- ----------------------------------------------------------------------------
SELECT
    pr.nombre AS Nombre,
    pr.precio AS Precio
FROM productos pr
WHERE precio > (SELECT AVG(precio) FROM productos)
ORDER BY precio DESC;


-- ----------------------------------------------------------------------------
-- 7. Clientes con edad superior a la media
-- ----------------------------------------------------------------------------

SELECT
    c.nombre AS Nombre,
    c.edad   AS Edad
FROM clientes c
WHERE edad > (SELECT AVG(edad) FROM clientes)
ORDER BY edad DESC;


-- ----------------------------------------------------------------------------
-- 8. Pedidos con total superior a la media
-- ----------------------------------------------------------------------------

SELECT
    p.id_pedido AS Pedido,
    p.total     AS Total
FROM pedidos p
WHERE p.total > (SELECT AVG(total) FROM pedidos)
ORDER BY p.total DESC;

-- ----------------------------------------------------------------------------
-- 9. Producto con precio máximo
-- ----------------------------------------------------------------------------

SELECT
    pr.nombre AS Nombre,
    pr.precio AS Precio
FROM productos pr
WHERE precio = (SELECT MAX(precio) FROM productos);


-- ----------------------------------------------------------------------------
-- 10. Cliente con edad mínima
-- ----------------------------------------------------------------------------

SELECT
    c.nombre AS Nombre,
    c.edad   AS Edad
FROM clientes c
WHERE edad = (SELECT MIN(edad) FROM clientes);


-- ============================================================================
-- BLOQUE 3 — SUBQUERIES AVANZADAS (IN / NOT IN)
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 11. Clientes que han realizado pedidos
-- ----------------------------------------------------------------------------
SELECT
    c.nombre AS Cliente
FROM clientes c
WHERE c.id_cliente IN (
    SELECT DISTINCT id_cliente FROM pedidos
);


-- ----------------------------------------------------------------------------
-- 12. Clientes que no han realizado pedidos
-- ----------------------------------------------------------------------------

SELECT
    c.nombre AS Cliente
FROM clientes c
WHERE c.id_cliente NOT IN (
    SELECT DISTINCT id_cliente FROM pedidos
);


-- ----------------------------------------------------------------------------
-- 13. Productos vendidos al menos una vez
-- ----------------------------------------------------------------------------

SELECT
    pr.nombre AS Nombre
FROM productos pr
WHERE pr.id_producto IN (
    SELECT DISTINCT id_producto FROM detalle_pedidos
);

-- ----------------------------------------------------------------------------
-- 14. Productos nunca vendidos
-- ----------------------------------------------------------------------------

SELECT
    pr.nombre AS Nombre
FROM productos pr
WHERE pr.id_producto NOT IN (
    SELECT DISTINCT id_producto FROM detalle_pedidos
);


-- ----------------------------------------------------------------------------
-- 15. Clientes con pedidos superiores a 50 €
-- ----------------------------------------------------------------------------

SELECT DISTINCT
    c.nombre AS Cliente
FROM clientes c
JOIN pedidos p ON c.id_cliente = p.id_cliente
WHERE p.total > 50;


-- ============================================================================
-- BLOQUE 4 — CASE (clasificaciones de negocio)
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 16. Clasificar productos por precio (barato / medio / caro)
-- ----------------------------------------------------------------------------
SELECT
    pr.nombre AS Producto,
    pr.precio AS Precio,
    CASE
        WHEN pr.precio < 2              THEN 'Barato'
        WHEN pr.precio BETWEEN 2 AND 5  THEN 'Medio'
        ELSE 'Caro'
    END AS Clasificacion
FROM productos pr
ORDER BY pr.precio ASC;


-- ----------------------------------------------------------------------------
-- 17. Clasificar clientes por edad (joven / adulto / senior)
-- ----------------------------------------------------------------------------

SELECT
    c.nombre AS Cliente,
    c.edad   AS Edad,
    CASE
        WHEN c.edad < 30               THEN 'Joven'
        WHEN c.edad BETWEEN 30 AND 50  THEN 'Adulto'
        ELSE 'Senior'
    END AS Clasificacion
FROM clientes c
ORDER BY edad;

-- ----------------------------------------------------------------------------
-- 18. Clasificar pedidos por importe (bajo / medio / alto)
-- ----------------------------------------------------------------------------

SELECT
    p.id_pedido AS Pedido,
    p.total     AS Importe,
    CASE
        WHEN p.total < 20               THEN 'Bajo'
        WHEN p.total BETWEEN 20 AND 50  THEN 'Medio'
        ELSE 'Alto'
    END AS Clasificacion
FROM pedidos p
ORDER BY Importe DESC;


-- ----------------------------------------------------------------------------
-- 19. Clasificar productos por categoría (texto personalizado)
-- ----------------------------------------------------------------------------

SELECT
    pr.nombre AS Producto,
    c.nombre  AS Categoria,
    CASE
        WHEN c.nombre IN ('Lacteos', 'Bebidas') THEN 'Básica'
        WHEN c.nombre = 'Limpieza'              THEN 'Hogar'
        ELSE 'Otro'
    END AS Tipo
FROM productos pr
JOIN categorias c ON pr.id_categoria = c.id_categoria;

-- ----------------------------------------------------------------------------
-- 20. Etiqueta de cliente VIP (gasto >= 50 €)
-- ----------------------------------------------------------------------------

SELECT
    c.nombre AS Cliente,
    p.total  AS Total,
    CASE
        WHEN p.total >= 50 THEN 'VIP'
        ELSE 'Normal'
    END AS Clasificacion
FROM clientes c
JOIN pedidos p ON c.id_cliente = p.id_cliente
ORDER BY Clasificacion DESC;


-- ============================================================================
-- BLOQUE 5 — COMBINACIÓN (Subquery + HAVING + CASE)
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 21. Clientes con gasto total superior a la media
-- ----------------------------------------------------------------------------

SELECT
    c.nombre     AS Cliente,
    SUM(p.total) AS Gasto_Total
FROM clientes c
JOIN pedidos p ON c.id_cliente = p.id_clienteGROUP BY c.nombre
HAVING SUM(p.total) > (SELECT AVG(total) FROM pedidos)
ORDER BY Gasto_Total DESC;


-- ----------------------------------------------------------------------------
-- 22. Productos con ventas superiores a la media
-- ----------------------------------------------------------------------------

SELECT
    p.nombre AS Producto,
    SUM(dp.cantidad * dp.precio_unitario) AS Ventas
FROM productos p
JOIN detalle_pedidos dp ON p.id_producto = dp.id_producto
GROUP BY p.nombre
HAVING SUM(dp.cantidad * dp.precio_unitario) > (
    SELECT AVG(cantidad * precio_unitario) FROM detalle_pedidos
)
ORDER BY Ventas DESC;


-- ----------------------------------------------------------------------------
-- 23. Categorías con ventas superiores a la media
-- ----------------------------------------------------------------------------

SELECT
    ca.nombre        AS Categoria,
    SUM(dp.cantidad) AS Ventas
FROM categorias ca
JOIN productos p        ON ca.id_categoria = p.id_categoria
JOIN detalle_pedidos dp ON p.id_producto   = dp.id_productoGROUP BY ca.nombre
HAVING SUM(dp.cantidad) > (SELECT AVG(cantidad) FROM detalle_pedidos)
ORDER BY Ventas DESC;


-- ----------------------------------------------------------------------------
-- 24. Clientes con más pedidos que la media
-- ----------------------------------------------------------------------------

SELECT
    c.nombre           AS Cliente,
    COUNT(p.id_pedido) AS Pedidos
FROM clientes c
JOIN pedidos p ON c.id_cliente = p.id_cliente
GROUP BY c.nombre
HAVING COUNT(p.id_pedido) > (
    SELECT AVG(conteo)
    FROM (
        SELECT COUNT(id_pedido) AS conteo
        FROM pedidos
        GROUP BY id_cliente
    ) AS media
)
ORDER BY Pedidos DESC;


-- ----------------------------------------------------------------------------
-- 25. Proveedores con ingresos superiores a la media
-- ----------------------------------------------------------------------------
SELECT
    pr.nombre AS Proveedor,
    SUM(dp.cantidad * dp.precio_unitario) AS Ingresos
FROM proveedores pr
JOIN productos p        ON pr.id_proveedor = p.id_proveedor
JOIN detalle_pedidos dp ON p.id_producto   = dp.id_producto
GROUP BY pr.nombre
HAVING SUM(dp.cantidad * dp.precio_unitario) > (
    SELECT AVG(cantidad * precio_unitario) FROM detalle_pedidos
)
ORDER BY Ingresos DESC;


-- ============================================================================
-- BLOQUE 6 — SUBQUERIES CORRELACIONADAS
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 26. Pedidos mayores que la media de su cliente
-- ----------------------------------------------------------------------------

SELECT
    c.nombre    AS Cliente,
    p.id_pedido AS Pedido,
    p.total     AS Total
FROM pedidos p
JOIN clientes c ON p.id_cliente = c.id_cliente
WHERE p.total > (    SELECT AVG(p2.total)
    FROM pedidos p2
    WHERE p2.id_cliente = p.id_cliente
)
ORDER BY p.total DESC;


-- ----------------------------------------------------------------------------
-- 27. Producto más caro dentro de su categoría
-- ----------------------------------------------------------------------------

SELECT
    p.nombre AS Producto,
    p.precio AS Precio
FROM productos p
WHERE p.precio = (
    SELECT MAX(p2.precio)
    FROM productos p2
    WHERE p2.id_categoria = p.id_categoria
)
ORDER BY p.precio DESC;


-- ----------------------------------------------------------------------------
-- 28. Cliente con el pedido más caro de toda la tienda
-- ----------------------------------------------------------------------------

SELECT
    c.nombre AS Cliente,
    p.total  AS Pedido
FROM clientes c
JOIN pedidos p ON c.id_cliente = p.id_cliente
WHERE p.total = (SELECT MAX(total) FROM pedidos);

-- ----------------------------------------------------------------------------
-- 29. Producto más vendido por categoría
-- ----------------------------------------------------------------------------

SELECT
    p.nombre         AS Producto,
    ca.nombre        AS Categoria,
    SUM(dp.cantidad) AS UnidadesVendidas
FROM productos p
JOIN detalle_pedidos dp ON p.id_producto = dp.id_producto
JOIN categorias ca      ON p.id_categoria = ca.id_categoria
GROUP BY p.nombre, ca.nombre, p.id_categoria
HAVING SUM(dp.cantidad) = (
    SELECT MAX(total_vendido)
    FROM (
        SELECT p2.id_categoria, SUM(dp2.cantidad) AS total_vendido
        FROM detalle_pedidos dp2
        JOIN productos p2 ON dp2.id_producto = p2.id_producto
        GROUP BY p2.id_producto, p2.id_categoria
    ) AS resumen
    WHERE resumen.id_categoria = p.id_categoria
)
ORDER BY ca.nombre;


-- ----------------------------------------------------------------------------
-- 30. Pedido más alto por cliente
-- ----------------------------------------------------------------------------
SELECT
    c.nombre AS Cliente,
    p.total  AS Pedido
FROM pedidos p
JOIN clientes c ON p.id_cliente = c.id_cliente
WHERE p.total = (
    SELECT MAX(p2.total)
    FROM pedidos p2
    WHERE p2.id_cliente = p.id_cliente
)
ORDER BY p.total DESC;


-- ============================================================================
-- BLOQUE 7 — WINDOW FUNCTIONS + CTEs
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 31. Ranking de clientes por gasto total
-- Técnica: RANK() OVER
-- ----------------------------------------------------------------------------

SELECT
    id_cliente       AS Cliente,
    SUM(total)       AS Gasto_Total,
    RANK() OVER (ORDER BY SUM(total) DESC) AS Ranking
FROM pedidos
GROUP BY id_cliente;

-- ----------------------------------------------------------------------------
-- 32. Ranking de productos por ingresos
-- Técnica: RANK() OVER con JOIN
-- ----------------------------------------------------------------------------

SELECT
    p.nombre AS Producto,
    SUM(dp.cantidad * dp.precio_unitario) AS Ingresos,
    RANK() OVER (ORDER BY SUM(dp.cantidad * dp.precio_unitario) DESC) AS Ranking
FROM productos p
JOIN detalle_pedidos dp ON p.id_producto = dp.id_producto
GROUP BY p.nombre;


-- ----------------------------------------------------------------------------
-- 33. Suma acumulada de ventas global
-- Técnica: SUM() OVER (ORDER BY fecha)
-- ----------------------------------------------------------------------------

SELECT
    id_pedido,
    fecha,
    total,
    SUM(total) OVER (ORDER BY fecha) AS Acumulado_Global
FROM pedidos
ORDER BY fecha;

-- ----------------------------------------------------------------------------
-- 34. Incremento de gasto entre pedidos consecutivos por cliente
-- Técnica: LAG() OVER (PARTITION BY)
-- ----------------------------------------------------------------------------

SELECT
    id_cliente,
    id_pedido,
    total                                                                   AS Gasto_Actual,
    LAG(total, 1, 0) OVER (PARTITION BY id_cliente ORDER BY id_pedido)      AS Gasto_Anterior,
    total - LAG(total, 1, 0) OVER (PARTITION BY id_cliente ORDER BY id_pedido) AS Incremento
FROM pedidos
ORDER BY id_cliente, id_pedido;


-- ----------------------------------------------------------------------------
-- 35. Top 2 pedidos por cliente
-- Técnica: ROW_NUMBER() + subquery filtrada
-- ----------------------------------------------------------------------------

SELECT *
FROM (
    SELECT
        id_cliente,
        id_pedido,
        total,
        ROW_NUMBER() OVER (PARTITION BY id_cliente ORDER BY total DESC) AS r
    FROM pedidos
) t
WHERE r <= 2;

-- ============================================================================
-- BLOQUE 8 — CASOS REALES
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 36. Clasificación de clientes según ranking (Top / Normal)
-- Técnica: CTE + DENSE_RANK + CASE
-- ----------------------------------------------------------------------------

WITH ranking AS (
    SELECT
        id_cliente,
        SUM(total)                                     AS total_gastado,
        DENSE_RANK() OVER (ORDER BY SUM(total) DESC)   AS r
    FROM pedidos
    GROUP BY id_cliente
)
SELECT
    id_cliente,
    total_gastado,
    r                                                   AS Ranking,
    CASE WHEN r <= 3 THEN 'Top' ELSE 'Normal' END      AS Categoria
FROM ranking;

-- ----------------------------------------------------------------------------
-- 37. Top 3 clientes por ciudad
-- Técnica: ROW_NUMBER() OVER (PARTITION BY ciudad) + subquery anidada
-- ----------------------------------------------------------------------------

SELECT ciudad, id_cliente, total_compras, r AS Ranking
FROM (
    SELECT
        c.ciudad,
        p.id_cliente,
        SUM(p.total) AS total_compras,
        ROW_NUMBER() OVER (
            PARTITION BY c.ciudad
            ORDER BY SUM(p.total) DESC
        ) AS r
    FROM pedidos p
    JOIN clientes c ON p.id_cliente = c.id_cliente
    GROUP BY c.ciudad, p.id_cliente
) t
WHERE r <= 3;


-- ----------------------------------------------------------------------------
-- 38. Producto más vendido por categoría
-- Técnica: RANK() OVER (PARTITION BY categoría)
-- ----------------------------------------------------------------------------
SELECT id_categoria, id_producto, total_cantidad
FROM (
    SELECT
        p.id_categoria,
        d.id_producto,
        SUM(d.cantidad)                                                 AS total_cantidad,
        RANK() OVER (PARTITION BY p.id_categoria ORDER BY SUM(d.cantidad) DESC) AS r
    FROM detalle_pedidos d
    JOIN productos p ON d.id_producto = p.id_producto
    GROUP BY p.id_categoria, d.id_producto
) t
WHERE r = 1;


-- ----------------------------------------------------------------------------
-- 39. Ranking de proveedores por número de productos
-- Técnica: RANK() OVER con COUNT
-- ----------------------------------------------------------------------------

SELECT
    id_proveedor,
    COUNT(*)                                        AS total_productos,
    RANK() OVER (ORDER BY COUNT(*) DESC)            AS ranking
FROM productos
GROUP BY id_proveedor;


-- ----------------------------------------------------------------------------
-- 40. Dashboard básico SQL — métricas por cliente
-- Técnica: COUNT + SUM + AVG en un solo SELECT
-- ----------------------------------------------------------------------------
SELECT
    id_cliente,
    COUNT(*)    AS pedidos,
    SUM(total)  AS total,
    AVG(total)  AS ticket_medio
FROM pedidos
GROUP BY id_cliente;

-- ============================================================================
-- INSIGHTS DE NEGOCIO
-- ============================================================================
-- 1. Clientes fantasma (ej. 2, 12): detectar clientes registrados sin
--    pedidos permite lanzar campañas de activación dirigidas antes de
--    darlos por perdidos — cada cliente inactivo es coste de captación
--    sin retorno.
--
-- 2. Segmentación VIP (ej. 20, 36): clasificar clientes por gasto con
--    CASE + DENSE_RANK revela que un pequeño grupo genera la mayor
--    parte de los ingresos. Proteger estas cuentas con atención
--    preferente es más rentable que captar nuevos clientes.
--
-- 3. Top 3 por ciudad (ej. 37): el ranking geográfico con PARTITION BY
--    muestra que la distribución de clientes valiosos no es homogénea.
--    Algunas ciudades concentran el gasto — dato clave para decidir
--    dónde abrir nuevos puntos de venta o intensificar distribución.
--
-- 4. Evolución de gasto con LAG (ej. 34): el incremento entre pedidos
--    consecutivos por cliente permite detectar tendencias de abandono
--    (decrementos sostenidos) o de fidelización (incrementos progresivos)
--    a nivel individual, no solo agregado.
--
-- 5. Dashboard SQL (ej. 40): las métricas por cliente (pedidos, total,
--    ticket medio) en un solo SELECT son la base para alimentar un
--    dashboard en Power BI — este query se convierte directamente en
--    la fuente de datos de un informe de gestión comercial.
-- ============================================================================
