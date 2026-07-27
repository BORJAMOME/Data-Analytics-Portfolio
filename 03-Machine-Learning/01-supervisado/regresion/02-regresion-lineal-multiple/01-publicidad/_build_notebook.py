#!/usr/bin/env python3
"""Build Multiple Linear Regression (advertising) notebook."""
import nbformat as nbf
from nbclient import NotebookClient

nb = nbf.v4.new_notebook()
nb.metadata.update({
    "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
    "language_info": {"name": "python", "version": "3.10.0"}
})
cells = []

cells.append(nbf.v4.new_markdown_cell("""\
# Regresion Lineal Multiple — ROI publicitario
## Cuanto vende cada euro invertido en TV, Radio y Prensa? Un modelo clasico con respuesta clara

---

**Autor:** Borja Mora Mendez
**Contacto:** [borja.mora.mendez@gmail.com](mailto:borja.mora.mendez@gmail.com) · [LinkedIn](https://www.linkedin.com/in/borja-mora-mendez/)
**Repositorio:** [Data Analytics Portfolio](https://github.com/BORJAMOME/Data-Analytics-Portfolio)
**Categoria:** Machine Learning · Supervisado · Regresion · Regresion Lineal Multiple

---

### Objetivo

Construir un modelo de regresion lineal multiple que prediga las ventas a partir de la inversion en TV, Radio y Prensa. El dataset `Advertising` es un clasico del ML — aqui lo tratamos no como ejercicio academico sino como un **caso de optimizacion de presupuesto publicitario**.

### Lo que diferencia este notebook

Se analiza no solo el modelo, sino los **supuestos estadisticos** (VIF, normalidad, homocedasticidad) y se traduce cada coeficiente en una **recomendacion de negocio accionable** para redistribuir presupuesto."""))

cells.append(nbf.v4.new_markdown_cell("""\
## 1. Contexto de negocio

**El cliente:** un director de marketing que necesita justificar su presupuesto publicitario ante el CFO.

**El problema:** se invierten miles de euros en tres canales (TV, Radio, Prensa) pero no se sabe cual genera mas retorno. El director necesita datos para reasignar presupuesto al canal mas rentable.

**La pregunta:** por cada 1.000 euros adicionales en cada canal, cuantas unidades mas se venden?"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 2. Stack tecnico

| Libreria | Uso |
|---|---|
| `pandas` | Manipulacion de datos |
| `matplotlib`, `seaborn` | Visualizacion |
| `scikit-learn` | LinearRegression, metricas, VIF |
| `scipy.stats` | Test de normalidad |
| `statsmodels` | OLS con p-valores e intervalos de confianza |"""))

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

cells.append(nbf.v4.new_code_cell("""\
data = pd.read_csv("Advertising.csv")
print(f"Registros: {data.shape[0]} | Columnas: {data.shape[1]}")
data.head()"""))

cells.append(nbf.v4.new_code_cell("""\
data.describe().round(2)"""))

cells.append(nbf.v4.new_code_cell("""\
print("Valores nulos:")
print(data.isnull().sum().to_string())
print(f"\\nDuplicados: {data.duplicated().sum()}")"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 4. Analisis exploratorio"""))

cells.append(nbf.v4.new_code_cell("""\
fig, axes = plt.subplots(1, 3, figsize=(16, 5))
canales = ["TV", "Radio", "Newspaper"]

for i, col in enumerate(canales):
    axes[i].scatter(data[col], data["Sales"], alpha=0.5, edgecolors="white", s=40)
    axes[i].set_xlabel(f"Inversion en {col}", fontsize=11)
    axes[i].set_ylabel("Ventas" if i == 0 else "")
    r = data[col].corr(data["Sales"])
    axes[i].set_title(f"{col} (r = {r:.3f})", fontsize=12, fontweight="bold")

plt.suptitle("Relacion de cada canal con las ventas", fontsize=14, fontweight="bold", y=1.02)
plt.tight_layout()
plt.show()"""))

cells.append(nbf.v4.new_code_cell("""\
fig, ax = plt.subplots(figsize=(8, 6))
corr_matrix = data[canales + ["Sales"]].corr()
sns.heatmap(corr_matrix, annot=True, cmap="RdBu_r", center=0, fmt=".3f",
            square=True, linewidths=0.5, ax=ax)
ax.set_title("Matriz de correlaciones", fontsize=13, fontweight="bold")
plt.tight_layout()
plt.show()"""))

cells.append(nbf.v4.new_markdown_cell("""\
### Lectura

- **TV** tiene la correlacion mas fuerte con ventas (r ~ 0.78) y la relacion visual mas clara.
- **Radio** muestra correlacion moderada pero con mas dispersion.
- **Newspaper** tiene correlacion debil — gran parte de su correlacion con ventas puede deberse a su correlacion con Radio (confounding)."""))

cells.append(nbf.v4.new_markdown_cell("""\
## 5. Preparacion de datos"""))

