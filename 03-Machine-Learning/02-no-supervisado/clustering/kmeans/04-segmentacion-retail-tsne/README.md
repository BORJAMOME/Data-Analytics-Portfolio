# K-Means + t-SNE — Segmentación de clientes retail

Este notebook es el análisis completo. Si prefieres recorrer el caso como una historia interactiva —sin necesidad de tocar código— hay una aplicación en Streamlit que lo explica de principio a fin y deja construir un cliente hipotético para ver en qué segmento cae: **[segmentacion-retail-app](https://github.com/BORJAMOME/segmentacion-retail-app)**.

## Contexto de negocio
Una cadena de electrónica de consumo (tipo MediaMarkt) trata a toda su base de clientes por igual. No hay una forma sistemática de distinguir al comprador ocasional de bajo ticket del cliente de alto valor, ni de dirigir el presupuesto de retención a quien más lo necesita.

## Dataset
Real: 6.457 clientes, 26 variables (demografía, gasto, canal, categorías de producto, interacción con marketing). Se usan 9 variables de comportamiento (RFM + canal digital) para el modelo; un campo `Customer_Profile` (1-5) ya venía asignado en origen y se reserva como control, sin dárselo al modelo.

## Técnicas aplicadas
- EDA: distribuciones, matriz de correlación, detección de multicolinealidad
- **t-SNE** para proyectar 9 variables en 2D y verificar que existe estructura real antes de segmentar
- Interpretación de los ejes de t-SNE por correlación con las variables originales
- Método del codo + Silhouette Score para elegir k, con decisión justificada frente al óptimo estadístico
- **K-Means (k=4)**, perfiles de cluster con heatmap normalizado
- Visualización de los clusters proyectados en el mapa t-SNE
- Evaluación honesta: cross-tab contra el perfil ya asignado en los datos (no usado en el entrenamiento)

## Hallazgo clave
Con solo 9 variables de comportamiento, K-Means recupera casi exactamente (96.8%) el segmento premium que el negocio ya tenía identificado, sin haber visto esa etiqueta durante el entrenamiento. Pero no distingue dos de los cinco perfiles originales — señal honesta de qué información falta, no un fallo del modelo.

## Stack
pandas, NumPy, scikit-learn (`TSNE`, `KMeans`, `silhouette_score`), Matplotlib, Seaborn

