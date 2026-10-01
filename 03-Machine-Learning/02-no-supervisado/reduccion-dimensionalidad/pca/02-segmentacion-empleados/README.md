# PCA + K-Means: segmentación de empleados

## Contexto de negocio
Una empresa con 232 comerciales quiere identificar perfiles de rendimiento para asignar formación a medida. Las 5 métricas están correlacionadas, así que primero las resumo con PCA y después agrupo.

## Dataset
`employees.xlsx`: 232 empleados y 6 columnas (idempleado, Sales_K, Customers, Training_Hours, Satisfaction, Calls_per_day). El ID no entra en el modelo.

## Técnicas aplicadas
- Matriz de correlación
- PCA con scree plot y criterio del 80% de varianza
- Heatmap de cargas para interpretar cada componente
- PCA + K-Means: de 5 métricas a 3 componentes antes de agrupar
- k elegido por silhouette score
- Clusters representados en el plano PC1-PC2 con sus centroides
- Heatmap normalizado del perfil de rendimiento de cada cluster

## Hallazgo clave
La segmentación no separa a los empleados por lo que venden: ventas y clientes captados son casi iguales en los dos grupos. Los separa la actividad diaria y la satisfacción del cliente. Un 18% de la plantilla vende lo mismo con un tercio de las llamadas, pero sus clientes puntúan 22 puntos menos. Venden, pero no cuidan la relación comercial.
