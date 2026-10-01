# Comparativa de 3 modelos — Predicción de churn (Telecomunicaciones)

Es el reverso del caso del gimnasio. Aquí ninguno de los tres algoritmos funciona, porque las variables disponibles no contienen la señal. Lo he dejado en el portfolio a propósito: saber cuándo no se puede construir un modelo también es parte del trabajo.

---

## Contexto de negocio

Una empresa de telecomunicaciones quiere predecir qué clientes se van a dar de baja. Solo tiene 4 variables demográficas y de facturación (edad, ingresos, antigüedad y gasto mensual), y la pregunta es si con eso algún modelo encuentra algo.

## Objetivo

Comparar tres algoritmos de clasificación con esas variables y ver si se puede construir un modelo de churn que sirva.

## Dataset

`customer churn.xlsx`: 1.234 clientes con `Edad`, `Ingresos`, `Antiguedad`, `GastoMensual` (features) y `Churn` (target binario, con solo un 9% de positivos, muy desbalanceado).

## Hallazgo clave

> Ningún modelo supera al azar: los tres se quedan con un AUC-ROC entre 0,50 y 0,58, y ninguna variable tiene una correlación con el target por encima de 0,07.
>
> El problema no está en los modelos sino en los datos. Con estas cuatro variables no hay forma de predecir quién se va.

Es lo contrario del [caso del gimnasio](../01-satisfaccion-gimnasio/): allí la señal era tan fuerte que bastaba un árbol simple, y aquí no hay nada que capturar.

## Librerías principales

- `pandas`, `matplotlib`, `seaborn`, `scikit-learn`, `xgboost`


