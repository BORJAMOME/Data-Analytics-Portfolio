# Load packages
library(CDR)
library(tidyverse)
library(janitor)
library(ggbeeswarn)
library(here)
library(patchwork)
library(ggtext)
library(ggrepel)
library(worldfootballR)
library(showtext)


# Set up fonts
font_add_google("Oswald")
showtext_auto()

# Get data
data <- fb_big5_advanced_season_stats(season_end_year=2000:2024,stat_type="standard",team_or_player="player")
print(data)

# Select relevant columns
data5liga <- data %>%
  select("Season_End_Year","Squad", "Comp", "Player","Min_Playing", "Gls_Per", "Ast_Per","xG_Per","xAG_Per")
data5liga <- data %>%
  select(
    Season_End_Year, Squad, Comp, Player, Min_Playing, Gls_Per, Ast_Per, xG_Per, xAG_Per
  ) %>%
  rename_all(tolower)

# Graph 1: Evolution of goals and assists per 90 minutes
data5liga |> 
  filter(player %in% c("Cristiano Ronaldo", "Lionel Messi", "Erling Haaland", "Kylian Mbappé", "Robert Lewandowski"),
         min_playing > 1000) |> 
  select(season_end_year, player, Goals = gls_per, Assists = ast_per) |> 
  pivot_longer(c(Goals, Assists), names_to = "metric", values_to = "value") |> 
  ggplot(aes(x = season_end_year, y = value, color = player)) +
  geom_line(size = 1,alpha = 0.5) +
  geom_point(size = 2, alpha = 1) +
  scale_color_manual(values = c("Lionel Messi" = "#fdd848",
                                "Cristiano Ronaldo" = "#aad59e",
                                "Erling Haaland" = "#9ab2d4",
                                "Kylian Mbappé" = "#f0743e",
                                "Robert Lewandowski" = "#cbbcdb"
  ), name = "Player") +
  scale_x_continuous(breaks = seq(2002, 2024, 2)) +
  geom_hline(yintercept = 0, size = 0.1) +
  facet_wrap(~metric) +
  labs(title = "Evolution of goals and assists per 90 minutes",
       x = "Season", y = "Value", caption = "Info: Fbref.com") +
  theme_minimal() +
  theme(legend.position = "right", 
        panel.grid.minor = element_blank(),
        plot.title = element_text(family = "Oswald", size = 40, hjust = 0.5),
        plot.background = element_rect(fill = "#f6f6f6"),
        plot.subtitle = element_text(hjust = 0.5),
        axis.title.x = element_text(family = "Oswald", size = 15),
        axis.title.y = element_text(family = "Oswald", size = 15))

ggsave('1.1.png', height = 4.5, width = 6.5)


#----------------------------------------------------------------------------

# Graph 2: Percentile of goals and assists per 90 minutes
Percentil <- 
  data5liga |>
  clean_names() |>
  filter(min_playing > 1000) |>
  select(season_end_year, player, min_playing, gls_per, ast_per) |> 
  group_by(season_end_year) |>
  mutate(across(c(gls_per, ast_per), ntile, 100,
                .names = "{.col}_centil")) |> 
  ungroup() |>
  mutate(highlighted_player = if_else(player %in%
                                        c("Cristiano Ronaldo",
                                          "Lionel Messi",
                                          "Erling Haaland",
                                          "Kylian Mbappé",
                                          "Robert Lewandowski"),
                                      T,
                                      F)) |>
  select(season_end_year, player, highlighted_player, 
         Goals = gls_per_centil, Assists = ast_per_centil)

Percentil |>
  pivot_longer(c(Goals, Assists), names_to = "metric", values_to = "value") |>
  ggplot(aes(x = season_end_year, y = value, group = season_end_year)) +
  geom_jitter(aes(alpha = highlighted_player, color = player)) +
  scale_color_manual(values = c("Lionel Messi" = "#fdd848",
                                "Cristiano Ronaldo" = "#aad59e",
                                "Erling Haaland" = "#9ab2d4",
                                "Kylian Mbappé" = "#f0743e",
                                "Robert Lewandowski" = "#cbbcdb"), name = "Player") +
  geom_hline(yintercept = 0, size = 0.1) +
  labs(title = "Percentile of goals and assists per 90 minutes",
       x = "Season", y = "Percentile", caption = "Info: Fbref.com") +
  facet_wrap(~metric, scales = "free") +
  scale_x_continuous(breaks = seq(2000,2024)) +
  scale_alpha_manual(values = c(0.01, 1)) +
  coord_flip() +
  guides(alpha = "none") +
  theme_minimal() +
  theme(legend.position = "right", 
        panel.grid.minor = element_blank(),
        plot.title = element_text(family = "Oswald", size = 40, hjust = 0.5),
        plot.background = element_rect(fill = "#f6f6f6"),
        plot.subtitle = element_text(hjust = 0.5),
        axis.title.x = element_text(family = "Oswald", size = 15),
        axis.title.y = element_text(family = "Oswald", size = 15))


