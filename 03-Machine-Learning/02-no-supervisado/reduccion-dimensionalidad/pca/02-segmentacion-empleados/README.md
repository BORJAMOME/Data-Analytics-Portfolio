# PCA + K-Means — Segmentación de empleados

## Contexto de negocio
Una empresa con 232 empleados de ventas quiere identificar perfiles de rendimiento para asignar formación personalizada. Las 5 métricas están correlacionadas — PCA las sintetiza antes de agrupar.

## Dataset
`employees.xlsx` — 232 empleados, 6 variables (idempleado, Sales_K, Customers, Training_Hours, Satisfaction, Calls_per_day).

## Técnicas aplicadas
- Matriz de correlación
- PCA con scree plot y criterio del 80% de varianza
- Loadings heatmap para interpretar componentes
- Pipeline PCA + K-Means: reducción antes de clustering
- Comparación directa: K-Means sobre todas las variables vs K-Means sobre PC
- Visualización de clusters en espacio PCA 2D con centroides
- Heatmap normalizado de perfiles de rendimiento

## Hallazgo clave
PCA + K-Means produce clusters de calidad comparable al K-Means directo pero con menos dimensiones, lo que mejora la estabilidad y la interpretabilidad visual.

## Notebooks relacionados
- [PCA análisis emails](../01-analisis-emails/) — PCA standalone con 10 variables
- [K-Means avanzado](../../../clustering/kmeans/02-caso-gym/) — K-Means sin reducción previa