cells.append(nbf.v4.new_code_cell("""\
X = data[canales]
y = data["Sales"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

print(f"Train: {X_train.shape[0]} registros | Test: {X_test.shape[0]} registros")"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 6. Modelo con statsmodels — inferencia estadistica"""))

cells.append(nbf.v4.new_code_cell("""\
X_train_const = sm.add_constant(X_train)
ols_model = sm.OLS(y_train, X_train_const).fit()
print(ols_model.summary())"""))

cells.append(nbf.v4.new_markdown_cell("""\
### Interpretacion del summary

- **R-squared:** proporcion de la variabilidad de ventas explicada por los tres canales.
- **Coeficientes:** incremento de ventas por cada unidad adicional invertida en cada canal.
- **p-valores:** si p < 0.05, el canal es estadisticamente significativo.
- **Newspaper** probablemente tendra p > 0.05 — su efecto desaparece al controlar por TV y Radio."""))

cells.append(nbf.v4.new_markdown_cell("""\
## 7. Diagnostico de multicolinealidad (VIF)

El VIF detecta si las variables predictoras estan correlacionadas entre si. Un VIF > 5 indica multicolinealidad problematica."""))

cells.append(nbf.v4.new_code_cell("""\
vif_data = pd.DataFrame({
    "Variable": canales,
    "VIF": [variance_inflation_factor(X_train.values, i) for i in range(X_train.shape[1])]
})
vif_data["Diagnostico"] = vif_data["VIF"].apply(
    lambda x: "OK" if x < 5 else ("Moderado" if x < 10 else "Problematico")
)
print("Factor de Inflacion de la Varianza (VIF):")
print(vif_data.to_string(index=False))"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 8. Modelo con sklearn — prediccion"""))

cells.append(nbf.v4.new_code_cell("""\
model = LinearRegression()
model.fit(X_train, y_train)

print("Ecuacion del modelo:")
print(f"  Ventas = {model.intercept_:.4f}", end="")
for name, coef in zip(canales, model.coef_):
    sign = "+" if coef >= 0 else ""
    print(f" {sign} {coef:.4f}*{name}", end="")
print()
print()
print("Interpretacion por canal:")
for name, coef in zip(canales, model.coef_):
    print(f"  {name}: +1 unidad de inversion = {coef:.4f} unidades de venta adicionales")"""))

cells.append(nbf.v4.new_code_cell("""\
y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)
r2_adj = 1 - (1-r2) * (len(y_test)-1) / (len(y_test)-X_test.shape[1]-1)

print("Metricas de evaluacion:")
print(f"  MAE:     {mae:.4f} (error medio en unidades de venta)")
print(f"  RMSE:    {rmse:.4f}")
print(f"  R2:      {r2:.4f} ({r2:.1%} de la varianza explicada)")
print(f"  R2 adj:  {r2_adj:.4f} (ajustado por numero de variables)")"""))

cells.append(nbf.v4.new_code_cell("""\
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Real vs Predicho
axes[0].scatter(y_test, y_pred, alpha=0.6, edgecolors="white", s=50)
lims = [min(y_test.min(), y_pred.min())-1, max(y_test.max(), y_pred.max())+1]
axes[0].plot(lims, lims, "k--", linewidth=1, label="Prediccion perfecta")
axes[0].set_xlabel("Ventas reales", fontsize=11)
axes[0].set_ylabel("Ventas predichas", fontsize=11)
axes[0].set_title(f"Real vs Predicho (R2={r2:.3f})", fontsize=12, fontweight="bold")
axes[0].legend()

# Importancia de coeficientes
coef_df = pd.DataFrame({"Canal": canales, "Coeficiente": model.coef_})
coef_df = coef_df.sort_values("Coeficiente", ascending=True)
colors = ["#2ecc71" if c > 0.01 else "#e74c3c" for c in coef_df["Coeficiente"]]
axes[1].barh(coef_df["Canal"], coef_df["Coeficiente"], color=colors, edgecolor="white")
axes[1].set_xlabel("Coeficiente (impacto en ventas)", fontsize=11)
axes[1].set_title("Impacto de cada canal", fontsize=12, fontweight="bold")
axes[1].axvline(0, color="gray", linewidth=0.5)

plt.tight_layout()
plt.show()"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 9. Diagnostico de supuestos"""))

