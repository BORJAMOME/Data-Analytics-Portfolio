# PCA + K-Means — Segmentacion de empleados

## Contexto de negocio
Una empresa con 232 empleados de ventas quiere identificar perfiles de rendimiento para asignar formacion personalizada. Las 5 metricas estan correlacionadas — PCA las sintetiza antes de agrupar.

## Dataset
`employees.xlsx` — 232 empleados, 6 variables (idempleado, Sales_K, Customers, Training_Hours, Satisfaction, Calls_per_day).

## Tecnicas aplicadas
- Matriz de correlacion
- PCA con scree plot y criterio del 80% de varianza
- Loadings heatmap para interpretar componentes
- Pipeline PCA + K-Means: reduccion antes de clustering
- Comparacion directa: K-Means sobre todas las variables vs K-Means sobre PC
- Visualizacion de clusters en espacio PCA 2D con centroides
- Heatmap normalizado de perfiles de rendimiento

## Hallazgo clave
PCA + K-Means produce clusters de calidad comparable al K-Means directo pero con menos dimensiones, lo que mejora la estabilidad y la interpretabilidad visual.

## Notebooks relacionados
- [PCA analisis emails](../01-analisis-emails/) — PCA standalone con 10 variables
- [K-Means avanzado](../../../clustering/kmeans/02-caso-avanzado/) — K-Means sin reduccion previa

## Como ejecutar
```bash
pip install pandas numpy matplotlib seaborn scikit-learn openpyxl
jupyter notebook notebook.ipynb
```
