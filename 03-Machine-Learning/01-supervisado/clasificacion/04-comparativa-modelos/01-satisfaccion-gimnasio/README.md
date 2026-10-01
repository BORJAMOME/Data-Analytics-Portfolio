# Comparativa de 3 modelos — Satisfacción de clientes (Gimnasio)

Una cadena de gimnasios urbanos quiere saber qué clientes están descontentos para actuar antes de que se den de baja. Comparo tres algoritmos y gana el más simple, que además deja una regla de negocio que cabe en una servilleta.

---

## Contexto de negocio

La dirección ve que hay bajas, pero no sabe qué distingue a un cliente contento de uno descontento. Sin eso, la retención llega tarde y es igual para todos. Se trata de encontrar qué variables explican la satisfacción y convertirlas en reglas que se puedan automatizar.

## Objetivo

Comparar tres algoritmos de clasificación (árbol de decisión, Random Forest y XGBoost) con las variables que ya tiene el gimnasio (antigüedad, asistencias, horas pico y gasto extra) y decidir, con métricas, cuál pondría en producción.

## Dataset

`gym_clientes.xlsx`: 300 clientes con `Antiguedad_Meses`, `Asistencias_Mes`, `Horas_Pico_Mes`, `Gasto_Mensual_Extra` (features), `Satisfecho` (target binario, 48% positivos) y `Abandono` (informativa, excluida para evitar data leakage).

## Técnicas aplicadas

- **Árbol de decisión** (`max_depth=2`, elegido con validación cruzada). Es el modelo principal y el que más analizo.
- **Random Forest** (100 estimadores), para ver si un ensemble es más robusto.
- **XGBoost** (con regularización), como referencia de boosting.

Evaluación con accuracy, recall, AUC-ROC, matriz de confusión, feature importance y validación cruzada.

## Hallazgo clave

> Una sola variable, `Asistencias_Mes`, se lleva el 98,9% de la importancia. Un cliente que va más de 13 veces al mes y lleva al menos 3 meses apuntado está satisfecho en el 98% de los casos.
>
> El árbol de dos niveles empata en accuracy con el Random Forest (90,0%), con un AUC de 0,909, y deja una regla que el director de operaciones puede aplicar al día siguiente. XGBoost acierta un cliente más de 60, una diferencia que no me parece suficiente para cambiar de modelo.

Es justo lo contrario del [caso de churn en telecomunicaciones](../02-churn-clientes/). Allí no había señal (AUC entre 0,50 y 0,58); aquí la hay tan fuerte que basta con el modelo más sencillo.

## Notebooks individuales

Cada algoritmo tiene su propio notebook con más detalle:

- [Árbol de decisión](../../01-arbol-decision/): validación cruzada de la profundidad, el árbol dibujado y las reglas de negocio.
- [Random Forest](../../02-random-forest/): OOB score, importancia Gini frente a permutación y curva según el número de árboles.
- [XGBoost](../../03-xgboost/): grid search, efecto de cada hiperparámetro y cuándo compensa usarlo.

## Recomendaciones de negocio

1. **Alerta temprana.** Quien vaya menos de 10 veces al mes durante 2 meses seguidos entra automáticamente en el circuito de retención.
2. **Onboarding intensivo los tres primeros meses**, para que el cliente nuevo pase de 13 visitas al mes cuanto antes.
3. **Un KPI diario:** el porcentaje de clientes con 14 visitas al mes o más. Mide la satisfacción al momento y sale más barato y más objetivo que una encuesta.
4. **No usar la venta de extras para retener.** `Gasto_Mensual_Extra` no pesa nada en el árbol. Ese dinero rinde más si se dedica a que el cliente venga más.

## Librerías principales

- `pandas`, `matplotlib`, `seaborn`, `scikit-learn`, `xgboost`