cells.append(nbf.v4.new_code_cell("""\
residuos = y_test - y_pred

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

axes[0,0].scatter(y_pred, residuos, alpha=0.6, edgecolors="white", s=50)
axes[0,0].axhline(0, color="red", linewidth=1.5, linestyle="--")
axes[0,0].set_xlabel("Valores predichos")
axes[0,0].set_ylabel("Residuos")
axes[0,0].set_title("1. Linealidad", fontsize=11, fontweight="bold")

stats.probplot(residuos, dist="norm", plot=axes[0,1])
axes[0,1].set_title("2. Normalidad — QQ Plot", fontsize=11, fontweight="bold")

axes[1,0].scatter(y_pred, np.abs(residuos), alpha=0.6, edgecolors="white", s=50)
axes[1,0].set_xlabel("Valores predichos")
axes[1,0].set_ylabel("|Residuos|")
axes[1,0].set_title("3. Homocedasticidad", fontsize=11, fontweight="bold")

axes[1,1].hist(residuos, bins=15, edgecolor="white", alpha=0.7)
axes[1,1].set_xlabel("Residuos")
axes[1,1].set_title("4. Distribucion de residuos", fontsize=11, fontweight="bold")

plt.suptitle("Diagnostico de supuestos — Regresion Multiple", fontsize=14, fontweight="bold")
plt.tight_layout()
plt.show()

stat, p_value = stats.shapiro(residuos)
print(f"Shapiro-Wilk: W={stat:.4f}, p={p_value:.4f}")
print(f"  {'Residuos normales (p > 0.05)' if p_value > 0.05 else 'Residuos NO normales (p <= 0.05)'}")"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 10. Simulacion de escenarios — redistribucion de presupuesto

La pregunta del director de marketing: si tengo un presupuesto fijo, como lo redistribuyo?"""))

cells.append(nbf.v4.new_code_cell("""\
# Presupuesto medio actual
budget_actual = data[canales].mean()
ventas_actual = model.predict(budget_actual.values.reshape(1, -1))[0]

# Escenario: mover 50% de Newspaper a TV
budget_tv = budget_actual.copy()
budget_tv["TV"] += budget_actual["Newspaper"] * 0.5
budget_tv["Newspaper"] *= 0.5
ventas_tv = model.predict(budget_tv.values.reshape(1, -1))[0]

# Escenario: mover 50% de Newspaper a Radio
budget_radio = budget_actual.copy()
budget_radio["Radio"] += budget_actual["Newspaper"] * 0.5
budget_radio["Newspaper"] *= 0.5
ventas_radio = model.predict(budget_radio.values.reshape(1, -1))[0]

print("Simulacion de redistribucion de presupuesto:")
print(f"  Actual:                  Ventas estimadas = {ventas_actual:.2f}")
print(f"  50% Prensa -> TV:        Ventas estimadas = {ventas_tv:.2f} ({ventas_tv-ventas_actual:+.2f})")
print(f"  50% Prensa -> Radio:     Ventas estimadas = {ventas_radio:.2f} ({ventas_radio-ventas_actual:+.2f})")
print()
mejor = "TV" if ventas_tv > ventas_radio else "Radio"
print(f"  Recomendacion: mover presupuesto de Prensa a {mejor}")"""))

cells.append(nbf.v4.new_markdown_cell("""\
## 11. Insights de negocio y recomendaciones

### El hallazgo

> TV y Radio son los canales que generan retorno real. Prensa no tiene efecto estadisticamente significativo una vez controlado por los otros dos canales. Cada unidad adicional en TV genera el mayor impacto unitario en ventas.

### Recomendaciones

**1. Redistribuir presupuesto de Prensa a TV/Radio (impacto: alto)**
El modelo sugiere que la inversion en Prensa no contribuye significativamente. Redirigir ese presupuesto a TV (mayor coeficiente) o Radio generaria mas ventas sin aumentar el gasto total.

**2. TV para alcance, Radio para refuerzo (impacto: alto)**
TV tiene el mayor coeficiente absoluto pero tambien el mayor coste. Radio puede ser mas eficiente en terminos de ROI por euro invertido (depende de los costes unitarios, no incluidos en este dataset).

**3. Modelo como herramienta de planificacion (impacto: medio)**
La ecuacion lineal puede implementarse en una hoja de calculo para simular escenarios de presupuesto antes de comprometer la inversion real."""))

cells.append(nbf.v4.new_markdown_cell("""\
## 12. Limitaciones y proximos pasos

**Limitaciones:**
- El modelo asume relacion lineal — en la realidad, los rendimientos publicitarios son decrecientes (saturacion).
- No se modela la interaccion entre canales (sinergia TV+Radio).
- 200 registros sin informacion temporal — no se puede analizar estacionalidad.

**Proximos pasos:**
- [ ] [Regresion con regularizacion (Ridge/Lasso)](../../03-ridge-lasso/01-regularizacion/) — que hacer cuando hay demasiadas variables.
- [ ] [Gradient Boosting Regressor](../../04-gradient-boosting/01-inmobiliaria/) — modelo no lineal que captura saturacion.
- [ ] Anadir terminos de interaccion (TV*Radio) para capturar sinergias entre canales."""))

nb.cells = cells
with open("notebook.ipynb", "w", encoding="utf-8") as f:
    nbf.write(nb, f)
print("Written. Executing...")
client = NotebookClient(nb, timeout=120, kernel_name="python3")
client.execute()
with open("notebook.ipynb", "w", encoding="utf-8") as f:
    nbf.write(nb, f)
print("OK - Multiple LR (advertising)")
