# SOM — Casos introductorios

Introducción a los Self-Organizing Maps (Kohonen): redes neuronales no supervisadas para visualización y clustering.

---

## Dataset

`dataset_SOM.xlsx` — datos genéricos para primer contacto.

## Técnica aplicada

SOM con la librería `minisom`. Mapa de activación (U-matrix), inicialización aleatoria vs PCA.

## Librerías principales

- `minisom`
- `pandas`
- `matplotlib`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/03-redes-neuronales/som/01-casos-introductorios

# Activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install minisom pandas matplotlib jupyter

# Abrir el notebook
jupyter notebook notebook.ipynb
```



---

[Volver al índice de Machine Learning](../../../README.md)
