# Regresión Lineal Múltiple — Gasto extra en gimnasio

El dataset transversal del portfolio: en clasificación predice abandono y satisfacción, aquí predice cuánto gasta cada cliente en extras.

---

## Contexto de negocio

La cadena de gimnasios quiere aumentar el revenue por socio sin subir cuotas. Este modelo identifica los drivers del gasto extra (suplementos, clases premium, merchandising).

## Dataset

Dataset del gimnasio (300 clientes). Target: `Gasto_Mensual_Extra`. Features: Antiguedad_Meses, Asistencias_Mes, Horas_Pico_Mes.

## Técnicas aplicadas

- statsmodels OLS con inferencia
- VIF para multicolinealidad
- sklearn LinearRegression
- Diagnóstico de supuestos

## Hallazgo clave

El gasto extra depende de la combinación de antigüedad, frecuencia y uso en horas pico. Los clientes con alta asistencia son los mejores candidatos para upselling.

## Notebooks relacionados

- [Regresión Logística — Abandono](../../../clasificacion/05-regresion-logistica/01-satisfaccion-gimnasio/) — mismo dataset, ángulo de clasificación
- [Regresión Múltiple — Publicidad](../01-ventas-publicidad/) — mismo algoritmo, dataset de marketing



[Volver al índice de Machine Learning](../../../../README.md)
