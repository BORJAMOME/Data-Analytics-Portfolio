# SVM — Vida útil de baterías

Predecir cuándo una batería llegará al final de su vida útil basándose en variables de uso y degradación.

---

## Dataset

Dataset de baterías (incluido en el notebook).

## Técnica aplicada

SVM con kernel RBF. Búsqueda de hiperparámetros y validación cruzada.

## Librerías principales

- `pandas`
- `matplotlib`
- `scikit-learn`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/01-supervisado/regresion/svm/02-baterias

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
