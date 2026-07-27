# Regresion Lineal Simple — Colesterol y habitos de salud

50 pacientes, una pregunta: el IMC predice el colesterol? Spoiler: no. Y documentar un R2 bajo es tan valioso como documentar uno alto.

---

## Contexto de negocio

Un centro de salud quiere usar el BMI (medicion instantanea) como predictor rapido del colesterol. Este notebook evalua si esa hipotesis es viable.

## Dataset

`Patient_Health_ALUMNOS.csv` — 50 pacientes con age, bmi, steps_per_day, sleep_hours, smoking, alcohol, heart_rate, cholesterol, health_risk.

## Tecnicas aplicadas

- Analisis de correlacion bivariada con p-valores (Pearson)
- Regresion lineal simple (BMI -> Cholesterol)
- Diagnostico de supuestos (Shapiro-Wilk, QQ-plot, residuos)
- Interpretacion profesional de un modelo con R2 bajo

## Hallazgo clave

> El BMI por si solo no es un predictor fiable del colesterol. Esto confirma que el colesterol depende de multiples factores y justifica usar modelos multivariable.

## Notebooks relacionados

- [Regresion Simple — Inmobiliaria](../01-inmobiliaria/) — caso donde la regresion SI funciona bien
- [Regresion Multiple](../../02-regresion-lineal-multiple/) — anadir variables para mejorar prediccion

## Como ejecutar

```bash
pip install pandas matplotlib seaborn scikit-learn scipy jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al indice](../../../../README.md)
