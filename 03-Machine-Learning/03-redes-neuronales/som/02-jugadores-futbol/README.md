# SOM — Mapa de Perfiles de Futbolistas

## Contexto de negocio

El departamento de scouting de un club analiza 800 jugadores para
encontrar arquetipos tácticos, detectar jugadores polivalentes y ver
si la posición que tienen asignada encaja con su perfil.

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

El mapa se divide en 3 zonas que coinciden con las 3 posiciones, y
entre ellas hay zonas de transición donde caen los jugadores
polivalentes. Por los component planes, lo que más separa a unos de
otros es Defensa/Físico por un lado y Tiro/Regate por otro.

