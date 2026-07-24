# Regresión Lineal Simple — Precios inmobiliarios

Predecir el precio de una vivienda en función de sus metros cuadrados. Caso clásico de introducción a la regresión.

---

## Dataset

`datos_regresion_casas.xlsx` — precios y superficie de viviendas.

## Técnica aplicada

Regresión Lineal Simple con `sklearn.linear_model.LinearRegression`. Evaluación con R², MAE y RMSE.

## Librerías principales

- `pandas`
- `matplotlib`
- `scikit-learn`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/01-supervisado/regresion/regresion-lineal-simple/01-inmobiliaria

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
