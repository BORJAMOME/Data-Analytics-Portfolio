#!/usr/bin/env python3
"""Build Multiple Linear Regression (gym extra spending) notebook."""
import nbformat as nbf
from nbclient import NotebookClient
import glob, os

nb = nbf.v4.new_notebook()
nb.metadata.update({
    "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
    "language_info": {"name": "python", "version": "3.10.0"}
})

xlsx = [f for f in os.listdir('.') if f.endswith('.xlsx')][0]
cells = []

cells.append(nbf.v4.new_markdown_cell(f"""\
# Regresion Lineal Multiple — Gasto extra en gimnasio
## Que factores hacen que un cliente gaste mas alla de su cuota?

---

**Autor:** Borja Mora Mendez
**Contacto:** [borja.mora.mendez@gmail.com](mailto:borja.mora.mendez@gmail.com) · [LinkedIn](https://www.linkedin.com/in/borja-mora-mendez/)
**Repositorio:** [Data Analytics Portfolio](https://github.com/BORJAMOME/Data-Analytics-Portfolio)
**Categoria:** Machine Learning · Supervisado · Regresion · Regresion Lineal Multiple

---

### Objetivo

Predecir el **gasto mensual extra** de un cliente de gimnasio (suplementos, clases premium, merchandising) a partir de su antiguedad, asistencias y uso en horas pico. El mismo dataset del gimnasio que se usa en clasificacion — aqui con una pregunta de regresion.

### Conexion con el portfolio

Este es el dataset transversal del portfolio. En [clasificacion](../../../clasificacion/) se predice `Satisfecho` y `Abandono`. Aqui se predice `Gasto_Mensual_Extra` — la misma base de datos, tres angulos de analisis distintos."""))

cells.append(nbf.v4.new_markdown_cell("""\
## 1. Contexto de negocio

**El cliente:** la cadena de gimnasios quiere aumentar el revenue por socio sin subir cuotas.

**El problema:** algunos clientes gastan mucho en extras (PT, suplementos, clases) y otros nada. El equipo de marketing necesita identificar los drivers del gasto para disenar ofertas personalizadas.

**La pregunta:** que variables operativas predicen cuanto gastara un cliente en extras?"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 2. Stack tecnico

| Libreria | Uso |
|---|---|
| `pandas` | Manipulacion de datos |
| `matplotlib`, `seaborn` | Visualizacion |
| `scikit-learn` | LinearRegression, VIF, metricas |
| `statsmodels` | OLS con inferencia estadistica |
| `scipy.stats` | Test de normalidad |"""))

cells.append(nbf.v4.new_code_cell("""\
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from statsmodels.stats.outliers_influence import variance_inflation_factor
import statsmodels.api as sm
from scipy import stats

plt.style.use("seaborn-v0_8-whitegrid")
pd.set_option("display.max_columns", None)"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 3. Carga y exploracion inicial"""))

cells.append(nbf.v4.new_code_cell(f"""\
data = pd.read_excel("{xlsx}")
print(f"Registros: {{data.shape[0]}} | Columnas: {{data.shape[1]}}")
data.head()"""))

cells.append(nbf.v4.new_code_cell("""\
data.describe().round(2)"""))

cells.append(nbf.v4.new_code_cell("""\
print("Valores nulos:")
print(data.isnull().sum().to_string())
print(f"\\nDuplicados: {data.duplicated(subset=[c for c in data.columns if c != 'ID_Cliente']).sum()}")"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 4. Analisis exploratorio

**Variables predictoras:** Antiguedad_Meses, Asistencias_Mes, Horas_Pico_Mes.
**Target:** Gasto_Mensual_Extra.

Se excluyen `Satisfecho` y `Abandono` porque son targets de clasificacion (usarlos como features para predecir gasto crearia circularidad logica en el contexto de negocio)."""))

