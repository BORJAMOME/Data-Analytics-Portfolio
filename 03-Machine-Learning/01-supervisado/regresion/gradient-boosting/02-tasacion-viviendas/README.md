# Gradient Boosting — Tasación automatizada de viviendas

Sistema de tasación automatizada para una inmobiliaria. Optimización de hiperparámetros para maximizar la precisión.

---

## Dataset

`Datos_Tasacion_Viviendas_Gradient_Boosting_regressor.xlsx`.

## Técnica aplicada

`GradientBoostingRegressor` con `GridSearchCV` sobre `n_estimators`, `learning_rate` y `max_depth`.

## Librerías principales

- `pandas`
- `matplotlib`
- `scikit-learn`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/01-supervisado/regresion/gradient-boosting/02-tasacion-viviendas

# Activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install pandas matplotlib scikit-learn jupyter

# Abrir el notebook
jupyter notebook notebook.ipynb
```



---

[Volver al índice de Machine Learning](../../../../README.md)
