# Regresión Logística — Abandono de clientes (Gimnasio)

Aquí el modelo, además de predecir, explica. Con odds ratios, p-valores e intervalos de confianza se puede decir cuánto pesa cada variable en la decisión de darse de baja.

---

## Contexto de negocio

Una cadena de gimnasios urbanos tiene cerca de un 16% de bajas y quiere saber qué factores las explican y cuánto pesa cada uno. Los notebooks de árboles predecían la satisfacción; este va a por el otro lado del problema y busca una explicación estadística del abandono.

## Objetivo

Ajustar una regresión logística con `statsmodels` para tener p-valores, odds ratios e intervalos de confianza, revisar la multicolinealidad con VIF y quitar las variables que no son significativas.

## Dataset

`gym_clientes.xlsx`: 300 clientes y 4 variables operativas. Target: `Abandono` (binario y desbalanceado, 84/16).

## Técnicas aplicadas

- **statsmodels.Logit:** p-valores, pseudo R², intervalos de confianza
- **Odds Ratios:** cuantificación del impacto de cada variable
- **VIF (Variance Inflation Factor):** diagnóstico de multicolinealidad
- **Refinamiento del modelo:** eliminación de variables con p > 0.05 y VIF extremo
- Evaluación con AUC-ROC, matriz de confusión, classification report

## Hallazgo clave

Con las 4 variables la multicolinealidad era severa (VIF de hasta 62,77) y no había forma de separar el efecto de cada una. Dejando solo `Horas_Pico_Mes` y `Gasto_Mensual_Extra` los coeficientes se estabilizan, y las horas en franja pico salen como la señal más fiable de abandono.

Es lo mismo que decían los árboles de decisión, pero ahora con cifras que se pueden auditar.


## Librerías principales

- `pandas`, `matplotlib`, `seaborn`, `scikit-learn`, `statsmodels`

