# Conteo de vehículos en vídeo con YOLOv8 + ByteTrack

## Contexto de negocio
Un ayuntamiento, o quien gestione una carretera, quiere saber cuánto tráfico pasa por un tramo concreto. Poner sensores cuesta dinero y obra, pero ya hay cámaras grabando ese tramo las 24 horas.

## Dataset
`trafico_autopista.mp4`: vídeo real de cámara de tráfico (640×360, 25 fps, ~48 s).

## Técnicas aplicadas
- Detección por frame con **YOLOv8n** (clases COCO 2/3/5/7: coche, moto, autobús, camión)
- **Tracking** con ByteTrack (`model.track(..., tracker="bytetrack.yaml")`) para mantener un ID estable por vehículo entre frames
- Conteo por cruce de línea: cada vehículo se cuenta **una sola vez**, al cruzar `LINE_Y` en la dirección esperada
- Procesamiento sin interfaz gráfica (sin `cv2.imshow`), guardando solo los frames de muestra necesarios para comprobar el resultado

## Hallazgo clave
39 vehículos contados en 47,7 s de vídeo (unos 49 por minuto), comprobados frame a frame. Sin instalar ningún sensor: solo con la grabación de una cámara que ya estaba ahí.

## Stack
ultralytics (YOLOv8 + ByteTrack), OpenCV, Matplotlib

## Notas
El script de partida (`coche.py`) enseña el vídeo anotado en una ventana en directo con `cv2.imshow`. Va bien para depurar en local, pero en un notebook no se puede reproducir: necesita interfaz gráfica y se queda esperando a que pulses una tecla. Aquí la lógica de detección, seguimiento y conteo es la misma, pero en vez de la ventana guardo frames de muestra. Así el notebook se ejecuta y se comprueba de principio a fin sin tocar nada.
