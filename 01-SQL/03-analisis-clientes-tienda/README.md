# Análisis de clientes — Tienda de alimentación

**Caso de negocio:** una tienda de alimentación tiene sus clientes, productos, categorías y
proveedores en una base de datos y quiere sacarle partido: segmentar clientes, clasificar
productos, ver patrones de compra y hacer rankings por ciudad, categoría y proveedor.

## Qué se aprende

- `LEFT JOIN` para detectar clientes sin pedidos, productos sin ventas y proveedores sin catálogo.
- Subqueries escalares, `IN` / `NOT IN` y subqueries correlacionadas para comparar cada fila
  contra la media de su grupo.
- `CASE` para crear clasificaciones de negocio (barato/medio/caro, VIP/normal, frecuente/ocasional).
- CTEs para aislar cálculos intermedios (gasto total, ventas por ciudad, media por cliente).
- Window Functions: `RANK`, `DENSE_RANK`, `ROW_NUMBER`, `NTILE`, `LAG`, `LEAD`.
- `PARTITION BY` para rankings dentro de ciudad, categoría y cliente.
- Sumas acumuladas con `OVER (ORDER BY)`.
- Combinaciones avanzadas: CTE + ranking, subquery + HAVING, CASE + agregación.
- Casos reales: top 3 clientes por ciudad, producto más vendido por categoría, dashboard SQL.

## Qué incluye

Los ejercicios empiezan por LEFT JOIN sencillos y acaban en casos analíticos de verdad:
top N por partición, evolución temporal y un pequeño dashboard en SQL. Viene bien para
repasar antes de una entrevista técnica.

## Archivos

- `analisis_tienda.sql`: 40 ejercicios en 8 bloques de dificultad creciente
  (LEFT JOIN → Subqueries → CASE → CTEs → Window Functions → Casos reales)

**Stack:** T-SQL · SQL Server Management Studio (SSMS)
