# SOM — Segmentacion de Clientes con Self-Organizing Maps

## Contexto de negocio

Una cadena de retail quiere segmentar su base de 500 clientes para
personalizar campanas de marketing, usando Self-Organizing Maps
para descubrir la topologia natural de los datos de comportamiento.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Archivo | dataset_SOM.xlsx |
| Registros | 500 clientes |
| Variables | Recencia_Dias, Frecuencia_Semanal, Gasto_Promedio, Uso_Descuentos |

## Tecnicas aplicadas

- SOM 10x10 con minisom (5000 iteraciones)
- U-Matrix (distancias entre neuronas vecinas)
- Mapa de frecuencia (clientes por neurona)
- Component planes (un mapa por variable)
- SOM + K-Means para clustering sobre pesos del SOM
- Comparativa con K-Means directo (silhouette score)

## Hallazgo clave

El SOM revela la topologia de los segmentos: los clientes de alto
valor y los cazadores de descuentos ocupan regiones diferenciadas
del mapa, con zonas de transicion que K-Means no detecta.

## Como ejecutar

```bash
pip install pandas numpy matplotlib seaborn minisom scikit-learn openpyxl
jupyter notebook notebook.ipynb
```