ggsave('2.1.png', height = 4.5, width = 6.5)


#-----------------------------------------

# Graph 3: Expected goals and assists per 90 minutes each season
expected_data <- 
  data5liga |> 
  clean_names() |> 
  filter(season_end_year >= 2000,
         min_playing > 1000, 
         xg_per > 0 | xag_per > 0) |> 
  mutate(highlighted_player = if_else(player %in% c("Cristiano Ronaldo","Lionel Messi","Erling Haaland","Kylian Mbappé","Robert Lewandowski"), 
                                      T, 
                                      F), 
         label = if_else(player %in% c("Cristiano Ronaldo",
                                       "Lionel Messi",
                                       "Erling Haaland",
                                       "Kylian Mbappé",
                                       "Robert Lewandowski"), 
                         as.character(season_end_year), 
                         NA_character_))

expected_data |> 
  select(season_end_year, player, highlighted_player, label,
         Goals = xg_per, Assists = xag_per) |> 
  ggplot(aes(x = Assists, y = Goals)) + 
  geom_point(aes(alpha = highlighted_player, 
                 color = player)) +
  geom_text_repel(aes(label = str_sub(label, 3, 4))) + 
  scale_color_manual(values = c("Lionel Messi" = "#fdd848",
                                "Cristiano Ronaldo" = "#aad59e",
                                "Erling Haaland" = "#9ab2d4",
                                "Kylian Mbappé" = "#f0743e",
                                "Robert Lewandowski" = "#cbbcdb"),
                     name = "Player") +
  geom_hline(yintercept = 0, size = 0.1) +
  geom_vline(xintercept = 0, size = 0.1) +
  scale_alpha_manual(values = c(0.1, 1)) + 
  labs(title = "Expected goals and assists per 90 minutes each season",
       x = "Expected assists", y = "Expected goals", caption = "Info: Fbref.com") +
  guides(alpha = "none") + 
  theme_minimal() + 
  theme(legend.position = "right",
        panel.grid.minor = element_blank(),
        plot.title = element_text(family = "Oswald", size = 40, hjust = 0.5),
        plot.background = element_rect(fill = "#f6f6f6"),
        plot.subtitle = element_text(hjust = 0.5),
        axis.title.x = element_text(family = "Oswald", size = 15),
        axis.title.y = element_text(family = "Oswald", size = 15))

ggsave('3.1.png', height = 4.5, width = 6.5)


#-----------------------------------------------------------

# Graph 4: Expected goals and goals scored per 90 minutes each season
expected_data |> 
  select(season_end_year, player, highlighted_player, label,
         Goals = gls_per, `Expected goals` = xg_per) |> 
  ggplot(aes(x = `Expected goals`, y = Goals)) + 
  geom_point(aes(alpha = highlighted_player, 
                 color = player)) +
  geom_text_repel(aes(label = str_sub(label, 3, 4))) + 
  scale_color_manual(values = c("Lionel Messi" = "#fdd848",
                                "Cristiano Ronaldo" = "#aad59e",
                                "Erling Haaland" = "#9ab2d4",
                                "Kylian Mbappé" = "#f0743e",
                                "Robert Lewandowski" = "#cbbcdb"),
                     name = "Player") +
  geom_hline(yintercept = 0, size = 0.2) +
  geom_vline(xintercept = 0, size = 0.2) +
  geom_abline(slope = 1) +
  geom_text(x = 1, y = 1.4, 
            label = "Above the line, the most effective players", 
            size = 3, hjust = 1, vjust = 0.5) + 
  geom_curve(x = 1.01, y = 1.4, xend = 1.2, yend = 1.2, 
             size = 0.2, curvature = -0.25, arrow = arrow(length = unit(0.02, "npc"))) + 
  scale_alpha_manual(values = c(0.1, 1)) + 
  scale_x_continuous(limits = c(0, 1.5)) + 
  scale_y_continuous(limits = c(0, 1.5)) + 
  labs(title = "Expected goals and goals scored per 90 minutes each season",
       x = "Expected goals", y = "Goals", caption = "Info: Fbref.com") +
  guides(alpha = "none") + 
  theme_minimal() + 
  theme(legend.position = "right", 
        panel.grid.minor = element_blank(),
        plot.title = element_text(family = "Oswald", size = 40, hjust = 0.5),
        plot.background = element_rect(fill = "#f6f6f6"),
        plot.subtitle = element_text(hjust = 0.5),
        axis.title.x = element_text(family = "Oswald", size = 15),
        axis.title.y = element_text(family = "Oswald", size = 15))

ggsave('4.1.png', height = 4.5, width = 6.5)

