# Regresion Lineal Simple — Datos de gimnasio

Asistencias al mes, horas pico, antiguedad... cual de estas variables predice mejor el gasto extra de un cliente de gimnasio? El modelo simple con asistencias alcanza R2 = 0.68, pero la historia no termina ahi.

---

## Contexto de negocio

Una cadena de gimnasios quiere entender que factores influyen en el gasto mensual extra de sus clientes (tienda, cafeteria, servicios adicionales). Identificar el mejor predictor permite personalizar ofertas y maximizar el revenue por cliente.

## Objetivo

Construir modelos de regresion lineal simple y multiple para predecir `Gasto_Mensual_Extra`, comparar su capacidad explicativa (R2) y determinar cuantas variables son necesarias para una prediccion util.

## Dataset

`gym_clientes.xlsx` — 300 clientes con Antiguedad_Meses, Asistencias_Mes, Hora_Pico_Mes y Gasto_Mensual_Extra.

## Tecnicas aplicadas

- Analisis exploratorio con scatterplots bivariados
- Matriz de correlacion con p-valores
- Regresion lineal simple (OLS) con Asistencias_Mes
- Regresion multiple progresiva (2 y 3 variables)
- Diagnostico de colinealidad
- Comparativa de R2 entre modelos

## Hallazgo clave

> El modelo simple con `Asistencias_Mes` explica el 67,9% de la varianza (R2 = 0.679). Anadir `Hora_Pico_Mes` sube a R2 = 0.796 y con las 3 variables se alcanza R2 = 0.877. La ganancia de cada variable adicional es significativa — a diferencia de otros casos del portfolio, aqui la regresion multiple SI aporta valor real.

## Notebooks relacionados

- [Regresion Simple — Inmobiliaria](../01-inmobiliaria/) — caso donde una sola variable es suficiente
- [Regresion Simple — Salud](../02-salud/) — caso con R2 artificialmente alto (datos sinteticos)
- [Regresion Multiple — Gimnasio](../../02-regresion-lineal-multiple/02-gimnasio/) — el mismo dataset con enfoque multiple desde el inicio

## Como ejecutar

```bash
pip install pandas matplotlib seaborn statsmodels openpyxl jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al indice](../../../../README.md)
