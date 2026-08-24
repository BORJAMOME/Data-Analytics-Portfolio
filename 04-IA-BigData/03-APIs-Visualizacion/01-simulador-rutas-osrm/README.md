# Simulador de rutas reales — API OSRM + mapa interactivo

## Contexto
Calcular la ruta real en coche entre dos puntos geográficos (no la línea recta) y visualizar
el recorrido de forma interactiva, como haría cualquier app de navegación o logística.

## Cómo funciona
1. El usuario hace clic en el mapa para fijar **origen** y **destino**.
2. La app llama a la API pública de **OSRM** (Open Source Routing Machine) para obtener la
   geometría real de la ruta en coche, la distancia y el tiempo estimado.
3. Los puntos de la ruta se **interpolan por distancia recorrida** (fórmula de Haversine),
   no por número de vértices, para que la animación tenga velocidad constante.
4. Un marcador anima el recorrido punto a punto sobre el mapa, con velocidad configurable.

## Técnicas aplicadas
- Consumo de una API REST externa (`requests`) y manejo de errores de geocodificación/ruta.
- Cálculo de distancias geográficas con la fórmula de Haversine (NumPy vectorizado).
- Interpolación lineal (`np.interp`) para animación fluida independiente de la resolución de la ruta.
- Mapas y widgets interactivos en Jupyter con **ipyleaflet** + **ipywidgets** (eventos de clic,
  capas dinámicas, controles de usuario).

## Stack
`requests` · `numpy` · `ipyleaflet` · `ipywidgets`

## Notas
La interfaz es un widget interactivo de Jupyter (mapa + botones + slider): para verla en
funcionamiento hay que ejecutar el notebook localmente, ya que GitHub no renderiza el estado
interactivo de ipywidgets.
