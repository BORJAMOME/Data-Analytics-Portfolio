# Detección de objetos en imágenes con YOLOv8

## Contexto de negocio
Una tienda de muebles y decoración tiene un catálogo de fotos de ambientes (salones, dormitorios) que crece más rápido de lo que da tiempo a etiquetar a mano. Sin etiquetas por producto, esas fotos no se pueden buscar ni usar para recomendaciones visuales.

## Dataset
2 fotos reales de catálogo de interiorismo (`salon.png`, `dormitorio.jpg`).

## Técnicas aplicadas
- Detección de objetos con **YOLOv8n** preentrenado (80 clases COCO), sin fine-tuning
- Umbral de confianza configurable (`conf=0.5`)
- Visualización de cajas y etiquetas con `matplotlib`

## Hallazgo clave
El modelo reconoce bien sofás, sillas, plantas y relojes, con confianzas de entre 0,5 y 0,9. Pero lo que no está entre las 80 clases de COCO (un puf, una mesita auxiliar) lo etiqueta como lo más parecido que conoce: la caja está en su sitio, pero el nombre es incorrecto. Un etiquetado automático necesita una revisión humana rápida antes de publicar; con un umbral de confianza no basta.

## Stack
ultralytics (YOLOv8), OpenCV, Matplotlib

## Notas
La detección en vídeo en directo (`cv2.imshow`) no se puede reproducir en un notebook sin interfaz gráfica, así que aquí solo trabajo con imágenes. El seguimiento de objetos en vídeo está en otro caso: [02-conteo-vehiculos-video](../02-conteo-vehiculos-video/).
