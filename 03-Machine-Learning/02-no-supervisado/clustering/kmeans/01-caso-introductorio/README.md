# K-Means — Caso introductorio

Segmentar clientes de un centro comercial en grupos con comportamiento similar de gasto.

---

## Dataset

`Mall_Customers.csv` — descargar de [Kaggle](https://www.kaggle.com/datasets/vjchoudhary7/customer-segmentation-tutorial-in-python).

## Técnica aplicada

K-Means. Método del codo (Elbow) y coeficiente de silueta para elegir k óptimo.

## Librerías principales

- `pandas`
- `matplotlib`
- `seaborn`
- `scikit-learn`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/02-no-supervisado/clustering/kmeans/01-caso-introductorio

# Activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install pandas matplotlib seaborn scikit-learn jupyter

# Abrir el notebook
jupyter notebook notebook.ipynb
```

## Notas

Dataset externo: descargar `Mall_Customers.csv` de Kaggle y colocarlo en esta carpeta antes de ejecutar.


---

[Volver al índice de Machine Learning](../../../../README.md)
