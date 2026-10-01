# Clustering Jerárquico - Caso completo (banca)

## Contexto de negocio
Un banco quiere segmentar a 300 clientes con 5 métricas financieras para diseñar productos a medida (tarjetas, créditos, seguros).

## Dataset
Sintético: 300 clientes bancarios con 5 features generados vía `make_blobs`.

## Técnicas aplicadas
- Coeficiente cofenético para comparar 4 linkages
- Dendrograma con mejor linkage
- Silhouette score para validar k
- Silhouette plot detallado
- Heatmap normalizado de perfiles

## Hallazgo clave
El coeficiente cofenético mide qué método de enlace respeta mejor las distancias originales, y así la elección deja de ser a ojo. En este dataset, Ward es el que da los clusters más compactos y equilibrados.


