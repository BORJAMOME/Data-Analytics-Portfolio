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
- [02-caso-avanzado](../02-caso-gym/) — datos reales de gimnasio, estabilidad de clusters
- [03-segmentación-política](../03-segmentacion-politica/) — dataset real, radar charts, PCA

## Cómo ejecutar
```bash
pip install pandas numpy matplotlib seaborn scikit-learn
jupyter notebook notebook.ipynb
```
