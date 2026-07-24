# Regularización — Ridge y Lasso

Cuando hay muchas variables predictoras, la regularización penaliza los coeficientes para evitar el overfitting sin perder capacidad predictiva.

---

## Dataset

Dataset generado con `sklearn.datasets` o incluido en el notebook.

## Técnica aplicada

Ridge (L2) y Lasso (L1) con validación cruzada (`RidgeCV`, `LassoCV`). Comparativa contra regresión lineal ordinaria.

## Librerías principales

- `pandas`
- `matplotlib`
- `scikit-learn`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/01-supervisado/regresion/ridge-lasso/01-regularizacion

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
