library(showtext)

font_add_google("Oswald")
showtext_auto()



# Leer los datos
births <- read.csv("births.csv", sep = ",", fileEncoding = "UTF-8")


births %>%
  group_by(Year, Gender) %>%
  summarise(Count=sum(Number)) %>%
  mutate(percent=paste0(round((Count/sum(Count))*100, 2), "%")) %>%
  filter(Year %in% c(2018, 2019)) %>%
  mutate(Year = factor(Year, levels = c(2018, 2019))) %>%
  ggplot(aes(x=Year, y=Count, fill=Gender)) +
  geom_bar(stat="identity", position="stack") + 
  geom_text(aes(label=percent, group=Gender), position=position_stack(vjust=0.5)) +
  scale_fill_manual(values = c("#1d8f89", "#ee5a45"), name = "Genero") +
  labs(x="Año", y="Nacimientos", title="Nacimientos por año (2018-2019)") +
  scale_y_continuous(labels=comma) +
  theme_minimal() +
  theme(
    plot.background = element_rect(fill = "#fffefc", color = NA),
  ) +
  theme(
    panel.border = element_blank(), 
    panel.grid = element_blank(), 
    axis.line = element_line(color = "#fffefc"), 
    text = element_text(family = "Oswald", size = 15, color = "black") 
  )

#____________________________________________________________________________
# Births by district (2017)
births %>%
  filter(Year=="2019") %>%
  group_by(District, Gender) %>%
  summarise(count=sum(Number)) %>%
  mutate(percent=paste0(round((count/sum(count))*100, 2), "%")) %>%
  ggplot(aes(x=reorder(District, count), y=count)) +
  geom_bar(stat="identity", aes(fill=Gender)) +
  geom_text(aes(label=percent, group=Gender), position=position_stack(vjust=0.5), size=3) +
  scale_fill_manual(values = c("#1d8f89", "#ee5a45"), name = "Genero") +
  scale_y_continuous(breaks=seq(0, 5000, 500), labels=comma) +
  labs(x="Distrito", y="Nacimientos", title="Nacimientos por distrito (2019)") +
  theme_minimal() +
  theme(
    plot.background = element_rect(fill = "#fffefc", color = NA), # Color de fondo de la gráfica
  ) +
  theme(
    panel.border = element_blank(), # Eliminar bordes del panel
    panel.grid = element_blank(), # Eliminar líneas de la cuadrícula
    axis.line = element_line(color = "#fffefc"), # Eliminar líneas de los ejes
    text = element_text(family = "Oswald", size = 15, color = "black") # Cambiar la tipografía aquí
  ) + 
  coord_flip()

#_____________________________-------------------_______________________________-
# Births by neightbourhood (2017)
births %>%
  filter(Year=="2019") %>%
  group_by(Neighborhood, Gender) %>%
  summarise(count=sum(Number)) %>%
  mutate(percent=paste0(round((count/sum(count))*100, 2), "%")) %>%
  ggplot(aes(x=reorder(Neighborhood, count), y=count)) +
  geom_bar(stat="identity", aes(fill=Gender)) +
  geom_text(aes(label=percent, group=Gender), position=position_stack(vjust=0.5), size = 1.5) +
  scale_fill_manual(values = c("#1d8f89", "#ee5a45"), name = "Genero") +
  scale_y_continuous(breaks=seq(0, 5000, 500), labels=comma) +
  labs(x="Barrio", y="Nacimientos", title="Nacimientos por barrio (2019)") +
  theme_minimal() +
  theme(
    plot.background = element_rect(fill = "#fffefc", color = NA), # Color de fondo de la gráfica
  ) +
  theme(
    panel.border = element_blank(), # Eliminar bordes del panel
    panel.grid = element_blank(), # Eliminar líneas de la cuadrícula
    axis.line = element_line(color = "#fffefc"), # Eliminar líneas de los ejes
    text = element_text(family = "Oswald", size = 4.5, color = "black") # Cambiar la tipografía aquí
  ) + 
  coord_flip()
