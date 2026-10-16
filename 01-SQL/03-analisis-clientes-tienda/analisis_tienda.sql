-- ============================================================================
-- ANÁLISIS DE CLIENTES: TIENDA DE ALIMENTACIÓN
-- ============================================================================
-- Caso de negocio: explotación de datos transaccionales de una tienda de
-- alimentación para segmentar clientes, clasificar productos, detectar
-- patrones de compra y construir rankings cruzados.
--
-- 41 ejercicios en 8 bloques progresivos.
--
-- Técnicas: LEFT JOIN, subqueries (escalares, IN, NOT EXISTS,
--           correlacionadas), CASE, CTEs, Window Functions (RANK,
--           DENSE_RANK, ROW_NUMBER, NTILE, LAG), PARTITION BY, sumas
--           acumuladas.
--
-- Datos: ejecutar antes 00_schema_y_datos.sql, que crea TiendaDB con datos
-- sintéticos (20 clientes, 20 productos, 300 pedidos de 2024).
--
-- Métricas:
--   - Gasto / ventas de un pedido: pedidos.total.
--   - Ventas de un producto: SUM(cantidad × precio_unitario) del detalle.
--   El bloque 0 comprueba que ambas fuentes cuadran.
-- Todas las agregaciones agrupan por la clave (id) y muestran el nombre.
-- Bajo cada consulta se indica el resultado obtenido con estos datos.
--
-- Autor: Borja Mora Méndez
-- Stack: T-SQL · SQL Server
-- ============================================================================

USE TiendaDB;
GO


-- ============================================================================
-- BLOQUE 0: CONTROL DE CALIDAD
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Pedidos cuyo total no cuadra con la suma de sus líneas
-- ----------------------------------------------------------------------------
SELECT
    p.id_pedido,
    p.total                                 AS Total_Cabecera,
    SUM(dp.cantidad * dp.precio_unitario)   AS Total_Lineas
FROM pedidos p
JOIN detalle_pedidos dp ON p.id_pedido = dp.id_pedido
GROUP BY p.id_pedido, p.total
HAVING p.total <> SUM(dp.cantidad * dp.precio_unitario);
-- Resultado: 0 filas: los 300 pedidos cuadran con sus líneas, así que se
--            pueden usar pedidos.total y el detalle indistintamente.


-- ============================================================================
-- BLOQUE 1: LEFT JOIN
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Todos los clientes con su número de pedidos (aunque no tengan)
-- ----------------------------------------------------------------------------
SELECT
    c.nombre            AS Cliente,
    COUNT(p.id_pedido)  AS Total_Pedidos
FROM clientes c
LEFT JOIN pedidos p ON c.id_cliente = p.id_cliente
GROUP BY c.id_cliente, c.nombre
ORDER BY Total_Pedidos DESC, Cliente;
-- Resultado: Alberto lidera con 61 pedidos; Hugo e Irene tienen 0.


-- ----------------------------------------------------------------------------
-- 2. Clientes sin pedidos
-- ----------------------------------------------------------------------------

SELECT
    c.nombre AS Cliente
FROM clientes c
LEFT JOIN pedidos p ON c.id_cliente = p.id_cliente
WHERE p.id_pedido IS NULL;
-- Resultado: 2 clientes sin pedidos: Hugo e Irene.


-- ----------------------------------------------------------------------------
-- 3. Productos sin ventas
-- ----------------------------------------------------------------------------

SELECT
    pr.nombre AS Producto
FROM productos pr
LEFT JOIN detalle_pedidos dp ON pr.id_producto = dp.id_producto
WHERE dp.id_detalle IS NULL;
-- Resultado: 1 producto sin ventas: Azucar.

-- ----------------------------------------------------------------------------
-- 4. Pedidos sin detalle (si existieran)
-- ----------------------------------------------------------------------------

SELECT
    p.id_pedido AS Pedido
FROM pedidos p
LEFT JOIN detalle_pedidos dp ON p.id_pedido = dp.id_pedido
WHERE dp.id_detalle IS NULL;
-- Resultado: 0 filas: todos los pedidos tienen detalle.