cells.append(nbf.v4.new_code_cell("""\
features = ["Antiguedad_Meses", "Asistencias_Mes", "Horas_Pico_Mes"]
target = "Gasto_Mensual_Extra"

fig, axes = plt.subplots(1, 3, figsize=(16, 5))
for i, col in enumerate(features):
    axes[i].scatter(data[col], data[target], alpha=0.4, edgecolors="white", s=40)
    axes[i].set_xlabel(col, fontsize=10)
    axes[i].set_ylabel(target if i == 0 else "")
    r = data[col].corr(data[target])
    axes[i].set_title(f"{col}\\nr = {r:.3f}", fontsize=11, fontweight="bold")

plt.suptitle("Relacion de cada variable con el gasto extra", fontsize=14, fontweight="bold", y=1.02)
plt.tight_layout()
plt.show()"""))

cells.append(nbf.v4.new_code_cell("""\
fig, ax = plt.subplots(figsize=(7, 5))
corr_matrix = data[features + [target]].corr()
sns.heatmap(corr_matrix, annot=True, cmap="RdBu_r", center=0, fmt=".3f",
            square=True, linewidths=0.5, ax=ax)
ax.set_title("Matriz de correlaciones", fontsize=13, fontweight="bold")
plt.tight_layout()
plt.show()"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 5. Preparacion de datos"""))

cells.append(nbf.v4.new_code_cell("""\
X = data[features]
y = data[target]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)
print(f"Train: {X_train.shape[0]} | Test: {X_test.shape[0]}")"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 6. Modelo con statsmodels — inferencia"""))

cells.append(nbf.v4.new_code_cell("""\
X_train_const = sm.add_constant(X_train)
ols_model = sm.OLS(y_train, X_train_const).fit()
print(ols_model.summary())"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 7. Diagnostico de multicolinealidad (VIF)"""))

cells.append(nbf.v4.new_code_cell("""\
vif_data = pd.DataFrame({
    "Variable": features,
    "VIF": [variance_inflation_factor(X_train.values, i) for i in range(len(features))]
})
vif_data["Diagnostico"] = vif_data["VIF"].apply(
    lambda x: "OK" if x < 5 else ("Moderado" if x < 10 else "Problematico")
)
print("VIF:")
print(vif_data.to_string(index=False))"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 8. Modelo con sklearn — prediccion y metricas"""))

cells.append(nbf.v4.new_code_cell("""\
model = LinearRegression()
model.fit(X_train, y_train)

print("Ecuacion:")
print(f"  Gasto_Extra = {model.intercept_:.4f}", end="")
for name, coef in zip(features, model.coef_):
    sign = "+" if coef >= 0 else ""
    print(f" {sign} {coef:.4f}*{name}", end="")
print()"""))

cells.append(nbf.v4.new_code_cell("""\
y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)
r2_adj = 1 - (1-r2) * (len(y_test)-1) / (len(y_test)-len(features)-1)

print("Metricas:")
print(f"  MAE:    {mae:.2f} EUR")
print(f"  RMSE:   {rmse:.2f} EUR")
print(f"  R2:     {r2:.4f} ({r2:.1%})")
print(f"  R2 adj: {r2_adj:.4f}")"""))

cells.append(nbf.v4.new_code_cell("""\
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

axes[0].scatter(y_test, y_pred, alpha=0.5, edgecolors="white", s=40)
lims = [min(y_test.min(), y_pred.min())-5, max(y_test.max(), y_pred.max())+5]
axes[0].plot(lims, lims, "k--", linewidth=1, label="Prediccion perfecta")
axes[0].set_xlabel("Gasto real", fontsize=11)
axes[0].set_ylabel("Gasto predicho", fontsize=11)
axes[0].set_title(f"Real vs Predicho (R2={r2:.3f})", fontsize=12, fontweight="bold")
axes[0].legend()

coef_df = pd.DataFrame({"Variable": features, "Coeficiente": model.coef_}).sort_values("Coeficiente")
colors = ["#2ecc71" if c > 0 else "#e74c3c" for c in coef_df["Coeficiente"]]
axes[1].barh(coef_df["Variable"], coef_df["Coeficiente"], color=colors, edgecolor="white")
axes[1].set_xlabel("Coeficiente", fontsize=11)
axes[1].set_title("Impacto de cada variable", fontsize=12, fontweight="bold")
axes[1].axvline(0, color="gray", linewidth=0.5)

plt.tight_layout()
plt.show()"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 9. Diagnostico de supuestos"""))

