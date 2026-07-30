# Regresión Logística — Abandono de clientes (Gimnasio)

El modelo que no solo predice, sino que explica: odds ratios, p-valores e intervalos de confianza para cuantificar exactamente cuánto pesa cada variable en la decisión de abandonar.

---

## Contexto de negocio

Una cadena de gimnasios urbanos observa un ~16% de abandono y necesita entender **qué factores lo causan y cuánto pesa cada uno**. A diferencia de los notebooks de árboles (que predicen satisfacción), aquí se ataca el problema complementario: **explicación estadística del abandono**.

## Objetivo

Construir un modelo de Regresión Logística con `statsmodels` para obtener inferencia estadística completa (p-valores, odds ratios, intervalos de confianza), diagnosticar multicolinealidad con VIF y refinar el modelo eliminando variables no significativas.

## Dataset

`gym_clientes.xlsx` — 300 clientes, 4 features operativas. Target: `Abandono` (binario, **desbalanceado 84/16**).

## Técnicas aplicadas

- **statsmodels.Logit:** p-valores, pseudo R², intervalos de confianza
- **Odds Ratios:** cuantificación del impacto de cada variable
- **VIF (Variance Inflation Factor):** diagnóstico de multicolinealidad
- **Refinamiento del modelo:** eliminación de variables con p > 0.05 y VIF extremo
- Evaluación con AUC-ROC, matriz de confusión, classification report

## Hallazgo clave

El modelo completo con 4 variables revelaba una **multicolinealidad severa** (VIF hasta 62.77), impidiendo separar los efectos individuales. El modelo refinado con `Horas_Pico_Mes` y `Gasto_Mensual_Extra` estabiliza los coeficientes y confirma que las horas de uso en franja pico son la señal más fiable de abandono.

La regresión logística traduce el mismo hallazgo que los árboles de decisión en un **lenguaje cuantitativo auditable**.


## Librerías principales

- `pandas`, `matplotlib`, `seaborn`, `scikit-learn`, `statsmodels`

## Cómo ejecutar

```bash
cd 03-Machine-Learning/01-supervisado/clasificacion/regresion-logistica/01-gimnasio
pip install pandas matplotlib seaborn scikit-learn statsmodels openpyxl jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al índice de Machine Learning](../../../../README.md)
