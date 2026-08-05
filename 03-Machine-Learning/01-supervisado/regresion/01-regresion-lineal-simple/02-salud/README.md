# Regresión Lineal Simple — Predicción del colesterol

¿Es posible estimar el nivel de colesterol de un paciente únicamente a partir de su Índice de Masa Corporal (BMI)? En este proyecto se analiza esta hipótesis mediante un modelo de regresión lineal simple entrenado con datos de 50 pacientes.

El modelo consigue explicar aproximadamente el **97 % de la variabilidad del colesterol** utilizando únicamente el BMI. Aunque se evaluaron modelos más complejos, el modelo simple fue finalmente seleccionado por ofrecer el mejor equilibrio entre **precisión**, **interpretabilidad** y **robustez**.

---

## Contexto de negocio

Un centro de salud desea disponer de una herramienta sencilla que permita realizar una estimación rápida del colesterol de un paciente a partir de una medición fácilmente obtenible como el **Índice de Masa Corporal (BMI)**.

El objetivo es comprobar si esta variable, por sí sola, proporciona suficiente capacidad predictiva para apoyar la toma de decisiones clínicas.

---

## Dataset

**patient_health.csv**

Contiene información de **50 pacientes**, incluyendo las siguientes variables:

- Edad (`age`)
- Índice de Masa Corporal (`bmi`)
- Pasos diarios (`steps_per_day`)
- Horas de sueño (`sleep_hours`)
- Hábito de fumar (`smoking`)
- Consumo semanal de alcohol (`alcohol_units_per_week`)
- Frecuencia cardíaca (`heart_rate`)
- Colesterol (`cholesterol`)
- Nivel de riesgo (`health_risk`)

---

## Técnicas aplicadas

- Análisis exploratorio de datos (EDA)
- Estadística descriptiva
- Análisis de correlación de Pearson
- Regresión lineal simple
- Comparación con modelos de regresión múltiple
- Evaluación de multicolinealidad mediante VIF
- Evaluación del modelo (R², MAE, RMSE y MAPE)
- Validación con conjunto de entrenamiento y prueba
- Diagnóstico de los supuestos de la regresión

---

## Hallazgo principal

El modelo de regresión lineal simple basado únicamente en el **BMI** obtiene un **R² ≈ 0.97**, explicando la mayor parte de la variabilidad del colesterol. Aunque los modelos múltiples alcanzan un R² ligeramente superior, presentan problemas graves de multicolinealidad. Por ello, se selecciona el modelo simple como solución final por ser más estable, interpretable y suficientemente preciso.

---

## Resultados

- **Variable predictora:** BMI
- **R² (Train):** 0.9698
- **R² (Test):** 0.9814
- **MAE (Test):** 4.84 unidades de colesterol
- **RMSE (Test):** 5.82 unidades de colesterol
- **MAPE (Test):** 2.17 %

---

## Conclusiones

- El BMI es un predictor muy sólido del colesterol en este conjunto de datos.
- El modelo generaliza correctamente y no presenta evidencias de sobreajuste.
- Los modelos múltiples mejoran ligeramente la precisión, pero introducen problemas importantes de multicolinealidad.
- En este caso, un modelo sencillo ofrece una excelente capacidad predictiva y una interpretación mucho más clara.



[← Volver al índice](../../../../README.md)
