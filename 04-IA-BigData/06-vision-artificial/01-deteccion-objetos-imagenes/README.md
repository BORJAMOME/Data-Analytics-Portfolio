# Detección de objetos en imágenes con YOLOv8

## Contexto de negocio
Una tienda de mobiliario y decoración tiene un catálogo de fotos de ambientes (salones, dormitorios) que crece más rápido que la capacidad de etiquetarlo a mano. Sin etiquetas por producto, esas fotos no son buscables ni reutilizables para recomendaciones visuales.

## Dataset
2 fotos reales de catálogo de interiorismo (`salon.png`, `dormitorio.jpg`).

## Técnicas aplicadas
- Detección de objetos con **YOLOv8n** preentrenado (80 clases COCO), sin fine-tuning
- Umbral de confianza configurable (`conf=0.5`)
- Visualización de cajas y etiquetas con `matplotlib`

## Hallazgo clave
El modelo etiqueta correctamente sofás, sillas, plantas y relojes con confianza alta (0.5-0.9), pero cualquier objeto fuera de las 80 clases de COCO (un puf, una mesita auxiliar) se etiqueta como el objeto más parecido que sí conoce — un falso positivo de categoría, no de localización. Un pipeline de etiquetado automático necesita revisión humana ligera antes de publicar, no solo un umbral de confianza.

## Stack
ultralytics (YOLOv8), OpenCV, Matplotlib

## Notas
Adaptado de un notebook exploratorio original que también incluía un bucle de detección en vivo sobre vídeo (`cv2.imshow`) y un intento de tracking con `supervision.ByteTrack` sin terminar. Ambas partes se descartaron aquí porque no son reproducibles en un notebook sin interfaz gráfica — el conteo de vehículos con tracking se desarrolló como caso aparte, ver [02-conteo-vehiculos-video](../02-conteo-vehiculos-video/).
