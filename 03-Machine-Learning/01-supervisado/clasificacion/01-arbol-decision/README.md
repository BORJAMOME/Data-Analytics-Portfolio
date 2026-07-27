# Árbol de Decisión — Satisfacción de clientes (Gimnasio)

Un árbol de decisión de 2 niveles predice la satisfacción de clientes de una cadena de gimnasios con un 90% de accuracy — y produce una regla de negocio que cabe en una servilleta.

---

## Contexto de negocio

La dirección quiere anticipar qué clientes están insatisfechos para actuar antes de que se den de baja. Con los datos operativos disponibles (asistencias, horas pico, gasto extra), el objetivo es encontrar reglas interpretables que el equipo de operaciones pueda aplicar directamente.

## Objetivo

Entrenar un Árbol de Decisión Classifier con profundidad óptima (seleccionada por validación cruzada) sobre variables operativas y traducir el modelo en reglas de negocio accionables.

## Dataset

`dataset_didactico_machine_learning - ALUMNOS - copia.xlsx` — 300 clientes con `Antiguedad_Meses`, `Asistencias_Mes`, `Horas_Pico_Mes`, `Gasto_Mensual_Extra` (features), `Satisfecho` (target binario, 48% positivos) y `Abandono` (excluida para evitar data leakage).

## Técnicas aplicadas

- **Árbol de Decisión** (`max_depth=2`, elegido con CV 5-fold)
- Validación cruzada para selección de profundidad
- Visualización del árbol con reglas de decisión
- Feature importance
- Evaluación con accuracy, recall, AUC-ROC y matriz de confusión

## Hallazgo clave

> `Asistencias_Mes` concentra el **98,9% de la importancia** del modelo. Un cliente que asiste más de 13 veces al mes durante al menos 3 meses tiene un **98% de probabilidad de estar satisfecho**.
>
> Accuracy: 90,0% | AUC-ROC: 0,909

## Modelos relacionados

- [Random Forest](../02-random-forest/) — valida el hallazgo con 100 árboles independientes
- [XGBoost](../03-xgboost/) — confirma por tercera vez la misma señal
- [Comparativa de los 3 modelos](../04-comparativa-modelos/01-gimnasio/) — recomendación final consolidada

## Librerías principales

- `pandas`, `matplotlib`, `seaborn`, `scikit-learn`

## Cómo ejecutar

```bash
cd 03-Machine-Learning/01-supervisado/clasificacion/01-arbol-decision
pip install pandas matplotlib seaborn scikit-learn openpyxl jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al índice de Machine Learning](../../../../README.md)
