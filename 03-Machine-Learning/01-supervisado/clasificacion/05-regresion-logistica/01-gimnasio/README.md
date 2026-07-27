# Regresion Logistica — Abandono de clientes (Gimnasio)

El modelo que no solo predice, sino que explica: odds ratios, p-valores e intervalos de confianza para cuantificar exactamente cuanto pesa cada variable en la decision de abandonar.

---

## Contexto de negocio

Una cadena de gimnasios urbanos observa un ~16% de abandono y necesita entender **que factores lo causan y cuanto pesa cada uno**. A diferencia de los notebooks de arboles (que predicen satisfaccion), aqui se ataca el problema complementario: **explicacion estadistica del abandono**.

## Objetivo

Construir un modelo de Regresion Logistica con `statsmodels` (inferencia estadistica) y `sklearn` (prediccion), analizar odds ratios con intervalos de confianza, diagnosticar multicolinealidad con VIF, y optimizar el threshold de decision.

## Dataset

`gym_clientes.xlsx` — 300 clientes, 4 features operativas. Target: `Abandono` (binario, **desbalanceado 84/16**).

## Tecnicas aplicadas

- **statsmodels.Logit:** p-valores, pseudo R², intervalos de confianza
- **Odds Ratios:** cuantificacion del impacto de cada variable
- **VIF (Variance Inflation Factor):** diagnostico de multicolinealidad
- **sklearn.LogisticRegression:** modelo de produccion
- **Analisis de threshold:** optimizacion de Precision/Recall/F1
- Evaluacion con AUC-ROC, matriz de confusion, classification report

## Hallazgo clave

> Cada asistencia mensual adicional **reduce las odds de abandono un ~35%**. Este no es un patron vago — es un coeficiente estadisticamente significativo con intervalo de confianza acotado. AUC ~0,97.
>
> La regresion logistica traduce el mismo hallazgo que los arboles de decision en un **lenguaje cuantitativo auditable**.

## Diferencia con los notebooks de arboles

Los notebooks de [Arbol de Decision](../../01-arbol-decision/), [Random Forest](../../02-random-forest/) y [XGBoost](../../03-xgboost/) usan `Satisfecho` como target y dan reglas operativas. Este notebook usa `Abandono` como target y da coeficientes estadisticos con p-valores — el complemento que necesita un CFO para justificar inversiones en retencion.

## Notebooks relacionados

- [Regresion Logistica — Admision universitaria](../02-universidad/) — caso con 2 variables y frontera de decision visualizable
- [Comparativa de 3 modelos — Gimnasio](../../04-comparativa-modelos/01-gimnasio/) — prediccion de satisfaccion con DT, RF y XGB

## Librerias principales

- `pandas`, `matplotlib`, `seaborn`, `scikit-learn`, `statsmodels`

## Como ejecutar

```bash
cd 03-Machine-Learning/01-supervisado/clasificacion/regresion-logistica/01-gimnasio
pip install pandas matplotlib seaborn scikit-learn statsmodels openpyxl jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al indice de Machine Learning](../../../../README.md)