-- ----------------------------------------------------------------------------
-- 5. Proveedores sin productos
-- ----------------------------------------------------------------------------

SELECT
    pv.nombre AS Proveedor
FROM proveedores pv
LEFT JOIN productos pr ON pv.id_proveedor = pr.id_proveedor
WHERE pr.id_producto IS NULL
ORDER BY pv.nombre;
-- Resultado: 10 de los 20 proveedores no tienen ningún producto en catálogo.


-- ============================================================================
-- BLOQUE 2: SUBQUERIES BÁSICAS
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 6. Productos más caros que la media
-- ----------------------------------------------------------------------------
SELECT
    pr.nombre AS Producto,
    pr.precio AS Precio
FROM productos pr
WHERE pr.precio > (SELECT AVG(precio) FROM productos)
ORDER BY pr.precio DESC;
-- Resultado: 7 productos por encima del precio medio (3,26 €); el más caro es
--            la Ternera (10 €).


-- ----------------------------------------------------------------------------
-- 7. Clientes con edad superior a la media
-- ----------------------------------------------------------------------------

SELECT
    c.nombre AS Cliente,
    c.edad   AS Edad
FROM clientes c
WHERE c.edad > (SELECT AVG(edad * 1.0) FROM clientes)
ORDER BY c.edad DESC;
-- Resultado: 9 clientes por encima de la edad media (39,3 años).


-- ----------------------------------------------------------------------------
-- 8. Pedidos con total superior a la media
-- ----------------------------------------------------------------------------

SELECT
    p.id_pedido AS Pedido,
    p.total     AS Total
FROM pedidos p
WHERE p.total > (SELECT AVG(total) FROM pedidos)
ORDER BY p.total DESC;
-- Resultado: 128 de 300 pedidos superan el ticket medio (26,95 €).

-- ----------------------------------------------------------------------------
-- 9. Producto con precio máximo
-- ----------------------------------------------------------------------------

SELECT
    pr.nombre AS Producto,
    pr.precio AS Precio
FROM productos pr
WHERE pr.precio = (SELECT MAX(precio) FROM productos);
-- Resultado: Ternera, 10 €.


-- ----------------------------------------------------------------------------
-- 10. Cliente con edad mínima
-- ----------------------------------------------------------------------------

SELECT
    c.nombre AS Cliente,
    c.edad   AS Edad
FROM clientes c
WHERE c.edad = (SELECT MIN(edad) FROM clientes);
-- Resultado: Sofia, 22 años.


-- ============================================================================
-- BLOQUE 3: SUBQUERIES AVANZADAS (IN / NOT EXISTS)
-- ============================================================================
-- Para "los que no tienen" se usa NOT EXISTS y no NOT IN: si la subconsulta
-- devolviera un solo NULL, NOT IN no devolvería ninguna fila y no daría
-- error. Dentro de IN no hace falta DISTINCT.


-- ----------------------------------------------------------------------------
-- 11. Clientes que han realizado pedidos
-- ----------------------------------------------------------------------------
SELECT
    c.nombre AS Cliente
FROM clientes c
WHERE c.id_cliente IN (
    SELECT id_cliente FROM pedidos
)
ORDER BY c.nombre;
-- Resultado: 18 clientes (todos salvo Hugo e Irene).


-- ----------------------------------------------------------------------------
-- 12. Clientes que no han realizado pedidos
-- ----------------------------------------------------------------------------

SELECT
    c.nombre AS Cliente
FROM clientes c
WHERE NOT EXISTS (
    SELECT 1 FROM pedidos p WHERE p.id_cliente = c.id_cliente
);
-- Resultado: Hugo e Irene (mismo resultado que el ej. 2).


-- ----------------------------------------------------------------------------
-- 13. Productos vendidos al menos una vez
-- ----------------------------------------------------------------------------

SELECT
    pr.nombre AS Producto
FROM productos pr
WHERE pr.id_producto IN (
    SELECT id_producto FROM detalle_pedidos
)
ORDER BY pr.nombre;
-- Resultado: 19 productos (todos salvo Azucar).

