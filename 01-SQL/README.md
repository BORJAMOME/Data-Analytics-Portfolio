# SQL — Análisis de datos con T-SQL

> Proyectos de análisis de datos reales resueltos con T-SQL y SQL Server, desarrollados
> durante el bootcamp de Data Analytics en [Neoland](https://www.neoland.es/).
> Cada ejercicio prioriza la claridad del código, múltiples enfoques de solución y
> la aplicación directa a problemas de negocio.

**Autor:** [Borja Mora Méndez](https://www.linkedin.com/in/borjamoramendez/) · Madrid, 2026

---

## Por qué este repositorio es diferente

No es una colección de ejercicios sueltos. Cada proyecto plantea un **caso de negocio real**,
incluye la base de datos autocontenida (CREATE + INSERT) o usa AdventureWorks, y resuelve
los ejercicios con múltiples enfoques cuando hay más de un camino válido. El código está
comentado para que se pueda seguir como material de estudio.

## Stack

```
T-SQL · SQL Server · SQL Server Management Studio (SSMS) · AdventureWorks2025
```

## Proyectos

| # | Caso | Qué se aprende | Base de datos |
|---|------|----------------|---------------|
| 1 | [Análisis de ventas — Red de concesionarios](01-analisis-ventas-concesionarios/) | CTEs, subqueries correlacionadas, LAG, PERCENTILE_CONT, PERCENT_RANK, RANK | AutomocionDB (autocontenida) |
| 2 | [AdventureWorks Avanzado — Window Functions](02-adventureworks-avanzado/) | ROW_NUMBER, RANK, DENSE_RANK, NTILE, LAG, LEAD, sumas acumuladas, examen tipo entrevista | AdventureWorks2025 |
| 3 | [Análisis de clientes — Tienda](03-analisis-clientes-tienda/) | LEFT JOIN, subqueries IN/NOT IN, CASE, CTEs, Window Functions, PARTITION BY, casos reales | Tienda (requiere BD previa) |
## Estructura

```
01-SQL/
├── 01-analisis-ventas-concesionarios/
│   ├── README.md
│   └── analisis_concesionarios.sql
├── 02-adventureworks-avanzado/
│   ├── README.md
│   └── adventureworks_avanzado.sql
└── 03-analisis-clientes-tienda/
    ├── README.md
    └── analisis_tienda.sql
```

## Highlights

| Técnica | Dónde se usa |
|---------|-------------|
| CTEs encadenadas | Concesionarios (ej. 5, 7, 9) |
| Subqueries correlacionadas | Concesionarios (ej. 5B), Tienda (bloque 6) |
| `LAG()` / `LEAD()` | Concesionarios (ej. 8), AdventureWorks (ej. 11), Tienda (bloque 7) |
| `PERCENTILE_CONT` + `PERCENT_RANK` | Concesionarios (ej. 9) |
| `ROW_NUMBER` / `RANK` / `DENSE_RANK` | AdventureWorks (ej. 3), Tienda (bloques 7-8) |
| `NTILE` | AdventureWorks (ej. 4), Tienda (bloque 8) |
| Sumas acumuladas (`ROWS BETWEEN`) | AdventureWorks (ej. 10), Tienda (ej. 33) |
| `CASE` + segmentación de negocio | Tienda (bloque 4) |
| `LEFT JOIN` + detección de ausencias | Tienda (bloque 1) |
| CTE + `LAG` + `TOP` (examen entrevista) | AdventureWorks (parte 2) |