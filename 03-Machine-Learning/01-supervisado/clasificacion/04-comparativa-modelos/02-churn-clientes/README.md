# Comparativa de 3 modelos — Predicción de churn (Telecomunicaciones)

Caso complementario al del gimnasio: aquí la comparativa de 3 algoritmos revela que **ningún modelo funciona** — porque las variables disponibles no contienen la señal necesaria. Un resultado negativo igual de valioso que uno positivo.

---

## Contexto de negocio

Una empresa de telecomunicaciones quiere predecir qué clientes abandonarán. Con solo 4 variables demográficas y de facturación (Edad, Ingresos, Antigüedad, Gasto Mensual), se evalúa si algún modelo puede capturar patrones de churn.

## Objetivo

Comparar tres algoritmos de clasificación sobre las variables disponibles y determinar si es viable construir un modelo predictivo de churn con esta información.

## Dataset

`customer churn.xlsx` — 1.234 clientes con `Edad`, `Ingresos`, `Antiguedad`, `GastoMensual` (features) y `Churn` (target binario, 9% positivos — fuertemente desbalanceado).

## Hallazgo clave

> **Ningún modelo supera el azar.** AUC-ROC entre 0,50 y 0,58 para los 3 algoritmos. Todas las correlaciones entre features y target son <0,07.
>
> Esto NO es un fallo del modelo — es un fallo de los datos. Las variables disponibles simplemente no contienen información predictiva sobre el churn.

Este es el caso opuesto al [notebook del gimnasio](../01-gimnasio/): allí la señal era tan fuerte que bastaba un árbol simple; aquí no hay señal que capturar.

## Recomendaciones

1. **No desplegar ningún modelo** — un modelo que no supera el azar es peor que no tener modelo.
2. **Invertir en captura de datos** — variables de comportamiento (uso del servicio, llamadas a soporte, cambios de plan) probablemente contengan la señal que falta.
3. **Documentar el resultado negativo** — saber qué variables NO predicen el churn es información valiosa para dirigir la inversión en datos.

## Librerías principales

- `pandas`, `matplotlib`, `seaborn`, `scikit-learn`, `xgboost`

## Cómo ejecutar

```bash
cd 03-Machine-Learning/01-supervisado/clasificacion/04-comparativa-modelos/02-churn-clientes
pip install pandas matplotlib seaborn scikit-learn xgboost jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al índice de Machine Learning](../../../../../README.md)
