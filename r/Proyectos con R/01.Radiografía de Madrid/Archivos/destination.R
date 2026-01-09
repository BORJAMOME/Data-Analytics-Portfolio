# Leer los datos
immigrants_emigrants_by_destination <- read.csv("immigrants_emigrants_by_destination.csv", sep = ",", fileEncoding = "UTF-8")

# Nodes 

nodes <- data.frame(label = unique(immigrants_emigrants_by_destination$from))
nodes$id <- 1:nrow(nodes)



# Emigrants 

emigrants_by_destination <- immigrants_emigrants_by_destination %>%
  filter(from == "Madrid")

# Edges 

edges <- emigrants_by_destination %>%
  left_join(nodes, by = c("from" = "label")) %>%
  select(-from) %>%
  rename(from = id)

edges <- emigrants_by_destination %>% 
  left_join(nodes, by = c("from" = "label")) %>%
  select(-from) %>%
  dplyr::rename(from = id) 

edges <- edges %>%
  left_join(nodes, by = c("to" = "label")) %>%
  select(-to) %>%
  rename(to = id)

nodes_d3 <- mutate(nodes, id = id - 1)
edges_d3 <- mutate(edges, from = from - 1, to = to -1)

# sankeyNetwork - Emigrants destination 

sankeyNetwork(Links = edges_d3, Nodes = nodes_d3, Source= 'from', 
              Target = 'to', NodeID = 'label', Value = 'weight', fontSize = 16, unit = 'Letter(s)')

#------------------------------------------------------------------------------------------------------------------
# Leer los datos
immigrants_emigrants_by_destination2 <- read.csv("/Users/borja/Desktop/Madrid_I/immigrants_emigrants_by_destination2.csv", sep = ",", fileEncoding = "UTF-8")



nodes <- as.data.frame(unique(immigrants_emigrants_by_destination2$from))
nodes$id <- 1:nrow(nodes)
nodes <- nodes[, c(2,1)]
names(nodes) <- c("id", "label")

# Emigrants 
emigrants_by_destination2 <- immigrants_emigrants_by_destination2 %>%
  filter(from %in% c("Centro", "Arganzuela", "Retiro", "Salamanca", 
                     "Chamartín", "Tetuán", "Chamberí", "Fuencarral-El Pardo",
                     "Moncloa-Aravaca", "Latina","Carabanchel", "Usera", "Puente de Vallecas", "Moratalaz", 
                     "Ciudad Lineal", "Hortaleza", "Villaverde", "Villa de Vallecas",
                     "Vicálvaro", "San Blas-Canillejas", "Barajas"))

# Edges
edges <- emigrants_by_destination2 %>% 
  left_join(nodes, by=c("from"="label")) %>%
  select(-from) %>%
  dplyr::rename(from=id)

edges <- edges %>% 
  left_join(nodes, by=c("to"="label")) %>%
  select(-to) %>%
  dplyr::rename(to=id)

nodes_d3 <- mutate(nodes, id=id-1)
edges_d3 <- mutate(edges, from=from-1, to=to-1)

# sankeyNetwork - Emigrants destination

sankeyNetwork(Links=edges_d3, Nodes=nodes_d3, Source="from", Target="to", 
              NodeID="label", Value="weight", fontSize=16, unit="Letter(s)")

#_________________________________________________________________________________________
# Leer los datos
immigrants_emigrants_by_destination2 <- read.csv("/Users/borja/Desktop/Madrid_I/immigrants_emigrants_by_destination2.csv", sep = ",", fileEncoding = "UTF-8")

nodes <- data.frame(label = unique(c(immigrants_emigrants_by_destination2$from, immigrants_emigrants_by_destination2$to)))
nodes$id <- 1:nrow(nodes)

# Immigrants 
immigrants_by_destination2 <- immigrants_emigrants_by_destination2 %>%
  filter(to %in% c("Centro", "Arganzuela", "Retiro", "Salamanca", 
                   "Chamartín", "Tetuán", "Chamberí", "Fuencarral-El Pardo",
                   "Moncloa-Aravaca", "Latina","Carabanchel", "Usera", "Puente de Vallecas", "Moratalaz", 
                   "Ciudad Lineal", "Hortaleza", "Villaverde", "Villa de Vallecas",
                   "Vicálvaro", "San Blas-Canillejas", "Barajas"))

# Edges
edges <- immigrants_by_destination2 %>% 
  left_join(nodes, by=c("from"="label")) %>%
  select(-from) %>%
  dplyr::rename(from=id)

edges <- edges %>% 
  left_join(nodes, by=c("to"="label")) %>%
  select(-to) %>%
  dplyr::rename(to=id)

nodes_d3 <- mutate(nodes, id=id-1)
edges_d3 <- mutate(edges, from=from-1, to=to-1)

# sankeyNetwork - Emigrants destination
sankeyNetwork(Links=edges_d3, Nodes=nodes_d3, Source="from", Target="to", 
              NodeID="label", Value="weight", fontSize=16, unit="Letter(s)")







