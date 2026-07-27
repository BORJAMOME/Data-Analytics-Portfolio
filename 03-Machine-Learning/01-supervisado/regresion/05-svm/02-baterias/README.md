# SVR — Degradacion de baterias

Prediccion de capacidad restante con SVR: superficie de prediccion y zona de reemplazo para mantenimiento predictivo.

---

## Contexto de negocio

Un fabricante necesita predecir cuando sus baterias necesitaran reemplazo. Demasiado pronto es un coste innecesario; demasiado tarde causa fallos en campo.

## Dataset

Sintetico (120 baterias): Edad_Anos, Intensidad_Uso y Capacidad_Restante_Pct con degradacion sigmoidal.

## Tecnicas aplicadas

- SVR con 3 kernels + GridSearchCV
- Superficie de prediccion 2D (contour plot)
- Zona de reemplazo (capacidad < 30%) con visualizacion
- Comparativa con regresion lineal baseline

## Hallazgo clave

> SVR captura la degradacion no lineal con alta precision. La superficie de prediccion define zonas de reemplazo basadas en edad e intensidad — herramienta practica para mantenimiento preventivo.

## Notebooks relacionados

- [SVR — Gasto de clientes](../01-iphone/) — SVR en e-commerce
- [Regresion Lineal Simple](../../01-regresion-lineal-simple/) — el punto de partida

## Como ejecutar

```bash
pip install pandas numpy matplotlib scikit-learn jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al indice](../../../../README.md)
