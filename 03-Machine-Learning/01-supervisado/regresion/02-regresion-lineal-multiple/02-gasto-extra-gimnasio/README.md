# Regresión Lineal Múltiple — Gasto extra en gimnasio

El dataset del gimnasio aparece en varios proyectos del portfolio. En clasificación sirve para predecir abandono y satisfacción; aquí, para predecir cuánto gasta cada cliente en extras.

---

## Contexto de negocio

La cadena de gimnasios quiere ingresar más por socio sin subir las cuotas. El modelo busca qué hace que un cliente gaste en extras (suplementos, clases premium, merchandising).

## Dataset

Dataset del gimnasio (300 clientes). Target: `Gasto_Mensual_Extra`. Variables candidatas exploradas: Antiguedad_Meses, Asistencias_Mes, Horas_Pico_Mes. El modelo final usa solo `Antiguedad_Meses` y `Asistencias_Mes` (ver Hallazgo clave).

## Técnicas aplicadas

- statsmodels OLS con inferencia
- VIF para multicolinealidad
- sklearn LinearRegression
- Diagnóstico de supuestos

## Hallazgo clave

El gasto en extras depende de la antigüedad y de la asistencia mensual. Son las dos variables del modelo final, ambas con p < 0,001, coeficientes de 1,33 y 3,53 y un R² de 0,888 en train y 0,840 en test.

`Horas_Pico_Mes` se quedó fuera. Con las tres variables no era significativa (p = 0,940) y tenía una multicolinealidad fuerte con `Asistencias_Mes` (VIF ≈ 40 y 30, r ≈ 0,94). Al quitarla, el VIF de las otras dos baja a ≈ 1,00 y el modelo predice igual (MAE = 9,58 €, RMSE = 11,75 €), así que no aportaba nada propio.

Los clientes que van mucho y llevan tiempo son los mejores candidatos para ofrecerles servicios extra.

