# Clustering Jerarquico — Caso completo (banca)

## Contexto de negocio
Un banco necesita segmentar 300 clientes por 5 metricas financieras para disenar productos personalizados (tarjetas, creditos, seguros).

## Dataset
Sintetico: 300 clientes bancarios con 5 features generados via `make_blobs`.

## Tecnicas aplicadas
- Coeficiente cofenetico para comparar 4 linkages
- Dendrograma con mejor linkage
- Silhouette score para validar k
- Silhouette plot detallado
- Heatmap normalizado de perfiles

## Hallazgo clave
El coeficiente cofenetico cuantifica que linkage preserva mejor las distancias originales — Ward o Complete suelen ganar con datos euclideos.

## Notebooks relacionados
- [01-caso-introductorio](../01-caso-introductorio/) — fundamentos basicos
- [02-caso-avanzado](../02-caso-avanzado/) — datos reales, 2 variables
- [K-Means caso completo](../../kmeans/03-segmentacion-politica/) — comparativa con K-Means

## Como ejecutar
```bash
pip install pandas numpy matplotlib seaborn scikit-learn
jupyter notebook notebook.ipynb
```
