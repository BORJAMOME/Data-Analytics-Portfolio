# Clustering Jerárquico — Caso completo

Pipeline completo de clustering jerárquico con datos sintéticos: generación, exploración, dendrograma, corte y evaluación.

---

## Dataset

Generado con `sklearn.datasets.make_blobs`.

## Técnica aplicada

`AgglomerativeClustering` end-to-end. Silhouette score y visualización de clústeres.

## Librerías principales

- `scikit-learn`
- `matplotlib`
- `scipy`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/02-no-supervisado/clustering/jerarquico/03-caso-completo

# Activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install scikit-learn matplotlib scipy jupyter

# Abrir el notebook
jupyter notebook notebook.ipynb
```



---

[Volver al índice de Machine Learning](../../../../README.md)
