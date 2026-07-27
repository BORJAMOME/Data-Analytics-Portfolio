# Regresion Lineal Simple — Colesterol y habitos de salud

50 pacientes, una pregunta: el IMC predice el colesterol? Con R2 = 0.97, la respuesta es contundente en esta muestra. La clave esta en entender por que: datos sinteticos con correlaciones fuertes producen modelos perfectos que no necesariamente generalizan.

---

## Contexto de negocio

Un centro de salud quiere usar el BMI (medicion instantanea) como predictor rapido del colesterol. Este notebook evalua si esa hipotesis es viable usando datos de 50 pacientes.

## Dataset

`patient_health.csv` — 50 pacientes con age, bmi, steps_per_day, sleep_hours, smoking, alcohol, heart_rate, cholesterol, health_risk.

## Tecnicas aplicadas

- Analisis de correlacion bivariada con p-valores (Pearson)
- Regresion lineal simple (BMI -> Cholesterol)
- Diagnostico de supuestos (Shapiro-Wilk, QQ-plot, residuos)
- Interpretacion critica de un modelo con R2 alto en datos sinteticos

## Hallazgo clave

> El modelo alcanza R2 = 0.9762 en test — el BMI explica casi toda la varianza del colesterol en esta muestra. Sin embargo, la correlacion es artificialmente fuerte (datos sinteticos). En datos reales, el colesterol depende de multiples factores y un modelo univariable no seria suficiente.

## Notebooks relacionados

- [Regresion Simple — Inmobiliaria](../01-inmobiliaria/) — otro caso donde la regresion simple funciona bien
- [Regresion Multiple](../../02-regresion-lineal-multiple/) — anadir variables para mejorar prediccion

## Como ejecutar

```bash
pip install pandas matplotlib seaborn scikit-learn scipy jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al indice](../../../../README.md)
