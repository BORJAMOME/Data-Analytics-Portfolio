# MLP — Evaluación de Crédito Fintech

## Contexto de negocio

Una fintech de microcréditos quiere automatizar la decisión de
aprobar o rechazar solicitudes: pasar de 48 horas a minutos y que
el resultado no dependa del analista al que le toque.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Tipo | `dataset_fintech.xlsx` |
| Registros | 120 solicitantes |
| Features | Ingresos_Mensuales, Score_Comportamiento, Deudas_Activas |
| Target | Aprobado (0/1) |

## Técnicas aplicadas

- MLP (8, 4) con StandardScaler
- Comparativa con Regresión Logística sobre el mismo split
- Sensibilidad a outliers: MLP (6, 8) con RobustScaler tras quitar los 2 registros más extremos
- Curvas ROC comparativas, matriz de correlación, matriz de confusión

## Hallazgo clave

El MLP gana en accuracy (87,5% frente a 83,3%), pero la regresión logística tiene mejor AUC-ROC
(0,943 frente a 0,871). Con 120 registros y 3 variables no hay pruebas de que la complejidad del
MLP compense. En *credit scoring* la regresión logística sigue siendo lo estándar ante el
regulador porque se puede explicar, y aquí ni siquiera rinde peor. Yo me quedaría con ella.