-- ----------------------------------------------------------------------------
-- 14. Productos nunca vendidos
-- ----------------------------------------------------------------------------

SELECT
    pr.nombre AS Producto
FROM productos pr
WHERE NOT EXISTS (
    SELECT 1 FROM detalle_pedidos dp WHERE dp.id_producto = pr.id_producto
);
-- Resultado: Azucar (mismo resultado que el ej. 3).


-- ----------------------------------------------------------------------------
-- 15. Clientes con algún pedido superior a 50 €
-- ----------------------------------------------------------------------------

SELECT
    c.nombre AS Cliente
FROM clientes c
WHERE EXISTS (
    SELECT 1 FROM pedidos p
    WHERE p.id_cliente = c.id_cliente
      AND p.total > 50
)
ORDER BY c.nombre;
-- Resultado: 13 clientes tienen al menos un pedido de más de 50 €.


-- ============================================================================
-- BLOQUE 4: CASE (clasificaciones de negocio)
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
ORDER BY pr.precio;
-- Resultado: 9 baratos, 6 medios y 5 caros.


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
ORDER BY c.edad;
-- Resultado: 5 jóvenes, 11 adultos y 4 senior.

-- ----------------------------------------------------------------------------
-- 18. Clasificar pedidos por importe (bajo / medio / alto)
-- ----------------------------------------------------------------------------

SELECT
    CASE
        WHEN p.total < 20               THEN 'Bajo'
        WHEN p.total BETWEEN 20 AND 50  THEN 'Medio'
        ELSE 'Alto'
    END                 AS Clasificacion,
    COUNT(*)            AS Pedidos,
    SUM(p.total)        AS Importe
FROM pedidos p
GROUP BY
    CASE
        WHEN p.total < 20               THEN 'Bajo'
        WHEN p.total BETWEEN 20 AND 50  THEN 'Medio'
        ELSE 'Alto'
    END
ORDER BY Importe DESC;
-- Resultado: los pedidos medios (20-50 €) son 124 y aportan 3.942 € (el
--            48,8 %); los altos son solo 43 pero suman 2.808 € (34,7 %).


-- ----------------------------------------------------------------------------
-- 19. Clasificar productos por categoría (texto personalizado)
-- ----------------------------------------------------------------------------

SELECT
    pr.nombre  AS Producto,
    ca.nombre  AS Categoria,
    CASE
        WHEN ca.nombre IN ('Lacteos', 'Bebidas') THEN 'Básica'
        WHEN ca.nombre = 'Limpieza'              THEN 'Hogar'
        ELSE 'Otro'
    END AS Tipo
FROM productos pr
JOIN categorias ca ON pr.id_categoria = ca.id_categoria
ORDER BY Tipo, Categoria, Producto;
-- Resultado: 7 productos 'Básica' (lácteos y bebidas); ningún producto es de
--            Limpieza.

-- ----------------------------------------------------------------------------
-- 20. Etiqueta de cliente VIP (gasto total >= 500 €)
-- Se clasifica a cada CLIENTE por su gasto acumulado, no cada pedido: así un
-- cliente no puede salir a la vez como VIP y como Normal.
-- ----------------------------------------------------------------------------

SELECT
    c.nombre        AS Cliente,
    SUM(p.total)    AS Gasto_Total,
    CASE
        WHEN SUM(p.total) >= 500 THEN 'VIP'
        ELSE 'Normal'
    END             AS Clasificacion
FROM clientes c
JOIN pedidos p ON c.id_cliente = p.id_cliente
GROUP BY c.id_cliente, c.nombre
ORDER BY Gasto_Total DESC;
-- Resultado: 6 clientes VIP (gasto de al menos 500 €) de 18 con compras.


-- ============================================================================
-- BLOQUE 5: COMBINACIÓN (Subquery + HAVING + CASE)
-- ============================================================================
-- Regla de este bloque: cada entidad se compara con la media de la MISMA
-- magnitud (gasto total por cliente frente a la media del gasto total por
-- cliente), no con la media de un pedido o de una línea suelta.


