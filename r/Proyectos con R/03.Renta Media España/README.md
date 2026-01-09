# Análisis de la Renta Neta Media por persona en España 💸

Este proyecto tiene como objetivo visualizar la renta neta media por persona a nivel municipal en España para el año 2019. Utiliza varias librerías de R para la manipulación de datos, visualización y diseño gráfico.

<img width="1265" alt="Screenshot 2024-05-21 at 10 56 41" src="https://github.com/BORJAMOME/Average_net_income/assets/19588053/78509dad-4001-415c-80d1-faae31efe7ad">

## Requisitos

Asegúrate de tener instaladas las siguientes librerías antes de ejecutar el código:

- `CDR`: Herramientas para trabajar con datos demográficos y económicos en R.
- `sf`: Manejo y análisis de datos espaciales (geometrías como puntos, líneas y polígonos).
- `dplyr`: Manipulación y transformación de datos de forma eficiente y legible.
- `ggplot2`: Creación de gráficos y visualizaciones basadas en la gramática de gráficos.
- `classInt`: Clasificación de intervalos para segmentar variables continuas.
- `viridis`: Paletas de colores perceptualmente uniformes para gráficos y mapas.
- `scales`: Paletas de colores perceptualmente uniformes para gráficos y mapas.
- `showtext`: Uso de fuentes personalizadas en gráficos, incluyendo Google Fonts.

Puedes instalarlas con:

```r
install.packages(c("CDR", "sf", "dplyr", "ggplot2", "classInt", "viridis", "scales", "showtext"))
```
# Descripción del Proyecto
## 1. Configuración de fuentes y entorno gráfico
Primero, se configuran las fuentes y se habilita su uso automático:
```r
library("showtext")
font_add_google("Oswald")
showtext_auto()
```
## 2. Carga y preparación de los datos
Se cargan los datos de los municipios y se unen con los datos de renta para el año 2019. Luego, se seleccionan las columnas relevantes:

```r
library("dplyr")

munis_renta <- municipios %>%
  left_join(renta_municipio_data) %>%
  select(name, cpro, cmun, `2019`)
```
## 3. Visualización inicial de la renta por municipio
Se crea un gráfico utilizando ggplot2 para mostrar la renta neta media por persona en cada municipio sin ejes de latitud y longitud:

```r
library("ggplot2")
library("viridis")
library("scales")

ggplot(munis_renta) +
  geom_sf(aes(fill = `2019`), color = NA) +
  scale_fill_viridis_c(labels = label_number(big.mark = ".", decimal.mark = ",", suffix = " €")) +
  labs(title = "Renta neta media por persona (€)", subtitle = "Escala municipal en España en 2019") +
  theme_void() +
  theme(plot.title = element_text(hjust = 0.5, size = 10, family = "Oswald"), 
        plot.subtitle = element_text(hjust = 0.5, size = 12, family = "Oswald"))
```

## 4. Limpieza de datos
Se eliminan los valores NA de la columna de renta:

```r
munis_renta_clean <- munis_renta %>%
  filter(!is.na(`2019`))
```
## 5. Creación de clases Fisher-Jenks
Se crean clases utilizando el método Fisher-Jenks para una mejor segmentación de los datos:
```r
library("classInt")

fisher <- classIntervals(munis_renta_clean$`2019`, style = "fisher", n = 10)
```
## 6. Paleta de colores personalizada
Se define una paleta de colores personalizada para la visualización:
```r
custom_palette <- c("#ffffd4", "#fee391", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0570b0", "#08589e")
```

## 7. Gráfico final con clases Fisher-Jenks
Se crea un gráfico final utilizando las clases Fisher-Jenks y la paleta de colores personalizada:
```r
ggplot(munis_renta_clean) +
  geom_sf(aes(fill = `2019`), color = NA) +
  scale_fill_gradientn(colors = custom_palette, labels = label_number(suffix = "€")) +
  labs(title = "Renta neta media por persona (€)", subtitle = "Escala municipal en España en 2019", caption = "Borja Mora") +
  theme_void() +
  theme(plot.title = element_text(hjust = 0., size = 60, family = "Oswald"), 
        plot.subtitle = element_text(hjust = 0., size = 30, family = "Oswald"))
```

## 8. Guardado del gráfico
Se guarda el gráfico generado en un archivo PNG:

```r
ggsave('renta.png', height = 5.5, width = 8.5, bg = "white")
```

## Conclusión
Este proyecto proporciona una visualización clara y atractiva de la renta neta media por persona en los municipios de España para el año 2019, utilizando métodos estadísticos avanzados y técnicas de visualización de datos.


