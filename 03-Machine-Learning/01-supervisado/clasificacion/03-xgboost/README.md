# XGBoost — Satisfacción de clientes (Gimnasio)

El algoritmo más potente de la familia de árboles confirma por tercera vez que la satisfacción depende de una sola variable. La lección más valiosa no es el modelo — es **cuándo no usarlo**.

---

## Contexto de negocio

Tras obtener resultados excelentes con un árbol simple y un Random Forest, se evalúa si XGBoost — referencia en competiciones y problemas industriales — puede extraer patrones no lineales que los modelos anteriores no capturan.

## Objetivo

Entrenar un XGBoost Classifier con grid search de hiperparámetros, analizar el impacto de cada parámetro en el rendimiento, y determinar si la complejidad de gradient boosting aporta valor en un problema con señal fuerte y lineal.

## Dataset

`dataset_didactico_machine_learning - ALUMNOS - copia.xlsx` — 300 clientes, 4 features operativas, target binario equilibrado (52/48).

## Técnicas aplicadas

- **XGBoost** con GridSearchCV (n_estimators × max_depth × learning_rate)
- Visualización del impacto de cada hiperparámetro
- Feature importance (gain)
- Curva ROC
- Evaluación con accuracy, recall, AUC-ROC y matriz de confusión

## Hallazgo clave

> XGBoost alcanza el **AUC más alto (0,922)** pero pierde en accuracy (88,3% vs 90,0%) y recall (86,2% vs 89,7%) frente al árbol simple. El boosting secuencial no mejora la predicción cuando la señal es simple y lineal.
>
> Convergencia de importancia: los 3 algoritmos (DT, RF, XGB) coinciden en que `Asistencias_Mes` domina.

## Modelos relacionados

- [Árbol de Decisión](../01-arbol-decision/) — modelo recomendado para despliegue
- [Random Forest](../02-random-forest/) — validación de robustez
- [Comparativa de los 3 modelos](../04-comparativa-modelos/01-gimnasio/) — recomendación final consolidada

## Librerías principales

- `pandas`, `matplotlib`, `seaborn`, `scikit-learn`, `xgboost`

## Cómo ejecutar

```bash
cd 03-Machine-Learning/01-supervisado/clasificacion/03-xgboost
pip install pandas matplotlib seaborn scikit-learn xgboost openpyxl jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al índice de Machine Learning](../../../../README.md)
