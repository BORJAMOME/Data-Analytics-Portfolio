# Regresion Lineal Multiple — Gasto extra en gimnasio

El dataset transversal del portfolio: en clasificacion predice abandono y satisfaccion, aqui predice cuanto gasta cada cliente en extras.

---

## Contexto de negocio

La cadena de gimnasios quiere aumentar el revenue por socio sin subir cuotas. Este modelo identifica los drivers del gasto extra (suplementos, clases premium, merchandising).

## Dataset

Dataset del gimnasio (300 clientes). Target: `Gasto_Mensual_Extra`. Features: Antiguedad_Meses, Asistencias_Mes, Horas_Pico_Mes.

## Tecnicas aplicadas

- statsmodels OLS con inferencia
- VIF para multicolinealidad
- sklearn LinearRegression
- Diagnostico de supuestos

## Hallazgo clave

> El gasto extra depende de la combinacion de antiguedad, frecuencia y uso en horas pico. Los clientes con alta asistencia son los mejores candidatos para upselling.

## Notebooks relacionados

- [Regresion Logistica — Abandono](../../../clasificacion/05-regresion-logistica/01-gimnasio/) — mismo dataset, angulo de clasificacion
- [Regresion Multiple — Publicidad](../01-publicidad/) — mismo algoritmo, dataset de marketing

## Como ejecutar

```bash
pip install pandas matplotlib seaborn scikit-learn statsmodels scipy openpyxl jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al indice](../../../../README.md)
