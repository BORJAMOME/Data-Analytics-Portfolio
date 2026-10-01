# Visión Artificial

Detección y seguimiento de objetos con modelos preentrenados, sin entrenar ninguna red
desde cero. La idea es ver qué resuelve y qué no un modelo genérico ante un caso de negocio
concreto.

## Proyectos

| # | Caso | Qué se aprende |
|---|------|-----------------|
| 1 | [Detección de objetos en imágenes](01-deteccion-objetos-imagenes/) | YOLOv8 preentrenado, límites de un modelo genérico frente a clases no vistas |
| 2 | [Conteo de vehículos en vídeo](02-conteo-vehiculos-video/) | YOLOv8 + ByteTrack, tracking de identidad entre frames, conteo por cruce de línea |

## Stack
`ultralytics` (YOLOv8) · `ByteTrack` · `opencv-python` · `matplotlib` · `numpy`

---

[Volver a IA & Big Data](../README.md)
