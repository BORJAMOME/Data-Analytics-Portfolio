# Regresión Lineal Simple — Predicción del colesterol

¿Se puede estimar el colesterol de un paciente solo con su índice de masa corporal (BMI)? Lo pruebo con una regresión lineal simple sobre 50 pacientes.

El BMI solo explica cerca del 97 % de la variación del colesterol. Probé modelos más complejos, pero me quedo con el simple porque es igual de preciso, se entiende mejor y es más estable. Eso sí, un resultado así en datos de salud es demasiado bueno para ser real, y lo comento más abajo.

---

## Contexto de negocio

Un centro de salud quiere una herramienta sencilla para estimar rápido el colesterol de un paciente a partir de algo tan fácil de medir como el índice de masa corporal (BMI).

La pregunta es si esa variable, sola, predice lo bastante bien como para ayudar en decisiones clínicas.

---

## Dataset

**patient_health.csv**

50 pacientes con estas variables:

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

La regresión simple con el BMI llega a un R² de 0,97. Los modelos múltiples suben un poco más, pero tienen una multicolinealidad muy grave, así que me quedo con el simple: es más estable, se interpreta mejor y ya es preciso de sobra.

---

## Resultados

- **Variable predictora:** BMI
- **R² (train):** 0,9698
- **R² (test):** 0,9814
- **MAE (test):** 4,84 unidades de colesterol
- **RMSE (test):** 5,82 unidades de colesterol
- **MAPE (test):** 2,17 %

---

## Conclusiones

- En estos datos, el BMI predice muy bien el colesterol.
- El modelo generaliza bien y no hay señales de sobreajuste.
- Los modelos múltiples ganan un poco de precisión a cambio de una multicolinealidad seria.
- Aquí un modelo sencillo predice igual de bien y se explica mucho mejor.
- **Pero no me fiaría de estas cifras fuera del ejercicio.** Todas las variables se correlacionan entre sí por encima de 0,94, algo que no pasa con pacientes reales. Tiene toda la pinta de ser un dataset sintético, y con datos clínicos reales el BMI explicaría bastante menos.


