# Clustering Jerárquico — Caso completo (banca)

## Contexto de negocio
Un banco necesita segmentar 300 clientes por 5 métricas financieras para diseñar productos personalizados (tarjetas, créditos, seguros).

## Dataset
Sintético: 300 clientes bancarios con 5 features generados vía `make_blobs`.

## Técnicas aplicadas
- Coeficiente cofenético para comparar 4 linkages
- Dendrograma con mejor linkage
- Silhouette score para validar k
- Silhouette plot detallado
- Heatmap normalizado de perfiles

## Hallazgo clave
El coeficiente cofenético cuantifica qué linkage preserva mejor las distancias originales — Ward o Complete suelen ganar con datos euclídeos.

## Notebooks relacionados
- [01-caso-introductorio](../01-caso-introductorio/) — fundamentos básicos
- [02-caso-avanzado](../02-caso-avanzado/) — datos reales, 2 variables
- [K-Means caso completo](../../kmeans/03-segmentacion-politica/) — comparativa con K-Means

