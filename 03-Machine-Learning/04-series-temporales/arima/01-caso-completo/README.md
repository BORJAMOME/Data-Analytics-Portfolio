# ARIMA — Caso completo

Modelar y predecir una serie temporal financiera usando el modelo ARIMA (AutoRegressive Integrated Moving Average).

---

## Dataset

`arima.xlsx` — serie temporal histórica.

## Técnica aplicada

ARIMA con `statsmodels`. Test de Dickey-Fuller (estacionariedad), ACF/PACF, selección de parámetros (p, d, q).

## Librerías principales

- `pandas`
- `matplotlib`
- `statsmodels`
- `pmdarima`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/04-series-temporales/arima/01-caso-completo

# Activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install pandas matplotlib statsmodels pmdarima jupyter

# Abrir el notebook
jupyter notebook notebook.ipynb
```



---

[Volver al índice de Machine Learning](../../../README.md)
