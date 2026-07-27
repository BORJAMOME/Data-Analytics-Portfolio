# Perfilado de clientes con Árbol de Decisión — Gimnasio

Caso de negocio real: una cadena de gimnasios urbana quiere entender **qué explica la satisfacción** de sus clientes para poder actuar antes de que se den de baja. La respuesta la da un árbol de decisión — y es sorprendentemente clara.

---

## Contexto de negocio

Cadena de gimnasios urbanos con múltiples sedes. La dirección observa un patrón de bajas pero no consigue articular qué diferencia a un cliente satisfecho de uno insatisfecho. Sin ese conocimiento, es imposible diseñar acciones de retención.

## Objetivo

Construir un modelo de clasificación que prediga la satisfacción del cliente y —más importante— produzca **reglas de negocio explicables** que el director de operaciones pueda llevar a una reunión.

## Dataset

`dataset_didactico_machine_learning - ALUMNOS - copia.xlsx` — 300 registros con:

- `Antiguedad_Meses`, `Asistencias_Mes`, `Horas_Pico_Mes`, `Gasto_Mensual_Extra` (features)
- `Satisfecho` (target binario: 1 = satisfecho, 0 = insatisfecho)

## Técnicas aplicadas

- **Árbol de Decisión** (`DecisionTreeClassifier`, max_depth=2) — modelo principal, elegido por su interpretabilidad
- **Random Forest** (100 estimadores) — comparativa para validar que no perdemos precisión al simplificar
- **XGBoost** — comparativa con el estándar de la industria

Evaluación con accuracy, matriz de confusión, precision/recall/F1 y análisis de feature importance.

## Hallazgo clave

> La satisfacción del cliente se explica **en un 98,9% por una sola variable: `Asistencias_Mes`**.
>
> **Regla operativa:** cliente satisfecho = asiste más de 13 veces al mes durante al menos 3 meses.

Con esta única regla, el árbol clasifica correctamente al 90% de los clientes del test set — misma precisión que Random Forest y superior a XGBoost.

## Recomendaciones de negocio

1. **Sistema de alerta temprana:** clientes por debajo de 8-10 asistencias/mes durante 2 meses entran automáticamente en pipeline de retención.
2. **Onboarding intensivo los primeros 3 meses:** llevar al nuevo cliente por encima del umbral de 13 asistencias lo antes posible.
3. **KPI operativo diario:** `% clientes activos con ≥13 asistencias/mes` como proxy de satisfacción — más barato y objetivo que encuestas trimestrales.

## Librerías principales

- `pandas`
- `matplotlib`
- `seaborn`
- `scikit-learn`
- `xgboost`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/01-supervisado/clasificacion/arbol-decision/01-gimnasio

# Activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install pandas matplotlib seaborn scikit-learn xgboost jupyter

# Abrir el notebook
jupyter notebook notebook.ipynb
```

---

[Volver al índice de Machine Learning](../../../../README.md)
