# PCA: reducción dimensional del comportamiento de clientes

## Contexto de negocio
Un e-commerce registra 10 métricas por cliente y muchas se solapan. El objetivo es quedarse con las dimensiones que aportan información de verdad, para simplificar los dashboards y preparar los datos para segmentar.

## Dataset
`PCA.xlsx`: 150 clientes y 10 variables (Edad, Ingresos, Gasto_Anual, Numero_Compras, Ticket_Medio, Visitas_Web, Tiempo_Web, Emails_Abiertos, Uso_App, Antiguedad_Cliente).

## Técnicas aplicadas
- Matriz de correlación, marcando los pares muy correlacionados
- PCA completo con varianza explicada
- Scree plot (individual y acumulada) con el criterio del 80% de varianza
- Heatmap de cargas para ver qué variable pesa en cada componente
- PCA + K-Means: k elegido por silhouette y ajustado después con criterio de negocio para que los segmentos sean utilizables
- Clusters representados en el plano PC1-PC2 con sus centroides
- Heatmap normalizado del perfil medio de cada cluster

## Hallazgo clave
Las 10 métricas caben en 3 componentes que explican el 95% de la varianza. PC1 es poder adquisitivo (ingresos y gasto anual), PC2 es engagement digital (visitas web y uso de la app) y PC3 es perfil demográfico (edad y antigüedad). Sobre ese espacio, K-Means encuentra 3 segmentos con tamaño suficiente para diseñar acciones distintas por canal.

Lo que más me llamó la atención: la antigüedad del cliente no tiene relación ni con lo que gasta ni con lo que usa la app.
