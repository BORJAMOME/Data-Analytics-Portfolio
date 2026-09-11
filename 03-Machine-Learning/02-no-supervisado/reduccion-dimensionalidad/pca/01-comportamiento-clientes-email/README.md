# PCA — Reducción dimensional de comportamiento de clientes

## Contexto de negocio
Un e-commerce con 10 métricas por cliente quiere reducirlas a las dimensiones realmente importantes para simplificar dashboards y preparar datos para segmentación.

## Dataset
`PCA.xlsx` — 150 clientes, 10 variables (Edad, Ingresos, Gasto_Anual, Numero_Compras, Ticket_Medio, Visitas_Web, Tiempo_Web, Emails_Abiertos, Uso_App, Antiguedad_Cliente).

## Técnicas aplicadas
- Matriz de correlación con detección de pares altamente correlacionados
- PCA completo con varianza explicada
- Scree plot (individual + acumulada) con criterio del 80% de varianza
- Loadings heatmap: contribución de cada variable a cada PC
- Pipeline PCA + K-Means: selección de k por silhouette score, con ajuste de negocio para priorizar segmentos accionables
- Visualización de clusters en espacio PCA 2D con centroides
- Heatmap normalizado de perfiles de cliente por cluster

## Hallazgo clave
Las 10 métricas se reducen a 3 componentes que capturan el 95% de la varianza: **PC1 (poder adquisitivo)**, dominado por ingresos y gasto anual; **PC2 (engagement digital)**, dominado por visitas web y uso de app; y **PC3 (perfil demográfico)**, dominado por edad y antigüedad del cliente. Sobre ese espacio reducido, K-Means identifica 3 segmentos de cliente con masa crítica suficiente para diseñar acciones diferenciadas por canal.

