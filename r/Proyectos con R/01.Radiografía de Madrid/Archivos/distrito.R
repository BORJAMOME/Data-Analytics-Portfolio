library(tidyverse)
library(knitr)
library(scales)
library(wordcloud)
library(visNetwork)
library(networkD3)
library(knitr)
library(ggplot2)
library(showtext)

font_add_google("Oswald")
showtext_auto()

population <- read.csv("population.csv", sep=",", fileEncoding="UTF-8")

# Structure
str(population)


# Population by year 
population %>%
  filter(Year=="2023") %>%
  group_by(Neighborhood, Gender) %>%
  summarise(count = sum(Number)) %>%
  mutate(percent = paste0(round((count / sum(count)) * 100, 2), "%")) %>%
  ggplot(aes(x = reorder(Neighborhood, count), y = count)) +
  coord_flip() +
  geom_bar(stat = "identity", aes(fill = Gender)) +
  geom_text(aes(label = percent, group = Gender), position = position_stack(vjust = 0.5), size= 1) +
  scale_fill_manual(values = c("#1d8f89", "#ee5a45"), name = "Genero") +
  scale_y_continuous(labels = comma) +
  labs(x = "Barrio", y = "Población", title = "Población por barrio (2023)") +
  theme_minimal() + 
  theme(
    plot.background = element_rect(fill = "#fffefc", color = NA) 
  ) +
  theme(
    panel.border = element_blank(), 
    panel.grid = element_blank(), 
    axis.line = element_line(color = "#fffefc"), 
    text = element_text(family = "Oswald", size = 4, color = "black")
  )
ggsave('Población_barrio.png', height = 8.5, width = 10.5)

