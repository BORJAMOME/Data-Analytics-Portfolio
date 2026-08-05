# Análisis de ventas — Red de concesionarios

**Caso de negocio:** una red de 50 concesionarios del Grupo Volkswagen necesita analizar
sus datos de ventas para identificar los mejores vendedores, comparar rendimiento entre
marcas, detectar tendencias mensuales y segmentar concesionarios por volumen de facturación.

## Qué se aprende

- CTEs simples y encadenadas para aislar cálculos intermedios.
- Subqueries escalares y correlacionadas para comparar cada fila con la media de su grupo.
- `LAG()` para calcular variación mensual de ventas.
- `PERCENTILE_CONT` y `PERCENT_RANK` para análisis de distribución.
- `RANK()` para rankings de concesionarios por facturación.
- Múltiples enfoques de solución cuando el mismo problema admite más de un camino.

## Hallazgo clave

El archivo es 100 % autocontenido: incluye CREATE DATABASE, tres tablas con datos
realistas (50 concesionarios, 50 vehículos, 500 ventas) y 10 ejercicios resueltos
con doble enfoque, lo que permite ejecutarlo directamente en cualquier instancia
de SQL Server sin dependencias externas.

## Archivos

- `analisis_concesionarios.sql` — Base de datos autocontenida + 10 ejercicios resueltos
  con múltiples enfoques (CTEs, subqueries, LAG, PERCENTILE_CONT)

**Stack:** T-SQL · SQL Server Management Studio (SSMS)