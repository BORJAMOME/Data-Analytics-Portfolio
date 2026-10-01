# SVM — Reemplazo de baterías

Uso SVM para saber qué baterías hay que reemplazar a partir de su edad y de lo intensamente que se han usado.

---

## Contexto de negocio

Un fabricante quiere detectar las baterías que están a punto de necesitar recambio, para que fallen menos en manos del cliente. Es un caso de mantenimiento predictivo.

## Dataset

Sintético: **119 baterías**, con las variables:

- `Edad_Anos`
- `Intensidad_Uso`
- `Requiere_Reemplazo`: variable objetivo binaria.

## Técnicas aplicadas

- SVM con kernel **Lineal** y **Polinomial**.
- Comparación entre diferentes kernels.
- Estandarización de las variables con `StandardScaler`.
- Evaluación mediante **Accuracy, Recall y F1-score**.
- Visualización de las fronteras de decisión.
- Elección del modelo según cuántas baterías a reemplazar es capaz de detectar.

## Hallazgo clave

El SVM con kernel polinómico de grado 2 es el que mejor equilibra rendimiento y sencillez: un 91,7% de accuracy y un 96,2% de recall en las baterías que hay que cambiar. Detecta unas 96 de cada 100.

Con solo 36 baterías en el test, lo veo como una primera prueba que merece la pena validar con más datos, no como algo listo para producción.

