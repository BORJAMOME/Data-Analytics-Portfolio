# SOM — Segmentación de Clientes con Self-Organizing Maps

## Contexto de negocio

Una cadena de retail quiere segmentar su base de 500 clientes para
personalizar campañas de marketing, usando Self-Organizing Maps
para descubrir la topología natural de los datos de comportamiento.

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

El SOM revela la topología de los segmentos: los clientes de alto
valor y los cazadores de descuentos ocupan regiones diferenciadas
del mapa, con zonas de transición que K-Means no detecta.

