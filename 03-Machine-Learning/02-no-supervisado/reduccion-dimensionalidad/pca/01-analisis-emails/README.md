# PCA — Reduccion dimensional de comportamiento de clientes

## Contexto de negocio
Un e-commerce con 10 metricas por cliente quiere reducirlas a las dimensiones realmente importantes para simplificar dashboards y preparar datos para segmentacion.

## Dataset
`PCA.xlsx` — 150 clientes, 10 variables (Edad, Ingresos, Gasto_Anual, Numero_Compras, Ticket_Medio, Visitas_Web, Tiempo_Web, Emails_Abiertos, Uso_App, Antiguedad_Cliente).

## Tecnicas aplicadas
- Matriz de correlacion con deteccion de pares altamente correlacionados
- PCA completo con varianza explicada
- Scree plot (individual + acumulada)
- Loadings heatmap: contribucion de cada variable a cada PC
- Biplot: observaciones + flechas de loadings en PC1 vs PC2
- Proyeccion 2D coloreada por score PC1

## Hallazgo clave
Las primeras componentes revelan dimensiones latentes como "valor del cliente" y "engagement digital" que resumen las 10 metricas con minima perdida de informacion.

## Notebooks relacionados
- [PCA + K-Means empleados](../02-segmentacion-empleados/) — pipeline PCA antes de clustering
- [K-Means segmentacion politica](../../../clustering/kmeans/03-segmentacion-politica/) — PCA como visualizacion

## Como ejecutar
```bash
pip install pandas numpy matplotlib seaborn scikit-learn openpyxl
jupyter notebook notebook.ipynb
```
