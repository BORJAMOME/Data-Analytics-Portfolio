# SOM — Mapa de Perfiles de Futbolistas

## Contexto de negocio

El departamento de scouting de un club analiza 800 jugadores para
identificar arquetipos tácticos, detectar jugadores polivalentes
y validar si las posiciones asignadas coinciden con los perfiles reales.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Archivo | jugadores_futbol.xlsx |
| Registros | 800 jugadores |
| Features | Velocidad, Tiro, Regate, Pase, Defensa, Físico |
| Label | Posición_Real (Defensa/Centrocampista/Delantero) — solo validación |

## Técnicas aplicadas

- SOM 12×12 con minisom (5000 iteraciones)
- U-Matrix y mapa de posiciones superpuestas
- Component planes (6 atributos)
- PCA 2D como validación comparativa
- Índice de versatilidad basado en distancia U-Matrix

## Hallazgo clave

El mapa SOM muestra 3 zonas claras correspondientes a las 3 posiciones,
con zonas de transición donde se sitúan jugadores polivalentes. Los
component planes revelan que Defensa/Físico y Tiro/Regate son los
ejes principales de diferenciación.

## Cómo ejecutar

```bash
pip install pandas numpy matplotlib seaborn minisom scikit-learn openpyxl
jupyter notebook notebook.ipynb
```
