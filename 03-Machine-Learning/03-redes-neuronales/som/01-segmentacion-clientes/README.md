# SOM — Segmentación de Clientes con Self-Organizing Maps

## Contexto de negocio

Una cadena de retail quiere segmentar a sus 500 clientes para
personalizar campañas. Uso un Self-Organizing Map para ver cómo se
reparten y qué grupos quedan cerca unos de otros.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Archivo | dataset_SOM.xlsx |
| Registros | 500 clientes |
| Variables | Recencia_Dias, Frecuencia_Semanal, Gasto_Promedio, Uso_Descuentos |

## Técnicas aplicadas

- SOM 10×10 con minisom (5000 iteraciones)
- U-Matrix (distancias entre neuronas vecinas)
- Mapa de frecuencia (clientes por neurona)
- Component planes (un mapa por variable)
- SOM + K-Means para clustering sobre pesos del SOM
- Comparativa con K-Means directo (silhouette score)

## Hallazgo clave

El SOM enseña cómo se colocan los segmentos entre sí. Los clientes
de alto valor y los cazadores de descuentos quedan en zonas distintas
del mapa, y entre medias hay zonas de transición que K-Means, por sí
solo, no enseña.

