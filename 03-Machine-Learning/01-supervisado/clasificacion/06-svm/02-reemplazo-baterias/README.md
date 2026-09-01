# SVM — Reemplazo de baterías

Clasificación de baterías mediante **Support Vector Machines (SVM)** para identificar cuáles necesitan reemplazo a partir de su edad e intensidad de uso.

---

## Contexto de negocio

Un fabricante necesita detectar qué baterías están próximas a necesitar reemplazo. El objetivo es minimizar los fallos en campo mediante un modelo de **mantenimiento predictivo**.

## Dataset

Sintético: **119 baterías**, con las variables:

- `Edad_Anos`
- `Intensidad_Uso`
- `Requiere_Reemplazo` — variable objetivo binaria.

## Técnicas aplicadas

- SVM con kernel **Lineal** y **Polinomial**.
- Comparación entre diferentes kernels.
- Estandarización de las variables con `StandardScaler`.
- Evaluación mediante **Accuracy, Recall y F1-score**.
- Visualización de las fronteras de decisión.
- Selección del modelo según su capacidad para detectar baterías que requieren reemplazo.

## Hallazgo clave

El **SVM con kernel polinómico de grado 2** obtiene el mejor equilibrio entre rendimiento y complejidad, alcanzando aproximadamente un **91,7% de accuracy** y un **96,2% de recall** para las baterías que necesitan reemplazo.

Esto significa que el modelo consigue detectar aproximadamente **96 de cada 100 baterías que realmente necesitan ser sustituidas**, por lo que puede ser una herramienta útil como apoyo al mantenimiento preventivo.

