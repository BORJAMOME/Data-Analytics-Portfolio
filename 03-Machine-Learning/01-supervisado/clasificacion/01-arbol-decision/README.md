# Árbol de Decisión — Predicción de la satisfacción de clientes en una cadena de gimnasios

Un árbol de decisión de solo 2 niveles predice la satisfacción de los clientes de una cadena de gimnasios con un 90% de accuracy. Lo mejor es que sus dos reglas se pueden aplicar en el negocio tal cual.

---

## Contexto de negocio

La dirección quiere detectar a tiempo a los clientes que están descontentos, antes de que se den de baja.

Las encuestas llegan tarde, así que la idea es usar datos que el gimnasio ya tiene (antigüedad, asistencia, uso en horas punta y gasto en servicios extra) y sacar de ellos reglas que el equipo de operaciones entienda sin ayuda.

## Objetivo

Entrenar un árbol de decisión, elegir su profundidad con validación cruzada y convertirlo en unas pocas reglas de negocio fáciles de aplicar.

## Dataset

**gym_clientes.xlsx**

300 clientes con las siguientes variables:

**Variables predictoras**

- `Antiguedad_Meses`
- `Asistencias_Mes`
- `Horas_Pico_Mes`
- `Gasto_Mensual_Extra`

**Variable objetivo**

- `Satisfecho` (clasificación binaria)

**Importante:** `Abandono` se deja fuera del entrenamiento para evitar data leakage.

## Técnicas aplicadas

- Árbol de Decisión (`DecisionTreeClassifier`)
- Selección de la profundidad óptima mediante validación cruzada (5-fold)
- Visualización e interpretación del árbol
- Importancia de variables (Gini Importance)
- Evaluación mediante:
  - Accuracy
  - Recall
  - Matriz de confusión

## Hallazgo clave

> Casi todo lo predice la frecuencia de asistencia (98,9% de la importancia). Quien va más de 13 veces al mes sale casi siempre como satisfecho, y si además lleva más de 2,5 meses apuntado, el árbol acierta en 98 de 102 casos.

**Rendimiento del modelo**

- Accuracy: **90,0%**

## Lectura de negocio

La satisfacción depende sobre todo de lo a menudo que el cliente va al gimnasio, mucho más que de su antigüedad o de lo que gasta en extras.

Con eso el negocio puede:

- Marcar automáticamente a quien vaya 13 veces al mes o menos.
- Acompañar más de cerca a los clientes durante los primeros meses.
- Seguir la asistencia como un indicador que avisa antes que las encuestas.
- Aplicar las reglas con un simple `IF-ELSE`. No hace falta desplegar ningún modelo.

## Librerías principales

- `pandas`
- `matplotlib`
- `seaborn`
- `scikit-learn`


