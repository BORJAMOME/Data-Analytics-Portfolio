# Comparativa 3 modelos — Churn de clientes

Predecir el abandono de clientes en una empresa de servicios y determinar qué algoritmo funciona mejor: Regresión Logística, Árbol de Decisión o Random Forest.

---

## Dataset

`customer churn.xlsx` — histórico de bajas y variables de comportamiento.

## Técnica aplicada

Comparativa sistemática de 3 modelos con misma partición train/test. Métricas: accuracy, precision, recall, F1 y ROC-AUC.

## Librerías principales

- `pandas`
- `matplotlib`
- `scikit-learn`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/01-supervisado/clasificacion/comparativa-modelos/01-churn-clientes

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
