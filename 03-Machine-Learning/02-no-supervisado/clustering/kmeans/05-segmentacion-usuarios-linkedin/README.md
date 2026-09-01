# K-Means — Segmentación de perfiles de usuarios en LinkedIn

## Contexto de negocio
El equipo de producto de una plataforma profesional tipo LinkedIn trata a toda su base de usuarios como un bloque homogéneo. No hay forma sistemática de distinguir al creador de contenido del buscador de empleo, ni de adaptar la experiencia, las notificaciones o las recomendaciones a cada perfil de uso.

## Dataset
`linkedin_clustering_users.xlsx` — 5.000 usuarios, 19 variables (demografía, actividad de publicación, engagement, búsqueda de empleo, networking, consumo de formación). Se usan 13 variables de comportamiento para el modelo; `age`, `account_years` y `engagement_actions_month` (métrica compuesta) se excluyen con justificación explícita.

## Técnicas aplicadas
- EDA completo: ficha de variables, distribuciones, boxplots, coeficiente de variación, asimetría, matriz de correlación
- Imputación de nulos con mediana (1% en 3 variables)
- StandardScaler para igualar escalas antes de K-Means
- Método del codo + Silhouette Score para elegir k
- **Comparativa k=5 vs k=6** con perfiles relativos de ambos — k=6 tiene mejor silhouette (0.527 vs 0.474) pero se elige k=5 por accionabilidad de negocio
- **K-Means (k=5)** con naming de clusters y heatmap de perfiles
- **Kruskal-Wallis** sobre las 13 variables para validar que las diferencias entre clusters son estadísticamente significativas
- **PCA** con varianza explicada (67.6%), loadings e interpretación semántica de los ejes

## Hallazgo clave
K-Means identifica 5 perfiles naturales de uso — Buscador de empleo, Usuario pasivo, Creador de contenido, Networker y Power user — con diferencias estadísticamente significativas en las 13 variables (Kruskal-Wallis p < 0.001). El perfil más grande (pasivos, 37%) es la mayor oportunidad de activación; el más pequeño (power users, 8%) tiene perfil de recruiter/talent acquisition y actúa como enlace natural entre buscadores y empresas.

## Stack
pandas, NumPy, scikit-learn (`KMeans`, `silhouette_score`, `PCA`, `StandardScaler`), SciPy (`kruskal`), Matplotlib, Seaborn

