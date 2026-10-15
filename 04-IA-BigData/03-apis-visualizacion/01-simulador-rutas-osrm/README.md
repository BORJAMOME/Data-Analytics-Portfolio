# Simulador de rutas reales · OSRM y mapa interactivo

Simulador que calcula rutas reales en coche entre dos puntos y representa el recorrido en un mapa interactivo, combinando una API de enrutamiento con cálculos geográficos y animación.

## Cómo funciona

1. El usuario selecciona el origen y el destino haciendo clic en el mapa.
2. La API de **OSRM** devuelve la ruta por carretera, la distancia y el tiempo estimado.
3. Las coordenadas se interpolan según la distancia recorrida para conseguir un desplazamiento visual más uniforme.
4. Un marcador anima el recorrido sobre el mapa con velocidad configurable.

## Técnicas aplicadas

- **APIs REST:** peticiones con `requests` y gestión de errores.
- **Cálculo geográfico:** fórmula de Haversine y operaciones vectorizadas con NumPy.
- **Interpolación numérica:** `np.interp` para calcular posiciones intermedias a lo largo de la ruta.
- **Visualización interactiva:** mapas con `ipyleaflet` y controles con `ipywidgets` en Jupyter Notebook.

## Tecnologías

Python · OSRM · Requests · NumPy · ipyleaflet · ipywidgets
