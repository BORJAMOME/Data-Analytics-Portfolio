# Regresión Lineal Múltiple — Predicción de ventas mediante inversión publicitaria

¿Cómo influye la inversión en publicidad sobre las ventas? En este proyecto se analiza el conocido dataset **Advertising** para identificar qué canales publicitarios generan un impacto real en las ventas y construir un modelo de regresión lineal múltiple capaz de realizar predicciones e interpretar el efecto de cada canal.

---

## Contexto de negocio

Una empresa desea optimizar su presupuesto de marketing y conocer qué canales publicitarios generan un mayor retorno sobre las ventas.

El objetivo es identificar qué inversiones aportan un efecto significativo y construir un modelo que permita estimar las ventas a partir del presupuesto destinado a cada canal.

---

## Dataset

**Advertising.csv**

Contiene información de **200 campañas publicitarias**, incluyendo la inversión realizada en:

- **TV**
- **Radio**
- **Newspaper**
- **Sales** (ventas obtenidas)

---

## Técnicas aplicadas

- Análisis exploratorio de datos (EDA)
- Estadística descriptiva
- Matriz de correlación de Pearson
- Regresión lineal simple
- Regresión lineal múltiple
- Selección de variables mediante significancia estadística (p-valores)
- Evaluación de multicolinealidad mediante VIF
- Evaluación del modelo (R², MAE, RMSE y MAPE)
- Validación con conjunto de entrenamiento y prueba
- Diagnóstico de los supuestos de la regresión

---

## Hallazgo principal

> La inversión en **Televisión** y **Radio** explica aproximadamente el **90 % de la variabilidad de las ventas**. La inversión en **Newspaper** no aporta información estadísticamente significativa una vez consideradas las otras dos variables, por lo que el modelo final utiliza únicamente **TV** y **Radio**, obteniendo un excelente equilibrio entre precisión e interpretabilidad.

---

## Resultados

- **Variables predictoras:** TV y Radio
- **R² (Train):** 0.8966
- **R² (Test):** 0.8945
- **MAE (Test):** 1.39 unidades de ventas
- **RMSE (Test):** 1.69 unidades de ventas
- **MAPE (Test):** 14.39 %

---

## Conclusiones

- La inversión en **Televisión** es el factor con mayor influencia sobre las ventas.
- **Radio** también aporta información significativa y mejora el poder predictivo del modelo.
- **Newspaper** no contribuye significativamente a explicar las ventas una vez consideradas TV y Radio.
- El modelo mantiene un rendimiento muy similar en entrenamiento y prueba, por lo que **no presenta evidencias de sobreajuste (overfitting)**.
- El modelo final constituye una herramienta útil para estimar ventas y apoyar la toma de decisiones sobre inversión publicitaria.

---


---

[Volver al indice](../../../../README.md)
