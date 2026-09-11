# Regresión Lineal Múltiple — Gasto extra en gimnasio

El dataset transversal del portfolio: en clasificación predice abandono y satisfacción, aquí predice cuánto gasta cada cliente en extras.

---

## Contexto de negocio

La cadena de gimnasios quiere aumentar el revenue por socio sin subir cuotas. Este modelo identifica los drivers del gasto extra (suplementos, clases premium, merchandising).

## Dataset

Dataset del gimnasio (300 clientes). Target: `Gasto_Mensual_Extra`. Variables candidatas exploradas: Antiguedad_Meses, Asistencias_Mes, Horas_Pico_Mes. El modelo final usa solo `Antiguedad_Meses` y `Asistencias_Mes` (ver Hallazgo clave).

## Técnicas aplicadas

- statsmodels OLS con inferencia
- VIF para multicolinealidad
- sklearn LinearRegression
- Diagnóstico de supuestos

## Hallazgo clave

El gasto extra está impulsado por la **antigüedad** y la **asistencia mensual**, las dos variables del modelo final (ambas con p < 0.001 en el modelo OLS; coeficientes 1.33 y 3.53 respectivamente; R² = 0.888 en train, R² = 0.840 en test). `Horas_Pico_Mes` se excluyó del modelo: en un ajuste previo con las tres variables no resultó significativa (p = 0.940) y presentaba multicolinealidad severa con `Asistencias_Mes` (VIF ≈ 40 y 30; r ≈ 0.94 entre ambas). Tras eliminarla, el VIF de las dos variables restantes cae a ≈ 1.00 y el poder predictivo se mantiene intacto (MAE = 9.58 €, RMSE = 11.75 €), confirmando que no aportaba información independiente. Los clientes con alta asistencia y antigüedad son los mejores candidatos para upselling.