cells.append(nbf.v4.new_code_cell("""\
residuos = y_test - y_pred

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

axes[0,0].scatter(y_pred, residuos, alpha=0.5, edgecolors="white", s=40)
axes[0,0].axhline(0, color="red", linewidth=1.5, linestyle="--")
axes[0,0].set_title("1. Linealidad", fontsize=11, fontweight="bold")

stats.probplot(residuos, dist="norm", plot=axes[0,1])
axes[0,1].set_title("2. Normalidad — QQ Plot", fontsize=11, fontweight="bold")

axes[1,0].scatter(y_pred, np.abs(residuos), alpha=0.5, edgecolors="white", s=40)
axes[1,0].set_title("3. Homocedasticidad", fontsize=11, fontweight="bold")

axes[1,1].hist(residuos, bins=15, edgecolor="white", alpha=0.7)
axes[1,1].set_title("4. Distribucion de residuos", fontsize=11, fontweight="bold")

plt.suptitle("Diagnostico de supuestos", fontsize=14, fontweight="bold")
plt.tight_layout()
plt.show()

stat, p = stats.shapiro(residuos)
print(f"Shapiro-Wilk: W={stat:.4f}, p={p:.4f}")
print(f"  {'Residuos normales (p > 0.05)' if p > 0.05 else 'Residuos NO normales (p <= 0.05)'}")"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 10. Insights de negocio y recomendaciones

### El hallazgo

> El gasto extra esta influenciado por la combinacion de antiguedad, frecuencia de asistencia y uso en horas pico. Los coeficientes del modelo indican que variable tiene mayor peso en el gasto adicional del cliente.

### Recomendaciones

**1. Segmentar ofertas por perfil de uso (impacto: alto)**
Los clientes con alta asistencia y alta antiguedad son los mejores candidatos para upselling de servicios premium (PT personal, nutricion, clases exclusivas).

**2. Incentivar asistencia para aumentar gasto (impacto: medio)**
Si la asistencia es un driver del gasto extra, programas de fidelizacion que aumenten las visitas (retos mensuales, streaks) pueden tener un efecto indirecto en el revenue.

**3. Conexion con retencion (impacto: portfolio)**
Este mismo dataset se usa para predecir [abandono (regresion logistica)](../../../clasificacion/05-regresion-logistica/01-gimnasio/) y [satisfaccion (arboles)](../../../clasificacion/01-arbol-decision/). Los tres analisis juntos dan una vision 360 del cliente."""))

cells.append(nbf.v4.new_markdown_cell("""\
## 11. Limitaciones y proximos pasos

**Limitaciones:**
- Solo 3 features operativas — faltan datos de tipo de membresia, horario preferido, tipo de actividad.
- Gasto_Mensual_Extra puede tener distribucion no normal (muchos ceros o sesgo positivo).
- Se excluyen Satisfecho/Abandono intencionalmente para evitar circularidad.

**Proximos pasos:**
- [ ] [Ridge/Lasso](../../03-ridge-lasso/01-regularizacion/) — regularizacion para datasets con mas variables.
- [ ] [Gradient Boosting](../../04-gradient-boosting/01-inmobiliaria/) — modelo no lineal que captura relaciones complejas.
- [ ] [Regresion Logistica — Abandono](../../../clasificacion/05-regresion-logistica/01-gimnasio/) — el mismo dataset desde el angulo de clasificacion."""))

nb.cells = cells
with open("notebook.ipynb", "w", encoding="utf-8") as f:
    nbf.write(nb, f)
print("Written. Executing...")
client = NotebookClient(nb, timeout=120, kernel_name="python3")
client.execute()
with open("notebook.ipynb", "w", encoding="utf-8") as f:
    nbf.write(nb, f)
print("OK - Multiple LR (gym)")
