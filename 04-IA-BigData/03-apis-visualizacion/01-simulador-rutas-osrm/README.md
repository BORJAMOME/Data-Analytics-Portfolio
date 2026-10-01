# Simulador de rutas reales — API OSRM + mapa interactivo

## Contexto
Calcular la ruta real en coche entre dos puntos, no la línea recta, y enseñar el recorrido
en un mapa interactivo, como haría cualquier app de navegación o de reparto.

## Cómo funciona
1. El usuario hace clic en el mapa para fijar **origen** y **destino**.
2. La app llama a la API pública de **OSRM** (Open Source Routing Machine) para obtener la
   geometría real de la ruta en coche, la distancia y el tiempo estimado.
3. Los puntos de la ruta se **interpolan por distancia recorrida** (fórmula de Haversine),
   no por número de vértices, para que la animación tenga velocidad constante.
4. Un marcador anima el recorrido punto a punto sobre el mapa, con velocidad configurable.

## Técnicas aplicadas
- Llamadas a una API REST externa (`requests`) y gestión de errores de geocodificación y de ruta.
- Cálculo de distancias geográficas con la fórmula de Haversine (NumPy vectorizado).
- Interpolación lineal (`np.interp`) para que la animación sea fluida sea cual sea el detalle de la ruta.
- Mapas y widgets interactivos en Jupyter con **ipyleaflet** e **ipywidgets** (clics, capas
  que cambian, controles).

## Stack
`requests` · `numpy` · `ipyleaflet` · `ipywidgets`

## Notas
La interfaz es un widget de Jupyter (mapa, botones y slider). Para verla funcionando hay que
ejecutar el notebook en local, porque GitHub no muestra el estado interactivo de ipywidgets.
