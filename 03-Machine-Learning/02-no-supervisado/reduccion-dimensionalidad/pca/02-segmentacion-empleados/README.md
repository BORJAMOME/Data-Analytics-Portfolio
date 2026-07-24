# PCA — Segmentación de empleados

Analizar y segmentar empleados de una empresa reduciendo múltiples variables a componentes principales interpretables.

---

## Dataset

`employees.xlsx` — variables demográficas y de rendimiento.

## Técnica aplicada

PCA combinado con K-Means sobre componentes principales. Análisis de cargas (loadings).

## Librerías principales

- `pandas`
- `matplotlib`
- `seaborn`
- `scikit-learn`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/02-no-supervisado/reduccion-dimensionalidad/pca/02-segmentacion-empleados

# Activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install pandas matplotlib seaborn scikit-learn jupyter

# Abrir el notebook
jupyter notebook notebook.ipynb
```



---

[Volver al índice de Machine Learning](../../../../README.md)
