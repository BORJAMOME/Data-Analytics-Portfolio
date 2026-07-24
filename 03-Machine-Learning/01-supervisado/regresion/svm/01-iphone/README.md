# SVM — Predicción compra iPhone

Clasificar si un cliente comprará un iPhone en función de sus características demográficas y de comportamiento.

---

## Dataset

Dataset iPhone (incluido en el notebook o generado sintéticamente).

## Técnica aplicada

Support Vector Machine (`SVC`) con distintos kernels (lineal, RBF, polinómico). Escalado previo con `StandardScaler`.

## Librerías principales

- `pandas`
- `matplotlib`
- `scikit-learn`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/01-supervisado/regresion/svm/01-iphone

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
