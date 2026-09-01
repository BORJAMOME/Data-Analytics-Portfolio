# Conteo de vehículos en vídeo con YOLOv8 + ByteTrack

## Contexto de negocio
Un ayuntamiento o gestor de infraestructura viaria quiere conocer el volumen de tráfico en un tramo concreto. Instalar sensores físicos es caro y requiere obra; sin embargo, ya existen cámaras de tráfico grabando ese mismo tramo las 24 horas.

## Dataset
`trafico_autopista.mp4` — vídeo real de cámara de tráfico (640×360, 25 fps, ~48 s).

## Técnicas aplicadas
- Detección por frame con **YOLOv8n** (clases COCO 2/3/5/7: coche, moto, autobús, camión)
- **Tracking** con ByteTrack (`model.track(..., tracker="bytetrack.yaml")`) para mantener un ID estable por vehículo entre frames
- Conteo por cruce de línea: cada vehículo se cuenta **una sola vez**, al cruzar `LINE_Y` en la dirección esperada
- Procesamiento headless (sin `cv2.imshow`): se guardan solo los frames de muestra necesarios para verificar el resultado

## Hallazgo clave
39 vehículos contados en 47,7 s de vídeo (~49 vehículos/minuto), verificado frame a frame — sin instalar ningún sensor físico, solo reutilizando la grabación de una cámara ya existente.

## Stack
ultralytics (YOLOv8 + ByteTrack), OpenCV, Matplotlib

## Notas
El script original (`coche.py`) muestra el vídeo anotado en una ventana en tiempo real con `cv2.imshow` — útil para depurar en local, pero no ejecutable de forma reproducible en un notebook (requiere GUI y bloquea a la espera de una tecla). Esta versión conserva exactamente la misma lógica de detección, tracking y conteo, sustituyendo la ventana en vivo por el guardado de frames de muestra, para que el notebook se pueda ejecutar y verificar de principio a fin sin intervención manual.
