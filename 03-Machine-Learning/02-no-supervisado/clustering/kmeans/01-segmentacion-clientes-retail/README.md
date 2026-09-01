# K-Means — Segmentación de clientes retail

## Contexto de negocio
Un centro comercial quiere agrupar clientes por ingreso y hábito de gasto para diseñar campañas de marketing diferenciadas (VIP, activación, fidelización).

## Dataset
Sintético: 200 clientes con 5 segmentos naturales (ingreso anual vs spending score).

## Técnicas aplicadas
- Método del codo (inercia)
- Silhouette score
- K-Means con k=5
- Visualización de centroides en espacio original
- Perfil descriptivo de cada cluster

## Hallazgo clave
K-Means identifica 5 perfiles claros: premium, aspiracional, prudente alto/bajo ingreso y medio equilibrado. Los centroides permiten asignar nuevos clientes automáticamente.

## Notebooks relacionados
- [Segmentación gimnasio](../02-segmentacion-gimnasio/) — datos reales de gimnasio, estabilidad de clusters
- [Segmentación votantes](../03-segmentacion-votantes/) — dataset real, radar charts, PCA
- [04-segmentación retail con t-SNE](../04-segmentacion-retail-tsne/) — mismo dominio, dataset real de 6.457 clientes, visualización con t-SNE

