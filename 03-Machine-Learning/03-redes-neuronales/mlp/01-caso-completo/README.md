# MLP — Prediccion de Abandono en Streaming

## Contexto de negocio

Una plataforma de streaming necesita predecir que suscriptores cancelaran
para activar campanas de retencion proactivas. El coste de adquirir un
nuevo usuario es 5x superior al de retener uno existente.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Tipo | Sintetico (np.random.seed(42)) |
| Registros | 100 suscriptores |
| Features | Edad, Meses_Contrato, Horas_Al_Mes |
| Target | Abandono (0/1) |

## Tecnicas aplicadas

- MLP (64, 32) con early stopping y StandardScaler
- Comparativa con Regresion Logistica y Random Forest
- Curvas ROC, matriz de confusion, curva de aprendizaje
- Feature importance via permutation

## Hallazgo clave

Con 3 variables y 100 registros, el MLP no supera significativamente
a los modelos clasicos. Las Horas_Al_Mes son el predictor dominante:
los suscriptores con bajo consumo abandonan con mayor probabilidad.

## Notebooks relacionados

- [02-clasificacion-fintech](../02-clasificacion-fintech/) — MLP para credit scoring
- [03-forecast-consumo-electrico](../03-forecast-consumo-electrico/) — MLPRegressor

## Como ejecutar

```bash
pip install pandas numpy matplotlib seaborn scikit-learn
jupyter notebook notebook.ipynb
```
