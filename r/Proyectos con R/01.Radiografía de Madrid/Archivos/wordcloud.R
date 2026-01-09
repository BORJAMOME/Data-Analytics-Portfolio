names <- read.csv("Madrid_I/names.csv", sep = ",", fileEncoding = "UTF-8")

library(wordcloud2)

names <- names %>%
  group_by(Name) %>%
  summarise(count = sum(Frecuency)) %>%
  arrange(desc(count))


min_freq <- 10
names_filtered <- names %>%
  filter(count >= min_freq)


wordcloud2(names_filtered, size = 1.5, fontFamily = "Oswald", color = "random-light",
           backgroundColor = "#fffefc", rotateRatio = 0.3, minRotation = -pi/4, maxRotation = pi/4,
           gridSize = 10, minSize = 10, shuffle = TRUE)

#______________________________________________________________________________________# Leer los datos
surname <- read.csv("surname.csv", sep = ",", fileEncoding = "UTF-8")


surname <- surname %>%
  group_by(Surname) %>%
  summarise(count = sum(Frecuency)) %>%
  arrange(desc(count))

min_freq <- 10
surname_filtered <- surname %>%
  filter(count >= min_freq)

wordcloud2(surname_filtered, size = 1.5, fontFamily = "Oswald", color = "random-light",
           backgroundColor = "#fffefc", rotateRatio = 0.3, minRotation = -pi/4, maxRotation = pi/4,
           gridSize = 10, minSize = 10, shuffle = TRUE)

#_________________________________________________________________________
baby_names <- read.csv("baby_names.csv", sep = ",", fileEncoding = "UTF-8")

baby_names <- baby_names %>%
  group_by(Name) %>%
  summarise(count = sum(Frecuency)) %>%
  arrange(desc(count))

min_freq <- 10
baby_names_filtered <- baby_names %>%
  filter(count >= min_freq)

wordcloud2(baby_names_filtered, size = 1.5, fontFamily = "Oswald", color = "random-light",
           backgroundColor = "#fffefc", rotateRatio = 0.3, minRotation = -pi/4, maxRotation = pi/4,
           gridSize = 10, minSize = 10, shuffle = TRUE)
















