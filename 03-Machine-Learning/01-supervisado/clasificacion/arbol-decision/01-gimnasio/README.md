# Árbol de Decisión — Perfilado de clientes

Segmentar clientes de un gimnasio mediante reglas explicables visualizables como un árbol.

---

## Dataset

`dataset_didactico_machine_learning - ALUMNOS - copia.xlsx`.

## Técnica aplicada

`DecisionTreeClassifier`. Visualización del árbol con `graphviz`, control de profundidad para evitar overfitting.

## Librerías principales

- `pandas`
- `matplotlib`
- `scikit-learn`
- `graphviz`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/01-supervisado/clasificacion/arbol-decision/01-gimnasio

# Activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install pandas matplotlib scikit-learn graphviz jupyter

# Abrir el notebook
jupyter notebook notebook.ipynb
```

## Notas

Requiere Graphviz instalado en el sistema (https://graphviz.org/download/).


---

[Volver al índice de Machine Learning](../../../../README.md)