-- ----------------------------------------------------------------------------
-- 21. Clientes con gasto total superior a la media de gasto por cliente
-- ----------------------------------------------------------------------------

WITH gasto_cliente AS (
    SELECT
        c.id_cliente,
        c.nombre        AS Cliente,
        SUM(p.total)    AS Gasto_Total
    FROM clientes c
    JOIN pedidos p ON c.id_cliente = p.id_cliente
    GROUP BY c.id_cliente, c.nombre
)
SELECT
    Cliente,
    Gasto_Total
FROM gasto_cliente
WHERE Gasto_Total > (SELECT AVG(Gasto_Total) FROM gasto_cliente)
ORDER BY Gasto_Total DESC;
-- Resultado: 7 clientes superan la media de 449,19 € por cliente. Lidera
--            Alberto con 1.398,40 €.


-- ----------------------------------------------------------------------------
-- 22. Productos con ventas superiores a la media de ventas por producto
-- ----------------------------------------------------------------------------

WITH ventas_producto AS (
    SELECT
        pr.id_producto,
        pr.nombre                               AS Producto,
        SUM(dp.cantidad * dp.precio_unitario)   AS Ventas
    FROM productos pr
    JOIN detalle_pedidos dp ON pr.id_producto = dp.id_producto
    GROUP BY pr.id_producto, pr.nombre
)
SELECT
    Producto,
    Ventas
FROM ventas_producto
WHERE Ventas > (SELECT AVG(Ventas) FROM ventas_producto)
ORDER BY Ventas DESC;
-- Resultado: 6 productos superan la media de 425,55 € por producto; los tres
--            primeros son Ternera, Pescado y Vino.


-- ----------------------------------------------------------------------------
-- 23. Categorías con unidades vendidas superiores a la media por categoría
-- ----------------------------------------------------------------------------

WITH unidades_categoria AS (
    SELECT
        ca.id_categoria,
        ca.nombre           AS Categoria,
        SUM(dp.cantidad)    AS Unidades
    FROM categorias ca
    JOIN productos pr       ON ca.id_categoria = pr.id_categoria
    JOIN detalle_pedidos dp ON pr.id_producto  = dp.id_producto
    GROUP BY ca.id_categoria, ca.nombre
)
SELECT
    Categoria,
    Unidades
FROM unidades_categoria
WHERE Unidades > (SELECT AVG(Unidades * 1.0) FROM unidades_categoria)
ORDER BY Unidades DESC;
-- Resultado: 4 de 7 categorías superan la media de 342,7 unidades: Lacteos,
--            Despensa, Carniceria y Bebidas.


-- ----------------------------------------------------------------------------
-- 24. Clientes con más pedidos que la media de pedidos por cliente
-- ----------------------------------------------------------------------------

SELECT
    c.nombre           AS Cliente,
    COUNT(p.id_pedido) AS Pedidos
FROM clientes c
JOIN pedidos p ON c.id_cliente = p.id_cliente
GROUP BY c.id_cliente, c.nombre
HAVING COUNT(p.id_pedido) > (
    SELECT AVG(conteo * 1.0)
    FROM (
        SELECT COUNT(id_pedido) AS conteo
        FROM pedidos
        GROUP BY id_cliente
    ) AS pedidos_por_cliente
)
ORDER BY Pedidos DESC;
-- Resultado: 7 clientes superan la media de 16,7 pedidos por cliente.


-- ----------------------------------------------------------------------------
-- 25. Proveedores con ingresos superiores a la media por proveedor
-- (solo proveedores con ventas)
-- ----------------------------------------------------------------------------
WITH ingresos_proveedor AS (
    SELECT
        pv.id_proveedor,
        pv.nombre                               AS Proveedor,
        SUM(dp.cantidad * dp.precio_unitario)   AS Ingresos
    FROM proveedores pv
    JOIN productos pr       ON pv.id_proveedor = pr.id_proveedor
    JOIN detalle_pedidos dp ON pr.id_producto  = dp.id_producto
    GROUP BY pv.id_proveedor, pv.nombre
)
SELECT
    Proveedor,
    Ingresos
