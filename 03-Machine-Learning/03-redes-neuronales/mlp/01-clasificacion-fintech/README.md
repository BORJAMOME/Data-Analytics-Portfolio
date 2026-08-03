# MLP — Evaluación de Crédito Fintech

## Contexto de negocio

Una fintech de microcréditos necesita automatizar la decisión de
aprobación/rechazo de solicitudes, reduciendo la latencia de 48h
a minutos y eliminando la inconsistencia entre analistas.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Tipo | Sintético (np.random.seed(42)) |
| Registros | 100 solicitantes |
| Features | Ingresos_Mensuales, Score_Comportamiento, Deudas_Activas |
| Target | Aprobado (0/1) |

## Técnicas aplicadas

- MLP (128, 64, 32) con early stopping y StandardScaler
- Comparativa con Regresión Logística y Random Forest
- Curvas ROC comparativas, matriz de correlación
- Distribución por clase con boxplots

## Hallazgo clave

En credit scoring, la Regresión Logística sigue siendo el estándar
regulatorio por su interpretabilidad. El MLP puede usarse como
modelo shadow para detectar mejoras sin comprometer compliance.

## Cómo ejecutar

```bash
pip install pandas numpy matplotlib seaborn scikit-learn
jupyter notebook notebook.ipynb
```
