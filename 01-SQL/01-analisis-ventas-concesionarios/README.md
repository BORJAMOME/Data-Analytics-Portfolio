# Análisis de ventas de una red de concesionarios con SQL

Proyecto de análisis de ventas de una red ficticia de 50 concesionarios en España, con 500 transacciones registradas entre enero y junio de 2025.

Mediante **SQL Server**, analizo la facturación, los modelos más vendidos y el rendimiento de los concesionarios. Para ello, utilizo consultas SQL, CTEs, subconsultas y funciones de ventana como `LAG()`, `RANK()` y `PERCENT_RANK()`.

### Principales hallazgos

- **Red diversificada pero dispersa:** los 3 concesionarios que más facturan concentran el 9,95 % del total (232,9 M€), frente al 6 % de un reparto homogéneo. El primero (PremiumCars Gijon, 8,07 M€) factura 4,6 veces más que el último.
- **Umbral de referencia:** el percentil 75 de facturación es de 5,35 M€ y lo superan 13 de los 50 concesionarios.
- **Unidades frente a facturación:** AutoMalaga es el primero en unidades y el cuarto en facturación, así que el objetivo comercial depende de la métrica elegida.
- **Evolución mensual:** las unidades crecen de enero a abril (de 775 a 969), caen un 22,8 % en mayo y se recuperan un 26,2 % en junio. Con 6 meses de datos no se puede hablar de estacionalidad.
- **Cobertura de catálogo:** ningún concesionario vende las 12 categorías (media de 6,4) y 6 no han vendido ningún eléctrico.

### Datos y ejecución

- Datos **sintéticos**, incluidos en el propio script (`CREATE TABLE` + `INSERT`). La facturación es precio de catálogo × unidades.
- Requiere SQL Server 2019 o superior. El script crea la base `AutomocionDB` y se puede volver a ejecutar sin errores.
- Bajo cada consulta hay un comentario con el resultado obtenido.

```bash
sqlcmd -S "(localdb)\MSSQLLocalDB" -E -C -f 65001 -i analisis_concesionarios.sql
```

### Tecnologías y técnicas

- SQL Server (T-SQL)
- CTEs, subconsultas escalares y correlacionadas, `NOT EXISTS`
- Window Functions: `LAG()`, `RANK()`, `ROW_NUMBER()`, `PERCENT_RANK()` y `PERCENTILE_CONT()`
- Agregaciones, rankings, percentiles y porcentaje de contribución