FROM ingresos_proveedor
WHERE Ingresos > (SELECT AVG(Ingresos) FROM ingresos_proveedor)
ORDER BY Ingresos DESC;
-- Resultado: 3 de los 10 proveedores con ventas superan la media de 808,54 €:
--            Carnes SL, Bebidas SA y PescaMar.


-- ============================================================================
-- BLOQUE 6: SUBQUERIES CORRELACIONADAS
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
WHERE p.total > (
    SELECT AVG(p2.total)
    FROM pedidos p2
    WHERE p2.id_cliente = p.id_cliente
)
ORDER BY p.total DESC;
-- Resultado: 126 pedidos superan la media de su propio cliente.


-- ----------------------------------------------------------------------------
-- 27. Producto más caro dentro de su categoría
-- ----------------------------------------------------------------------------

SELECT
    ca.nombre AS Categoria,
    pr.nombre AS Producto,
    pr.precio AS Precio
FROM productos pr
JOIN categorias ca ON pr.id_categoria = ca.id_categoria
WHERE pr.precio = (
    SELECT MAX(pr2.precio)
    FROM productos pr2
    WHERE pr2.id_categoria = pr.id_categoria
)
ORDER BY pr.precio DESC;
-- Resultado: 7 categorías con producto; la Ternera (10 €) es la más cara de
--            Carniceria.


-- ----------------------------------------------------------------------------
-- 28. Cliente con el pedido más caro de toda la tienda
-- ----------------------------------------------------------------------------

SELECT
    c.nombre    AS Cliente,
    p.id_pedido AS Pedido,
    p.total     AS Total
FROM clientes c
JOIN pedidos p ON c.id_cliente = p.id_cliente
WHERE p.total = (SELECT MAX(total) FROM pedidos);
-- Resultado: Paula, pedido 109, 91,60 €.

-- ----------------------------------------------------------------------------
-- 29. Producto más vendido (en unidades) por categoría
-- Versión con subquery correlacionada; el ej. 38 resuelve la misma pregunta
-- con RANK() para comparar ambas técnicas.
-- ----------------------------------------------------------------------------

SELECT
    pr.nombre        AS Producto,
    ca.nombre        AS Categoria,
    SUM(dp.cantidad) AS Unidades
FROM productos pr
JOIN detalle_pedidos dp ON pr.id_producto  = dp.id_producto
JOIN categorias ca      ON pr.id_categoria = ca.id_categoria
GROUP BY pr.id_producto, pr.nombre, ca.nombre, pr.id_categoria
HAVING SUM(dp.cantidad) = (
    SELECT MAX(unidades_producto)
    FROM (
        SELECT pr2.id_categoria, SUM(dp2.cantidad) AS unidades_producto
        FROM detalle_pedidos dp2
        JOIN productos pr2 ON dp2.id_producto = pr2.id_producto
        GROUP BY pr2.id_producto, pr2.id_categoria
    ) AS resumen
    WHERE resumen.id_categoria = pr.id_categoria
)
ORDER BY ca.nombre;
-- Resultado: un producto por categoría; el que más unidades vende es Platanos
--            (161, en Fruta).


-- ----------------------------------------------------------------------------
-- 30. Pedido más alto por cliente
-- ----------------------------------------------------------------------------
SELECT
    c.nombre    AS Cliente,
    p.id_pedido AS Pedido,
    p.total     AS Total
FROM pedidos p
JOIN clientes c ON p.id_cliente = c.id_cliente
WHERE p.total = (
    SELECT MAX(p2.total)
    FROM pedidos p2
    WHERE p2.id_cliente = p.id_cliente
)
ORDER BY p.total DESC;
-- Resultado: 18 filas, una por cliente con compras. El máximo es el de Paula
--            (91,60 €).


-- ============================================================================
-- BLOQUE 7: WINDOW FUNCTIONS + CTEs
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 31. Ranking de clientes por gasto total
-- Técnica: RANK() OVER
-- ----------------------------------------------------------------------------

SELECT
    c.nombre                                    AS Cliente,
    SUM(p.total)                                AS Gasto_Total,
    RANK() OVER (ORDER BY SUM(p.total) DESC)    AS Ranking
