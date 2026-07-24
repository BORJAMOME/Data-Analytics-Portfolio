# ARIMA — Forecast consumo eléctrico

Predecir el consumo eléctrico futuro a partir del histórico. Comparativa con el mismo problema resuelto con MLP.

---

## Dataset

`electricidad.xlsx` — consumo eléctrico histórico.

## Técnica aplicada

ARIMA + `auto_arima` para búsqueda automática de parámetros. Validación temporal (train/test split cronológico).

## Librerías principales

- `pandas`
- `matplotlib`
- `statsmodels`
- `pmdarima`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/04-series-temporales/arima/02-forecast-electricidad

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
