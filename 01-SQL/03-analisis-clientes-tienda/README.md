# Análisis de clientes y ventas para supermercado con SQL

Proyecto de análisis de datos de una tienda de alimentación para estudiar el comportamiento de los clientes, las ventas de productos y el rendimiento por categoría, ciudad y proveedor.

Mediante **SQL Server**, desarrollo 41 ejercicios que combinan consultas SQL y técnicas de análisis para segmentar clientes, comparar resultados y detectar patrones de compra.

### Principales hallazgos

- **Concentración:** 5 de los 18 clientes con compras (el primer cuartil) generan el 53,7 % de la venta; uno solo, el 17,3 %.
- **Ciudades:** Madrid aporta el 39,1 % de la venta con 7 clientes y Barcelona el 25,7 % con solo 2, lo que supone un riesgo de concentración.
- **Frecuencia frente a ticket:** el cliente que más gasta hace 61 pedidos con un ticket de 22,92 €; el ticket más alto (37,66 €) corresponde a un cliente con 17 pedidos.
- **Catálogo:** 2 clientes registrados no han comprado nunca, un producto no se ha vendido y 3 productos (Ternera, Pescado y Vino) suman el 41,5 % de la venta.

### Qué incluye

- **Control de calidad:** comprobación de que el total de cada pedido cuadra con sus líneas.
- **Análisis de clientes:** clientes sin pedidos (`NOT EXISTS`), clasificación por gasto y comparación con la media de gasto por cliente.
- **Análisis de productos:** clasificación por precio, productos sin ventas y más vendidos por categoría.
- **Rendimiento comercial:** ventas por ciudad, categoría y proveedor, con su peso sobre el total.
- **Rankings y segmentación:** `RANK()`, `DENSE_RANK()`, `ROW_NUMBER()` y cuartiles con `NTILE()`.
- **Evolución de las compras:** suma acumulada y variación del gasto entre pedidos consecutivos con `LAG()`.

### Datos y ejecución

- Datos **sintéticos**. Clientes, empleados, proveedores y catálogo proceden de la base original del ejercicio; los 300 pedidos de 2024 se han generado con `generar_datos.py` (semilla fija), de modo que el total de cada pedido cuadra con sus líneas.
- Ejecutar primero `00_schema_y_datos.sql` (crea la base `TiendaDB`) y después `analisis_tienda.sql`. Requiere SQL Server 2019 o superior.
- Bajo cada consulta hay un comentario con el resultado obtenido.

```bash
sqlcmd -S "(localdb)\MSSQLLocalDB" -E -C -f 65001 -i 00_schema_y_datos.sql
```

```bash
sqlcmd -S "(localdb)\MSSQLLocalDB" -E -C -f 65001 -i analisis_tienda.sql
```

### Tecnologías y técnicas

- SQL Server (T-SQL)
- `JOIN`, subconsultas (`IN`, `EXISTS`, `NOT EXISTS`, correlacionadas) y CTEs
- `CASE` para clasificaciones de negocio
- Window Functions: `RANK()`, `DENSE_RANK()`, `ROW_NUMBER()`, `NTILE()` y `LAG()`
- `PARTITION BY`, agregaciones y sumas acumuladas
