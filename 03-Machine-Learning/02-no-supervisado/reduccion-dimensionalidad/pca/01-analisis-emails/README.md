# PCA — Análisis de emails

Reducir la dimensionalidad de un dataset de emails para visualización y análisis exploratorio.

---

## Dataset

`PCA.xlsx` — características extraídas de emails.

## Técnica aplicada

Principal Component Analysis. Varianza explicada acumulada y proyección 2D/3D.

## Librerías principales

- `pandas`
- `matplotlib`
- `scikit-learn`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/02-no-supervisado/reduccion-dimensionalidad/pca/01-analisis-emails

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
