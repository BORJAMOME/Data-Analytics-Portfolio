# Mapa sobre la distribución de supermercados Mercadona en España
<img src="https://img.shields.io/badge/Language-R-blue" alt="Language">  
<img src="https://img.shields.io/badge/Data-OpenStreetMap-green" alt="Data Source">

Este proyecto, desarrollado en **R**, tiene como objetivo **visualizar la distribución geográfica de los supermercados Mercadona** en España. Utilizando datos de **OpenStreetMap**, hemos creado un mapa visualmente atractivo que ilustra la presencia y concentración de Mercadona en diferentes regiones.



## ¿Por qué Mercadona?

**Mercadona** es una de las cadenas de supermercados más grandes de España, y su distribución refleja tendencias clave del mercado, como:
- **Patrones de consumo local**.
- **Impacto en la economía regional**.
- **Dinámicas de expansión en áreas urbanas y rurales**.

Este análisis ayuda a comprender su **influencia geográfica** y su relevancia como actor principal en el sector retail.


## Herramientas y tecnologías utilizadas

El análisis se realizó utilizando un conjunto de herramientas de **R** para el manejo de datos espaciales y la visualización:

- **`sf`**: Manejo de datos geoespaciales.
- **`osmdata`**: Extracción de datos de OpenStreetMap.
- **`ggplot2`**: Visualización de datos.
- **`giscoR` y `mapSpain`**: Datos espaciales específicos de España.
- **`tidyverse`**: Manipulación y limpieza de datos.
- **`rmapshaper`**: Simplificación de geometrías.



## Visualización: Mapa de Mercadona

<p align="center">
  
![mercadona](https://github.com/user-attachments/assets/d8544049-83c6-455a-880b-f3c6bc795459)

</p>

### Características visuales:
1. **Fondo negro** para un diseño moderno (`#232323`).
2. **Líneas de provincias en gris** claro (`#d3d3d3`) para contraste.
3. **Puntos verdes** (`#2a9d8f`) que representan los supermercados Mercadona.
4. **Título destacado**: *"Distribución de supermercados Mercadona en España"*.
5. **Créditos informativos**: En la esquina inferior izquierda.



## Código

Puedes generar el mapa utilizando el siguiente código en R:

```r
# Cargar librerías necesarias
library(sf)
library(giscoR)
library(mapSpain)
library(tidyverse)
library(osmdata)

# Obtener límites de las provincias de España
esp <- esp_get_prov(epsg = 4326)

# Crear la consulta en OpenStreetMap
bbox_spain <- st_bbox(esp)
q <- bbox_spain %>% 
  opq() %>%
  add_osm_feature("name", "Mercadona") %>% 
  add_osm_feature("shop", "supermarket")

# Descargar datos de Mercadona
EA <- osmdata_sf(q)

# Filtrar puntos dentro de España
EA_spain <- st_intersection(EA$osm_points, esp)

# Crear el mapa
final_map <- ggplot() +
  geom_sf(data = esp, fill = "#232323", color = "#d3d3d3") +
  geom_sf(data = EA_spain, 
          color = "#2a9d8f", size = 1.5, alpha = 0.8) +
  coord_sf() +
  ggtitle("Distribución de supermercados Mercadona en España") +
  theme_void() +
  theme(
    plot.title = element_text(color = "#ffffff", size = 20, hjust = 0.5),
    plot.background = element_rect(fill = "#232323")
  ) +
  annotate("text", x = -9, y = 35.5, 
           label = "Info: OpenStreetMap | Borja Mora", 
           color = "#ffffff", size = 4, hjust = 0)

# Mostrar el mapa
final_map

