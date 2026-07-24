# K-Means — Segmentación política

Descubrir grupos naturales de políticos basándose en sus votaciones y posicionamientos, sin usar la etiqueta de partido.

---

## Dataset

`politicos.xlsx` — voting records.

## Técnica aplicada

K-Means. Visualización 2D con PCA. Interpretación política de los clústeres encontrados.

## Librerías principales

- `pandas`
- `matplotlib`
- `seaborn`
- `scikit-learn`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/02-no-supervisado/clustering/kmeans/03-segmentacion-politica

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
