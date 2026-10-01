# K-Means — Segmentación de perfiles de usuarios en LinkedIn

## Contexto de negocio
El equipo de producto de una red profesional tipo LinkedIn trata a todos sus usuarios igual. No sabe distinguir al que crea contenido del que busca trabajo, y por eso no puede adaptar la experiencia, las notificaciones ni las recomendaciones a cada uno.

## Dataset
`linkedin_clustering_users.xlsx`: 5.000 usuarios y 19 variables (demografía, publicaciones, engagement, búsqueda de empleo, networking y formación). El modelo usa 13 variables de comportamiento. Dejo fuera `age`, `account_years` y `engagement_actions_month` (una métrica compuesta), y en el notebook explico por qué.

## Técnicas aplicadas
- EDA: ficha de variables, distribuciones, boxplots, coeficiente de variación, asimetría y matriz de correlación
- Imputación de nulos con mediana (1% en 3 variables)
- StandardScaler para igualar escalas antes de K-Means
- Método del codo + Silhouette Score para elegir k
- **k=5 frente a k=6**, comparando los perfiles de los dos. k=6 tiene mejor silhouette (0,527 frente a 0,474), pero me quedo con k=5 porque el sexto grupo no pide una acción distinta
- **K-Means (k=5)** con nombre para cada cluster y heatmap de perfiles
- **Kruskal-Wallis** sobre las 13 variables para validar que las diferencias entre clusters son estadísticamente significativas
- **PCA** con varianza explicada (67,6%), cargas e interpretación de cada eje

## Hallazgo clave
K-Means encuentra 5 formas de usar la plataforma: buscador de empleo, usuario pasivo, creador de contenido, networker y power user. Las diferencias son significativas en las 13 variables (Kruskal-Wallis, p < 0,001). El grupo más grande, el de los pasivos (37%), es donde más margen hay para activar gente. El más pequeño, los power users (8%), tiene pinta de recruiters y hace de puente entre quien busca trabajo y las empresas.

## Stack
pandas, NumPy, scikit-learn (`KMeans`, `silhouette_score`, `PCA`, `StandardScaler`), SciPy (`kruskal`), Matplotlib, Seaborn

