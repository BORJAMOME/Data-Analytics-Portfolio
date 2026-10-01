# K-Means + t-SNE — Segmentación de clientes retail

Este notebook es el análisis completo. Si prefieres recorrer el caso sin tocar código, hay una app en Streamlit que lo explica de principio a fin y te deja inventar un cliente para ver en qué segmento cae: **[segmentacion-retail-app](https://github.com/BORJAMOME/segmentacion-retail-app)**.

## Contexto de negocio
Una cadena de electrónica de consumo (tipo MediaMarkt) trata a toda su base de clientes por igual. No hay una forma sistemática de distinguir al comprador ocasional de bajo ticket del cliente de alto valor, ni de dirigir el presupuesto de retención a quien más lo necesita.

## Dataset
6.457 clientes y 26 variables (demografía, gasto, canal, categorías de producto, interacción con marketing). El modelo usa 9 variables de comportamiento (RFM más canal digital). El dataset traía un campo `Customer_Profile` (1-5) ya asignado; lo guardo aparte como control y el modelo no lo ve.

## Técnicas aplicadas
- EDA: distribuciones, matriz de correlación, detección de multicolinealidad
- **t-SNE** para proyectar 9 variables en 2D y comprobar que hay grupos antes de segmentar
- Interpretación de los ejes de t-SNE por correlación con las variables originales
- Método del codo y silhouette score para elegir k, explicando por qué no me quedo con el óptimo estadístico
- **K-Means (k=4)**, perfiles de cluster con heatmap normalizado
- Visualización de los clusters proyectados en el mapa t-SNE
- Comparación con el perfil que ya venía en los datos (que el modelo no ha visto)

## Hallazgo clave
Con solo 9 variables de comportamiento, K-Means recupera casi exactamente (96,8%) el segmento premium que el negocio ya tenía identificado, sin haber visto esa etiqueta. Lo que no consigue es separar dos de los cinco perfiles originales, y eso es útil: indica qué información falta en las variables que he usado.

## Stack
pandas, NumPy, scikit-learn (`TSNE`, `KMeans`, `silhouette_score`), Matplotlib, Seaborn

