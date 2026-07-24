# Clustering Jerárquico — Caso introductorio

Agrupar observaciones sin definir k a priori: el clustering jerárquico construye un árbol completo (dendrograma).

---

## Dataset

Datos sintéticos generados en el notebook.

## Técnica aplicada

`AgglomerativeClustering` + dendrograma con `scipy.cluster.hierarchy`. Distintas métricas de enlace (ward, complete, average).

## Librerías principales

- `pandas`
- `matplotlib`
- `scikit-learn`
- `scipy`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/02-no-supervisado/clustering/jerarquico/01-caso-introductorio

# Activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install pandas matplotlib scikit-learn scipy jupyter

# Abrir el notebook
jupyter notebook notebook.ipynb
```



---

[Volver al índice de Machine Learning](../../../../README.md)
