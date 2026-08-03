# SOM — Mapa de Perfiles de Futbolistas

## Contexto de negocio

El departamento de scouting de un club analiza 800 jugadores para
identificar arquetipos tacticos, detectar jugadores polivalentes
y validar si las posiciones asignadas coinciden con los perfiles reales.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Archivo | jugadores_futbol.xlsx |
| Registros | 800 jugadores |
| Features | Velocidad, Tiro, Regate, Pase, Defensa, Fisico |
| Label | Posicion_Real (Defensa/Centrocampista/Delantero) — solo validacion |

## Tecnicas aplicadas

- SOM 12x12 con minisom (5000 iteraciones)
- U-Matrix y mapa de posiciones superpuestas
- Component planes (6 atributos)
- PCA 2D como validacion comparativa
- Indice de versatilidad basado en distancia U-Matrix

## Hallazgo clave

El mapa SOM muestra 3 zonas claras correspondientes a las 3 posiciones,
con zonas de transicion donde se situan jugadores polivalentes. Los
component planes revelan que Defensa/Fisico y Tiro/Regate son los
ejes principales de diferenciacion.

## Como ejecutar

```bash
pip install pandas numpy matplotlib seaborn minisom scikit-learn openpyxl
jupyter notebook notebook.ipynb
```
