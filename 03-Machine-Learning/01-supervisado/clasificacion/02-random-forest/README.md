# Random Forest — Satisfacción de clientes (Gimnasio)

100 árboles entrenados sobre submuestras aleatorias confirman exactamente el mismo hallazgo que un árbol simple de 2 niveles — la satisfacción depende de la frecuencia de uso. El valor del Random Forest aquí no es mejorar la predicción, sino **validar la robustez** del modelo simple.

---

## Contexto de negocio

La dirección de una cadena de gimnasios quiere predecir la satisfacción de sus clientes usando datos operativos. Tras entrenar un árbol de decisión simple con resultados excelentes, se evalúa si un ensemble de 100 árboles puede capturar patrones adicionales.

## Objetivo

Entrenar un Random Forest Classifier, analizar importancia de variables con dos métodos (Gini y Permutación), evaluar el OOB score, y determinar si la complejidad del ensemble aporta beneficio real.

## Dataset

`gym_clientes.xlsx` — 300 clientes, 4 features operativas, target binario equilibrado (52/48).

## Técnicas aplicadas

- **Random Forest** (100 estimadores, `random_state=42`)
- Curva de validación: nº de árboles vs accuracy
- Importancia Gini vs Importancia por Permutación
- OOB Score (validación interna del ensemble)
- Evaluación con accuracy, recall, AUC-ROC y matriz de confusión

## Hallazgo clave

> Random Forest logra **90,0% accuracy** y **AUC 0,917** — idéntica accuracy y +0,8 pp de AUC sobre el árbol simple. Ambos métodos de importancia confirman que `Asistencias_Mes` es la variable dominante.
>
> El OOB score (~89%) es consistente con el test accuracy, señal de que no hay sobreajuste.

## Modelos relacionados

- [Árbol de Decisión](../01-arbol-decision/) — modelo simple que el RF valida
- [XGBoost](../03-xgboost/) — tercera confirmación del mismo hallazgo
- [Comparativa de los 3 modelos](../04-comparativa-modelos/01-gimnasio/) — recomendación final consolidada

## Librerías principales

- `pandas`, `matplotlib`, `seaborn`, `scikit-learn`

## Cómo ejecutar

```bash
cd 03-Machine-Learning/01-supervisado/clasificacion/02-random-forest
pip install pandas matplotlib seaborn scikit-learn openpyxl jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al índice de Machine Learning](../../../../README.md)
