# Clustering Jerárquico — Caso avanzado gimnasio

Aplicar clustering jerárquico a datos reales de gimnasio y comparar con K-Means.

---

## Dataset

`dataset_didactico_machine_learning - ALUMNOS - copia.xlsx`.

## Técnica aplicada

`AgglomerativeClustering` con criterio de Ward. Elección del corte del dendrograma.

## Librerías principales

- `pandas`
- `matplotlib`
- `scikit-learn`
- `scipy`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/02-no-supervisado/clustering/jerarquico/02-caso-avanzado

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
