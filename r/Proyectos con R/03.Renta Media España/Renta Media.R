# Loading libraries and visualization settings
# --------------------------------------------------------
library("CDR") # Library with the data
library("sf")
library("dplyr")
library("ggplot2")
library("classInt")
library("viridis")
library("scales")
library("showtext")
font_add_google("Oswald")
showtext_auto()

# Data loading
# --------------------------------------------------------

# Load municipality data
munis_renta <- municipios %>%
  left_join(renta_municipio_data) %>%
  select(name, cpro, cmun, `2019`)

# Income graph by municipality without latitude and longitude axes
# --------------------------------------------------------ggplot(munis_renta) +
  geom_sf(aes(fill = `2019`), color = NA) +
  scale_fill_viridis_c(labels = label_number(big.mark = ".", decimal.mark = ",", suffix = " €")) +
      labs(title = "Average net income per person (€)",
      subtitle = "Municipal scale in Spain in 2019") +
  theme_void() +
  theme(plot.title = element_text(hjust = 0.5, size = 10, family = "Oswald"), 
        plot.subtitle = element_text(hjust = 0.5, size = 12, family = "Oswald"))

# Data cleaning
# --------------------------------------------------------

# Remove rows with missing income datamunis_renta_clean <- munis_renta %>%
munis_renta_clean <- munis_renta %>%
  filter(!is.na(`2019`))
  
# Creation of Fisher-Jenks classes
# --------------------------------------------------------

fisher <- classIntervals(munis_renta_clean$`2019`, style = "fisher", n = 10)


# Definition of custom color palette
# --------------------------------------------------------
custom_palette <- c("#ffffd4",
                    "#fee391",
                    "#7bccc4",
                    "#4eb3d3",
                    "#2b8cbe",
                    "#0570b0",
                    "#08589e")

# Graph with Fisher-Jenks classes and custom color palette
# --------------------------------------------------------
ggplot(munis_renta_clean) +
  geom_sf(aes(fill = `2019`), color = NA) +
  scale_fill_gradientn(colors = custom_palette, labels = label_number(suffix = "€")) +
  labs(title = "Average net income per person (€)", 
       subtitle = "Municipal scale in Spain in 2019", 
       caption = "Borja Mora") + 
  theme_void() +
  theme(plot.title = element_text(hjust = 0., size = 60, family = "Oswald"), 
        plot.subtitle = element_text(hjust = 0., size = 30, family = "Oswald"))

# Save the graph as an image
# --------------------------------------------------------
ggsave('renta.png', height = 5.5, width = 8.5, bg = "white")
