# Análisis avanzado con Window Functions en SQL

Proyecto basado en la base de datos AdventureWorks2025 de Microsoft. El objetivo es analizar el comportamiento de los clientes, comparar productos y calcular la evolución de las ventas con funciones de ventana.

### Principales hallazgos

- **Concentración extrema:** el 10 % de los clientes genera el 81,6 % de la venta neta, y la mitad inferior no llega al 0,7 %.
- **Crecimiento del negocio:** la venta neta crece un 38,2 % de 2023 a 2024 (de 31,6 M€ a 43,7 M€).
- **El crecimiento viene de la captación:** los clientes que compran en 2023 y en 2024 gastan un 4,3 % menos en 2024, mientras que los 8.767 clientes nuevos aportan el 37,3 % de la venta de 2024.
- **Huecos de precio:** los mayores saltos entre dos precios consecutivos de una misma subcategoría están en las bicis de montaña (1.215 €), de paseo y de carretera.

### Qué incluye

- **Rankings:** `ROW_NUMBER()`, `RANK()` y `DENSE_RANK()` sobre los mismos datos para ver cómo gestiona cada función los empates.
- **Segmentación:** deciles de clientes por gasto con `NTILE()` y peso de cada decil en la venta.
- **Ventas acumuladas:** serie mensual con *running total* y marco `ROWS` explícito.
- **Comparación entre filas:** `LAG()` y `LEAD()` por subcategoría de producto.
- **Crecimiento interanual:** YoY por cliente con CTEs y `LAG()`, solo entre años consecutivos y con una base mínima de 1.000 € para que los porcentajes no se disparen.

### Datos y ejecución

- Base de datos: [AdventureWorks2025.bak](https://github.com/microsoft/sql-server-samples/releases/tag/adventureworks), restaurada en SQL Server 2025.
- Pedidos del 30/05/2022 al 29/06/2025. 2022 y 2025 son años incompletos, así que las comparativas interanuales usan 2023 y 2024.
- Métrica de venta: `SubTotal` (venta neta, sin impuestos ni portes).
- Bajo cada consulta hay un comentario con el resultado obtenido.

### Tecnologías y técnicas

- SQL Server (T-SQL)
- Window Functions
- CTEs y subconsultas
- Agregaciones y sumas acumuladas
- Comparativas interanuales (YoY)