FROM pedidos p
JOIN clientes c ON p.id_cliente = c.id_cliente
GROUP BY c.id_cliente, c.nombre
ORDER BY Ranking;
-- Resultado: Alberto (1.398,40 €), Carlos (999,20 €) y Sofia (679,20 €).

-- ----------------------------------------------------------------------------
-- 32. Ranking de productos por ingresos
-- Técnica: RANK() OVER con JOIN
-- ----------------------------------------------------------------------------

SELECT
    pr.nombre                                                           AS Producto,
    SUM(dp.cantidad * dp.precio_unitario)                               AS Ingresos,
    RANK() OVER (ORDER BY SUM(dp.cantidad * dp.precio_unitario) DESC)   AS Ranking
FROM productos pr
JOIN detalle_pedidos dp ON pr.id_producto = dp.id_producto
GROUP BY pr.id_producto, pr.nombre
ORDER BY Ranking;
-- Resultado: Ternera (1.310 €), Pescado (1.120 €) y Vino (924 €) encabezan el
--            ranking; el Pan cierra con 97,60 €.


-- ----------------------------------------------------------------------------
-- 33. Suma acumulada de ventas global
-- Técnica: SUM() OVER (ORDER BY fecha, id_pedido ROWS ...)
-- Sin marco explícito SQL Server usa RANGE, que da el mismo acumulado a
-- todos los pedidos de una misma fecha. id_pedido desempata.
-- ----------------------------------------------------------------------------

