# Comparativa de 3 modelos — Satisfacción de clientes (Gimnasio)

Caso de negocio real: una cadena de gimnasios urbanos quiere anticipar qué clientes están insatisfechos para actuar antes de que se den de baja. La comparativa de 3 algoritmos revela que **el modelo más simple es el mejor** — y produce una regla de negocio que cabe en una servilleta.

---

## Contexto de negocio

La dirección observa un patrón de bajas pero no consigue articular qué diferencia a un cliente satisfecho de uno insatisfecho. Sin ese conocimiento, las acciones de retención son reactivas y genéricas. El objetivo es encontrar las variables que explican la satisfacción y traducirlas en reglas operativas automatizables.

## Objetivo

Comparar tres algoritmos de clasificación (Árbol de Decisión, Random Forest, XGBoost) sobre las variables operativas disponibles (Antigüedad, Asistencias, Horas pico, Gasto extra) y decidir, de forma justificada con métricas, cuál merece pasar a producción.

## Dataset

`gym_clientes.xlsx` — 300 clientes con `Antiguedad_Meses`, `Asistencias_Mes`, `Horas_Pico_Mes`, `Gasto_Mensual_Extra` (features), `Satisfecho` (target binario, 48% positivos) y `Abandono` (informativa, excluida para evitar data leakage).

## Técnicas aplicadas

- **Árbol de Decisión** (`max_depth=2`, elegido con validación cruzada) — modelo principal, analizado en profundidad
- **Random Forest** (100 estimadores) — comparativa de robustez
- **XGBoost** (200 estimadores, regularización) — comparativa con el estándar de boosting

Evaluación con accuracy, recall, AUC-ROC, matriz de confusión, feature importance y validación cruzada.

## Hallazgo clave

> La satisfacción se explica **en un 98,9% por una sola variable: `Asistencias_Mes`**. Un cliente que asiste más de 13 veces al mes durante al menos 3 meses tiene un **98% de probabilidad de estar satisfecho**.
>
> El Árbol de Decisión (depth=2) iguala en accuracy al Random Forest (90,0%) con un AUC de 0,909 — y produce una regla operativa que el director de operaciones puede aplicar mañana.

Este es el caso opuesto al [notebook de churn en telecomunicaciones](../02-churn-clientes/): allí la señal no existía (AUC 0,50-0,58); aquí es tan fuerte que el modelo más sencillo basta.

## Notebooks individuales

Para un análisis en profundidad de cada algoritmo, consultar los notebooks standalone:

- [Árbol de Decisión](../../01-arbol-decision/) — deep-dive: CV de profundidad, visualización del árbol, reglas de negocio
- [Random Forest](../../02-random-forest/) — deep-dive: OOB score, importancia Gini vs Permutación, curva de nº árboles
- [XGBoost](../../03-xgboost/) — deep-dive: grid search, impacto de hiperparámetros, cuándo usar vs no usar XGB

## Recomendaciones de negocio

1. **Sistema de alerta temprana** — clientes con <10 asistencias/mes durante 2 meses entran automáticamente en pipeline de retención.
2. **Onboarding intensivo los primeros 3 meses** — llevar al nuevo cliente por encima del umbral de 13 asistencias lo antes posible.
3. **KPI operativo diario** — `% clientes con ≥14 asistencias/mes` como proxy de satisfacción en tiempo real, más barato y objetivo que encuestas.
4. **No invertir en upselling como retención** — `Gasto_Mensual_Extra` tiene importancia nula en el modelo; el dinero está mejor empleado en facilitar que el cliente venga más.

## Librerías principales

- `pandas`, `matplotlib`, `seaborn`, `scikit-learn`, `xgboost`

