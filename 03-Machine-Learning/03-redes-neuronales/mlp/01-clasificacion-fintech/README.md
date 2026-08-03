# MLP — Evaluacion de Credito Fintech

## Contexto de negocio

Una fintech de microcreditos necesita automatizar la decision de
aprobacion/rechazo de solicitudes, reduciendo la latencia de 48h
a minutos y eliminando la inconsistencia entre analistas.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Tipo | Sintetico (np.random.seed(42)) |
| Registros | 100 solicitantes |
| Features | Ingresos_Mensuales, Score_Comportamiento, Deudas_Activas |
| Target | Aprobado (0/1) |

## Tecnicas aplicadas

- MLP (128, 64, 32) con early stopping y StandardScaler
- Comparativa con Regresion Logistica y Random Forest
- Curvas ROC comparativas, matriz de correlacion
- Distribucion por clase con boxplots

## Hallazgo clave

En credit scoring, la Regresion Logistica sigue siendo el standard
regulatorio por su interpretabilidad. El MLP puede usarse como
modelo shadow para detectar mejoras sin comprometer compliance.

## Como ejecutar

```bash
pip install pandas numpy matplotlib seaborn scikit-learn
jupyter notebook notebook.ipynb
```
