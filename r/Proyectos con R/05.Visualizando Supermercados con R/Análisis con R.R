# Load required libraries
library(sf)
library(giscoR)
library(mapSpain)
library(tidyverse)
library(patchwork)
library(rmapshaper)
library(osmdata)

# Get provincial boundaries of Spain
esp <- esp_get_prov(epsg = 4326)

# Create a simple map of Spain
esp_map <- ggplot(esp) +
  geom_sf(colour = "#ffffff", linewidth = 0.2) +
  theme_void()

# Get bounding box for Spain
bbox_spain <- st_bbox(esp)

# Build OpenStreetMap query
q <- bbox_spain %>% 
  opq(timeout = 25 * 100) %>%
  add_osm_feature("name", "Mercadona") %>% 
  add_osm_feature("shop", "supermarket")

# Get data from inside Spain
EA <- osmdata_sf(q)

# Filter Mercadona points inside Spain
EA_spain <- st_intersection(EA$osm_points, esp)

# Create an improved final map
final_map <- ggplot() +
  geom_sf(data = esp, fill = "#ffffff", color = "#eceae9") +
  geom_sf(data = EA_spain, color = "#269e6b", fill = "#269e6b", alpha = 0.6, size = 0.5, shape = 16) +
  coord_sf(xlim = c(-10, 5), ylim = c(35, 45)) +
  theme_void() +
  ggtitle("Mercadona") +
  theme(plot.title = element_text(family = "Lato", color = "#333333", size = 18, hjust = 0.5, vjust = 1,
                                  face = "bold", lineheight = 1.2)) +
  theme(plot.background = element_rect(fill = "#fffefc"))

# Display the final map
final_map

# Save the file
ggsave('Mercadona.png', height = 7.5, width = 9.5)
