# PCA + K-Means — Segmentación de empleados

## Contexto de negocio
Una empresa con 232 empleados de ventas quiere identificar perfiles de rendimiento para asignar formación personalizada. Las 5 métricas están correlacionadas — PCA las sintetiza antes de agrupar.

## Dataset
`employees.xlsx` — 232 empleados, 6 variables (idempleado, Sales_K, Customers, Training_Hours, Satisfaction, Calls_per_day).

## Técnicas aplicadas
- Matriz de correlación
- PCA con scree plot y criterio del 80% de varianza
- Loadings heatmap para interpretar componentes
- Pipeline PCA + K-Means: reducción de 5 métricas a 3 componentes antes de clustering
- Selección de k por silhouette score
- Visualización de clusters en espacio PCA 2D con centroides
- Heatmap normalizado de perfiles de rendimiento

## Hallazgo clave
La segmentación no separa a los empleados por rendimiento comercial (ventas y clientes captados son casi idénticos entre clusters), sino por **nivel de actividad y satisfacción del cliente**: un grupo minoritario (18%) cierra ventas similares con un tercio de las llamadas diarias, pero con una satisfacción de cliente 22 puntos inferior — un perfil que vende pero no cuida la relación comercial.