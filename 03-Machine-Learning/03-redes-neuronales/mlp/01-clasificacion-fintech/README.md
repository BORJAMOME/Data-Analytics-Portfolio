# MLP — Evaluación de Crédito Fintech

## Contexto de negocio

Una fintech de microcréditos necesita automatizar la decisión de
aprobación/rechazo de solicitudes, reduciendo la latencia de 48h
a minutos y eliminando la inconsistencia entre analistas.

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
- Análisis de sensibilidad a outliers: MLP (6, 8) + RobustScaler tras eliminar los 2 registros más extremos
- Curvas ROC comparativas, matriz de correlación, matriz de confusión

## Hallazgo clave

El MLP gana en accuracy (87,5% vs 83,3%) pero la Regresión Logística obtiene mejor AUC-ROC
(0,943 vs 0,871). Con solo 120 registros y 3 variables, no hay evidencia suficiente de que la
complejidad del MLP aporte una ventaja real — en *credit scoring*, la Regresión Logística sigue
siendo el estándar regulatorio por su interpretabilidad, y aquí ni siquiera pierde en rendimiento.

