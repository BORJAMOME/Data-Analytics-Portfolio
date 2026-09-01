# PCA — Reducción dimensional de comportamiento de clientes

## Contexto de negocio
Un e-commerce con 10 métricas por cliente quiere reducirlas a las dimensiones realmente importantes para simplificar dashboards y preparar datos para segmentación.

## Dataset
`PCA.xlsx` — 150 clientes, 10 variables (Edad, Ingresos, Gasto_Anual, Numero_Compras, Ticket_Medio, Visitas_Web, Tiempo_Web, Emails_Abiertos, Uso_App, Antiguedad_Cliente).

## Técnicas aplicadas
- Matriz de correlación con detección de pares altamente correlacionados
- PCA completo con varianza explicada
- Scree plot (individual + acumulada)
- Loadings heatmap: contribución de cada variable a cada PC
- Biplot: observaciones + flechas de loadings en PC1 vs PC2
- Proyección 2D coloreada por score PC1

## Hallazgo clave
Las primeras componentes revelan dimensiones latentes como "valor del cliente" y "engagement digital" que resumen las 10 métricas con mínima pérdida de información.