SELECT
    id_pedido,
    fecha,
    total,
    SUM(total) OVER (
        ORDER BY fecha, id_pedido
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS Acumulado_Global
FROM pedidos
ORDER BY fecha, id_pedido;
-- Resultado: el acumulado llega a 8.085,40 € el 29/12/2024 tras 300 pedidos.

-- ----------------------------------------------------------------------------
-- 34. Variación de gasto entre pedidos consecutivos por cliente
-- Técnica: CTE + LAG() OVER (PARTITION BY ... ORDER BY fecha)
-- El primer pedido de cada cliente no tiene anterior: su variación queda en
-- NULL en lugar de contar todo su importe como "incremento".
-- ----------------------------------------------------------------------------

WITH pedidos_cliente AS (
    SELECT
        id_cliente,
        id_pedido,
        fecha,
        total                                                           AS Gasto_Actual,
        LAG(total) OVER (PARTITION BY id_cliente ORDER BY fecha, id_pedido) AS Gasto_Anterior
    FROM pedidos
)
SELECT
    id_cliente,
    id_pedido,
    fecha,
    Gasto_Actual,
    Gasto_Anterior,
    Gasto_Actual - Gasto_Anterior AS Variacion
FROM pedidos_cliente
ORDER BY id_cliente, fecha, id_pedido;
-- Resultado: 300 filas; el primer pedido de cada cliente queda con Variacion
--            NULL.


-- ----------------------------------------------------------------------------
-- 35. Top 2 pedidos por cliente
-- Técnica: ROW_NUMBER() + subquery filtrada (id_pedido desempata)
-- ----------------------------------------------------------------------------

SELECT
    id_cliente,
    id_pedido,
    total,
    posicion
FROM (
    SELECT
        id_cliente,
        id_pedido,
        total,
        ROW_NUMBER() OVER (PARTITION BY id_cliente ORDER BY total DESC, id_pedido) AS posicion
    FROM pedidos
) AS pedidos_numerados
WHERE posicion <= 2
ORDER BY id_cliente, posicion;
-- Resultado: 36 filas (2 pedidos por cada uno de los 18 clientes con compras).

-- ============================================================================
-- BLOQUE 8: CASOS REALES
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 36. Clasificación de clientes según ranking (Top / Normal)
-- Técnica: CTE + DENSE_RANK + CASE
-- Con DENSE_RANK, "ranking <= 3" son los tres primeros NIVELES de gasto: si
-- hubiera empates, el grupo Top podría tener más de tres clientes.
-- ----------------------------------------------------------------------------

WITH ranking AS (
    SELECT
        c.id_cliente,
        c.nombre                                        AS Cliente,
        SUM(p.total)                                    AS Gasto_Total,
        DENSE_RANK() OVER (ORDER BY SUM(p.total) DESC)  AS Ranking
    FROM pedidos p
    JOIN clientes c ON p.id_cliente = c.id_cliente
    GROUP BY c.id_cliente, c.nombre
)
SELECT
    Cliente,
    Gasto_Total,
    Ranking,
    CASE WHEN Ranking <= 3 THEN 'Top' ELSE 'Normal' END AS Categoria
FROM ranking
ORDER BY Ranking;
-- Resultado: Top: Alberto, Carlos y Sofia. Sin empates, así que son tres
--            clientes.

-- ----------------------------------------------------------------------------
-- 37. Top 3 clientes por ciudad
-- Técnica: ROW_NUMBER() OVER (PARTITION BY ciudad) + subquery anidada
-- ----------------------------------------------------------------------------

SELECT
    ciudad,
    Cliente,
    total_compras,
    posicion
FROM (
    SELECT
        c.ciudad,
        c.nombre                    AS Cliente,
        SUM(p.total)                AS total_compras,
        ROW_NUMBER() OVER (
            PARTITION BY c.ciudad
            ORDER BY SUM(p.total) DESC, c.id_cliente
        )                           AS posicion
    FROM pedidos p
    JOIN clientes c ON p.id_cliente = c.id_cliente
    GROUP BY c.ciudad, c.id_cliente, c.nombre
) AS ranking_ciudad
WHERE posicion <= 3
ORDER BY ciudad, posicion;
-- Resultado: 14 filas: Barcelona solo tiene 2 clientes con compras.

-- 37.b Peso de cada ciudad en la venta (para comparar ciudades entre sí)
SELECT
    c.ciudad,
    COUNT(DISTINCT c.id_cliente)                                        AS Clientes_Con_Compra,
    SUM(p.total)                                                        AS Ventas,
    CAST(SUM(p.total) * 100.0 / SUM(SUM(p.total)) OVER () AS DECIMAL(5,2)) AS Pct_Ventas
FROM pedidos p
JOIN clientes c ON p.id_cliente = c.id_cliente
GROUP BY c.ciudad
ORDER BY Ventas DESC;
-- Resultado: Madrid aporta el 39,05 % de la venta con 7 clientes; Barcelona,
--            el 25,70 % con solo 2 (Alberto y Sofia).


-- ----------------------------------------------------------------------------
-- 38. Producto más vendido (en unidades) por categoría
-- Técnica: RANK() OVER (PARTITION BY categoría); RANK conserva los empates
-- en el primer puesto. Misma pregunta que el ej. 29.
-- ----------------------------------------------------------------------------
SELECT
    Categoria,
    Producto,
    Unidades
FROM (
    SELECT
        ca.nombre                                                       AS Categoria,
        pr.nombre                                                       AS Producto,
        SUM(dp.cantidad)                                                AS Unidades,
        RANK() OVER (PARTITION BY ca.id_categoria ORDER BY SUM(dp.cantidad) DESC) AS posicion
    FROM detalle_pedidos dp
    JOIN productos pr  ON dp.id_producto  = pr.id_producto
    JOIN categorias ca ON pr.id_categoria = ca.id_categoria
    GROUP BY ca.id_categoria, ca.nombre, pr.id_producto, pr.nombre
) AS ranking_categoria
WHERE posicion = 1
ORDER BY Categoria;
-- Resultado: los mismos 7 productos que el ej. 29.


-- ----------------------------------------------------------------------------
-- 39. Ranking de proveedores por número de productos
-- Técnica: RANK() OVER con COUNT
-- ----------------------------------------------------------------------------

SELECT
    pv.nombre                               AS Proveedor,
    COUNT(*)                                AS Total_Productos,
    RANK() OVER (ORDER BY COUNT(*) DESC)    AS Ranking
FROM productos pr
JOIN proveedores pv ON pr.id_proveedor = pv.id_proveedor
GROUP BY pv.id_proveedor, pv.nombre
ORDER BY Ranking, Proveedor;
-- Resultado: Gallina Blanca encabeza con 4 productos.


-- ----------------------------------------------------------------------------
-- 40. Dashboard básico SQL: métricas por cliente
-- Técnica: COUNT + SUM + AVG en un solo SELECT
-- ----------------------------------------------------------------------------
SELECT
    c.nombre                                AS Cliente,
    COUNT(*)                                AS Pedidos,
    SUM(p.total)                            AS Gasto_Total,
    CAST(AVG(p.total) AS DECIMAL(10,2))     AS Ticket_Medio
FROM pedidos p
JOIN clientes c ON p.id_cliente = c.id_cliente
GROUP BY c.id_cliente, c.nombre
ORDER BY Gasto_Total DESC;
-- Resultado: ticket medio entre 16,62 € (Carmen) y 37,66 € (Paula). Alberto
--            es el que más gasta, pero con un ticket bajo (22,92 €): compra
--            mucho y a menudo.


-- ----------------------------------------------------------------------------
-- 41. Concentración de la venta por cuartiles de clientes
-- ¿Qué parte de la venta generan los mejores clientes?
-- Técnica: CTE + NTILE(4) + SUM() OVER () como denominador
-- ----------------------------------------------------------------------------
WITH gasto_cliente AS (
    SELECT
        id_cliente,
        SUM(total) AS Gasto
    FROM pedidos
    GROUP BY id_cliente
),
cuartiles AS (
    SELECT
        id_cliente,
        Gasto,
        NTILE(4) OVER (ORDER BY Gasto DESC, id_cliente) AS Cuartil
    FROM gasto_cliente
)
SELECT
    Cuartil,
    COUNT(*)                                                            AS Clientes,
    SUM(Gasto)                                                          AS Ventas,
    CAST(SUM(Gasto) * 100.0 / SUM(SUM(Gasto)) OVER () AS DECIMAL(5,2))  AS Pct_Ventas
FROM cuartiles
GROUP BY Cuartil
ORDER BY Cuartil;
-- Resultado: el primer cuartil (5 clientes) genera el 53,74 % de la venta;
--            el último (4 clientes), el 5,73 %.

-- ============================================================================
-- INSIGHTS DE NEGOCIO
-- ============================================================================
-- Datos sintéticos: las cifras sirven para ilustrar el método, no describen
-- una tienda real.
--
-- 1. Clientes sin actividad (ej. 2 y 12): 2 de 20 clientes registrados
--    (Hugo e Irene) no han comprado nunca. Son candidatos a una campaña de
--    activación antes de darlos por perdidos.
--
-- 2. Concentración de la venta (ej. 20, 31 y 41): 5 clientes (el primer
--    cuartil) generan el 53,7 % de la venta y Alberto, solo, el 17,3 %
--    (1.398,40 € de 8.085,40 €). Perder a uno de ellos pesa mucho más que
--    perder a cualquier otro: conviene un trato preferente para esas
--    cuentas.
--
-- 3. Ciudades (ej. 37 y 37.b): Madrid concentra el 39,1 % de la venta con
--    7 clientes, pero Barcelona aporta el 25,7 % con solo 2. El peso de
--    Barcelona depende casi por completo de Alberto: es un riesgo de
--    concentración, no una prueba de que la ciudad rinda más.
--
-- 4. Frecuencia frente a ticket (ej. 40): el cliente que más gasta
--    (Alberto, 61 pedidos) tiene uno de los tickets más bajos (22,92 €),
--    mientras que Paula, con 17 pedidos, tiene el más alto (37,66 €). El
--    gasto total no dice por sí solo qué palanca trabajar: con unos
--    clientes hay que subir el ticket y con otros, la frecuencia.
--
-- 5. Catálogo (ej. 3, 5 y 32): el Azucar no se ha vendido nunca y 10 de
--    20 proveedores no tienen productos en catálogo. Tres productos
--    frescos o de mayor precio (Ternera, Pescado y Vino) suman el 41,5 %
--    de la venta.
-- ============================================================================
