# Análisis de clientes — Tienda de alimentación

**Caso de negocio:** una tienda de alimentación con clientes, productos, categorías y
proveedores necesita explotar sus datos transaccionales para segmentar clientes, clasificar
productos, detectar patrones de compra y construir rankings cruzados por ciudad, categoría
y proveedor.

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

## Hallazgo clave

El archivo progresa en dificultad desde LEFT JOIN básicos hasta casos analíticos reales
(top N por partición, evolución temporal, dashboard SQL), lo que lo convierte en una
referencia de estudio completa para entrevistas técnicas de analista de datos.

## Archivos

- `analisis_tienda.sql` — 40 ejercicios organizados en 8 bloques progresivos
  (LEFT JOIN → Subqueries → CASE → CTEs → Window Functions → Casos reales)

**Stack:** T-SQL · SQL Server Management Studio (SSMS)