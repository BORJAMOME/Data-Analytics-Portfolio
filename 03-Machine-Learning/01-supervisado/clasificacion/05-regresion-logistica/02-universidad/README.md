# Regresion Logistica — Admision universitaria

Frontera de decision visible: con solo 2 variables se puede graficar exactamente donde el modelo cambia de prediccion — algo imposible en problemas con mas dimensiones.

---

## Contexto de negocio

Un departamento de admisiones universitarias recibe miles de solicitudes cada ciclo. El objetivo es construir un sistema de scoring automatizado que estime la probabilidad de admision a partir de las horas de estudio y la nota de examen de acceso.

## Objetivo

Entrenar una Regresion Logistica sobre 2 variables, visualizar la frontera de decision y el mapa de probabilidad en 2D, y analizar odds ratios con `statsmodels`.

## Dataset

`admitidos.xlsx` — 1.140 candidatos con `Horas_estudio` (0-30), `Nota_examen` (35-103) y `Admitido` (binario, **desbalanceado 77/23**).

## Tecnicas aplicadas

- **statsmodels.Logit:** p-valores, odds ratios con intervalos de confianza
- **sklearn.LogisticRegression:** modelo de prediccion
- **Frontera de decision en 2D:** visualizacion de la linea de separacion
- **Mapa de probabilidad continua:** gradiente de color con isolineas
- **Analisis de threshold:** optimizacion de Precision/Recall/F1
- Evaluacion con AUC-ROC, matriz de confusion, classification report

## Hallazgo clave

> La admision depende de una **combinacion lineal** de horas y nota: un estudiante con menos horas puede ser admitido si su nota compensa, y viceversa. La frontera de decision y el mapa de probabilidad muestran este trade-off de forma visual.

## Valor pedagogico

Este es el unico notebook del portfolio donde se puede **ver la frontera de decision** directamente. Con 2 variables, el espacio de entrada es un plano y la linea de separacion es visible. En problemas con mas variables (como el [gimnasio](../01-gimnasio/) con 4 features), la frontera existe en un hiperespacio que no se puede graficar.

## Notebooks relacionados

- [Regresion Logistica — Gimnasio](../01-gimnasio/) — caso con 4 variables, VIF, multicolinealidad y odds ratios
- [Arbol de Decision](../../01-arbol-decision/) — fronteras no lineales sobre el dataset del gimnasio

## Librerias principales

- `pandas`, `matplotlib`, `seaborn`, `scikit-learn`, `statsmodels`

## Como ejecutar

```bash
cd 03-Machine-Learning/01-supervisado/clasificacion/regresion-logistica/02-universidad
pip install pandas matplotlib seaborn scikit-learn statsmodels openpyxl jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al indice de Machine Learning](../../../../README.md)
