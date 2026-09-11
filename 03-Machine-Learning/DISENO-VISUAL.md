# Sistema de color de los notebooks

> Paleta y reglas de color validadas (consejo UX/UI Data + validador de accesibilidad CVD) que se aplican a **todos los gráficos matplotlib/seaborn** de este portfolio. Documento de referencia para no reinventar el sistema cada vez que se crea o audita un notebook nuevo.

---

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `BACKGROUND` | `#fbfbfb` | Fondo de figura y de ejes (`figure.facecolor` / `axes.facecolor`) |
| `PURPLE` | `#7a7bff` | Único color de énfasis — máximo 1 elemento por gráfico (barra ganadora, serie protagonista, scatter de una sola serie) |
| `PURPLE_LIGHT` | `#9b9cff` | Histogramas EDA independientes (la clásica celda "Distribuciones de las variables"). Dentro de una figura mixta (ej. panel de diagnóstico con scatter + histograma) el histograma se queda en `PURPLE` normal, para no desentonar con el resto de paneles |
| `POSITIVE` | `#6b8158` | Exclusivo signo positivo / desenlace bueno de negocio. Nunca para identidad de categoría |
| `NEGATIVE` | `#c34031` | Exclusivo signo negativo / desenlace malo de negocio. Nunca para identidad de categoría |
| `NEUTRAL_BAR` | `#d9d9d9` | Barras/áreas de contexto (no destacadas) — exige SIEMPRE etiqueta de valor visible, porque el contraste contra `BACKGROUND` es bajo (1.4:1) |
| `NEUTRAL_LINE` | `#8f8c9e` | Líneas de contexto — más contraste que `NEUTRAL_BAR` (3.2:1) porque un trazo de 2px necesita más contraste que un relleno |
| `CONTEXT_LINES` | `[NEUTRAL_LINE, '#a89a8a', '#7d94a8']` | Gama fija para cuando hay 2 o más series de contexto en el mismo gráfico (nunca repetir `NEUTRAL_LINE` para dos series distintas — se vuelven indistinguibles) |
| `INK` | `#111111` | Texto principal, valores, líneas/curvas de referencia neutras (contraste 18.2:1) |
| `MUTED` | `#707070` | Texto secundario, ejes (4.8:1 — sustituye a `#888888`, que no pasaba AA) |
| `CLUSTER_PALETTE` | `['#7a7bff','#eb6834','#1baf7a','#e34948','#eda100','#e87ba4','#008300']` | Identidad categórica (un color = un cluster/segmento/modelo). Validada con el validador de paletas (ΔE OKLab, simulación CVD Machado-Oliveira-Fernandes) para **pares adyacentes** (barras, líneas, enlaces de dendrograma) |
| `CLUSTER_MARKERS` | `['o','s','^','D','v','P','X']` | Forma de marcador por índice de cluster — obligatoria en scatter/PCA/t-SNE con 4+ clusters, porque a partir de ahí el color solo ya no es 100% seguro para daltonismo severo (ver nota de accesibilidad) |

**Escalas derivadas** (construidas con `matplotlib.colors.LinearSegmentedColormap`):

```python
DIVERGING_CMAP = LinearSegmentedColormap.from_list(
    "borja_diverging", ["#c34031", "#e0a89f", "#f0ede8", "#b7c2a9", "#6b8158"]
)
SEQUENTIAL_GREEN = LinearSegmentedColormap.from_list(
    "borja_sequential", [BACKGROUND, POSITIVE]
)
SEQUENTIAL_PURPLE = LinearSegmentedColormap.from_list(
    "borja_sequential_purple", [BACKGROUND, PURPLE]
)
```

- `DIVERGING_CMAP` — para cualquier matriz con signo real (correlación, loadings de PCA, coeficientes). El punto neutro (`#f0ede8`) se funde casi con `BACKGROUND`.
- `SEQUENTIAL_GREEN` — para matrices de magnitud sin signo **con lectura de resultado** (matriz de confusión, perfil normalizado 0-1 por cluster/columna). Nunca uses un cmap divergente para esto: rompe la lectura porque no hay "negativo" real.
- `SEQUENTIAL_PURPLE` — para magnitudes sin signo **y sin lectura de bueno/malo** (distancia entre neuronas de un SOM, recuento de registros por celda/neurona, valor bruto de una variable). Ver regla 13.

---

## Bloque de setup — pegar en la primera celda de código de cada notebook nuevo

```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap

# Estilo visual — sistema de color validado (consejo UX/UI Data)
BACKGROUND    = '#fbfbfb'
PURPLE        = '#7a7bff'
PURPLE_LIGHT  = '#9b9cff'
POSITIVE      = '#6b8158'
NEGATIVE      = '#c34031'
NEUTRAL_BAR   = '#d9d9d9'
NEUTRAL_LINE  = '#8f8c9e'
CONTEXT_LINES = [NEUTRAL_LINE, '#a89a8a', '#7d94a8']
INK           = '#111111'
MUTED         = '#707070'

# Solo en notebooks con clustering / identidad de categoría (PCA+KMeans, jerárquico, SOM...)
CLUSTER_PALETTE = ['#7a7bff', '#eb6834', '#1baf7a', '#e34948', '#eda100', '#e87ba4', '#008300']
CLUSTER_MARKERS = ['o', 's', '^', 'D', 'v', 'P', 'X']

DIVERGING_CMAP = LinearSegmentedColormap.from_list(
    "borja_diverging", ["#c34031", "#e0a89f", "#f0ede8", "#b7c2a9", "#6b8158"]
)
SEQUENTIAL_GREEN = LinearSegmentedColormap.from_list(
    "borja_sequential", [BACKGROUND, POSITIVE]
)
# Solo en notebooks con SOM (U-Matrix, mapa de frecuencia, component planes)
SEQUENTIAL_PURPLE = LinearSegmentedColormap.from_list(
    "borja_sequential_purple", [BACKGROUND, PURPLE]
)

def color_annotations(ax, values, threshold, dark="#ffffff", light=INK):
    """Recolorea el texto de un heatmap celda a celda según su magnitud.
    `values` debe ser el array que determina el color de relleno (no necesariamente
    el que se muestra como texto) y `threshold` debe estar en la misma escala que
    `values` (ej. si el heatmap está centrado en 1, pasa `values - 1`, no `values`)."""
    for text, value in zip(ax.texts, np.asarray(values).flatten()):
        text.set_color(dark if abs(value) >= threshold else light)

plt.rcParams.update({
    'figure.figsize': (10, 5),
    'figure.dpi': 100,
    'figure.facecolor': BACKGROUND,
    'axes.facecolor': BACKGROUND,
    'axes.spines.top': False,
    'axes.spines.right': False,
    'axes.edgecolor': MUTED,
    'axes.labelcolor': INK,
    'axes.titlesize': 13,
    'axes.titleweight': 'bold',
    'axes.titlecolor': INK,
    'xtick.color': MUTED,
    'ytick.color': MUTED,
    'font.family': 'sans-serif',
    'font.size': 10,
    'grid.color': '#f0f0f0',
    'grid.linewidth': 0.5,
})
```

---

## Reglas por tipo de gráfico

### 1. Barras — Modo A (comparación categórica, mismo signo)
La barra de mayor valor en `PURPLE`, el resto en `NEUTRAL_BAR`. Etiqueta de valor **siempre** en la punta de cada barra, en `INK` (nunca en el color de la barra — un gris de 1.4:1 de contraste es ilegible sin esa etiqueta).

⚠️ **Ojo con las métricas "menor es mejor"** (RMSE, MAE, MSE, error típico): el ganador es `idxmin()`, no `idxmax()`. Solo las métricas tipo score (accuracy, R², AUC) usan `idxmax()`.

### 2. Barras — Modo B (variación / signo real)
`POSITIVE` si el valor es ≥0, `NEGATIVE` si es <0, con `axvline(0, color=INK)`. Nunca mezclar con `PURPLE` en el mismo gráfico — el signo ya es la historia. Aplica a: coeficientes de regresión (OLS/Ridge/Lasso), odds ratios (por `< 1` / `> 1`, no por signo bruto), importancia por permutación (`permutation_importance` **sí puede dar negativo** — a diferencia de `feature_importances_`, que nunca es negativo y va siempre en Modo A), utilidades parciales de un conjoint (part-worths).

### 3. Nunca verde/rojo para identidad de categoría o de modelo
`POSITIVE`/`NEGATIVE` son exclusivos de signo real. Si dos modelos (ej. Ridge vs Lasso) o dos segmentos se comparan sin que uno sea objetivamente "positivo", usa `PURPLE` + `CONTEXT_LINES[0]` (identidad, no signo) y mantén ese mismo color para ese modelo/segmento en **todos** los gráficos del notebook.

### 4. Líneas — 1 serie
`PURPLE`. Ejemplos: método del codo, silhouette score, curva ROC de un solo modelo, scree plot (la curva acumulada es la protagonista; las barras de varianza individual van en `NEUTRAL_BAR` como contexto).

### 5. Líneas — 2 series (protagonista + contexto)
Protagonista (la serie que decide — normalmente validación/CV/mejor modelo, no train) en `PURPLE`; la otra en `NEUTRAL_LINE`.

### 6. Líneas — 3 o más series
**Nunca** metas 2+ series de contexto en el mismo `NEUTRAL_LINE` — se vuelven indistinguibles. Usa `CONTEXT_LINES[0]`, `CONTEXT_LINES[1]`, `CONTEXT_LINES[2]` en orden para las series de contexto, dejando como mucho una en `PURPLE` si hay protagonista real.

### 7. Líneas/anotaciones de referencia neutras
Diagonal "predicción perfecta", línea en y=0, curva normal teórica, umbral elegido (k óptimo, corte de dendrograma, umbral de decisión): **siempre `INK`** discontinuo. Nunca rojo/verde — son anotaciones, no señales de signo.

### 8. Histogramas EDA de una variable
`PURPLE_LIGHT` (el morado fuerte es demasiado saturado para un grid de distribuciones). Media en `INK` discontinuo, mediana en `NEUTRAL_LINE` discontinuo.

### 9. Scatter de una sola serie (sin etiquetar / EDA)
`PURPLE`, `alpha` 0.5-0.7, `edgecolor='white'` o `'k'`.

### 10. Matrices con signo real (correlación, loadings de PCA, coeficientes en heatmap)
`DIVERGING_CMAP`, `linewidths=2, linecolor=BACKGROUND`, texto con `color_annotations(ax, data.values, threshold=0.8)` (blanco solo en celdas muy extremas, tinta en el resto — nunca fijar `annot_kws={"color": "white"}` a pelo).

### 11. Matrices de magnitud sin signo (confusión, perfil de cluster normalizado)
`SEQUENTIAL_GREEN`, mismo tratamiento de `linewidths`/`color_annotations` pero con umbral adaptado a la escala real (0-1, o `valor >= max*0.6`, etc. — nunca asumas que está centrado en 0 si no lo está).

### 12. Identidad de cluster / segmento (scatter, PCA, t-SNE, dendrograma, radar, boxplot por cluster)
`CLUSTER_PALETTE[i]` en orden de índice, **más** `CLUSTER_MARKERS[i]` como marcador en cualquier scatter — nunca solo color, porque en gráficos de dispersión con 4+ categorías el color por sí solo no es seguro para daltonismo severo (validado: los pares adyacentes pasan, pero el conjunto completo no pasa el check "all-pairs" que exige un scatter). Para dendrogramas: `from scipy.cluster.hierarchy import set_link_color_palette; set_link_color_palette(CLUSTER_PALETTE)` antes de `dendrogram(...)`, y `above_threshold_color=INK`.

**Regla de oro:** si un cluster/segmento/modelo aparece en más de un gráfico del mismo notebook, debe llevar siempre el mismo color en todos ellos — nunca reasignar colores gráfico a gráfico.

### 13. SOM (Self-Organizing Maps) — U-Matrix, mapa de frecuencia, component planes
Son visualizaciones técnicas de intensidad neutra (distancia entre neuronas, recuento de registros por neurona/BMU, valor bruto de una variable por neurona): no tienen lectura de signo ni de "bueno/malo", así que **nunca** usan `SEQUENTIAL_GREEN` (reservado para métricas con lectura real de resultado, ej. matriz de confusión, perfil de cluster). Usan una escala secuencial neutra dedicada:

```python
SEQUENTIAL_PURPLE = LinearSegmentedColormap.from_list(
    "borja_sequential_purple", [BACKGROUND, PURPLE]
)
```

- **U-Matrix** (`som.distance_map()`): `SEQUENTIAL_PURPLE`. Más distancia = frontera entre clusters.
- **Mapa de frecuencia** (recuento de registros por neurona/BMU): `SEQUENTIAL_PURPLE`.
- **Component planes** (valor medio de una variable por neurona, uno por variable): `SEQUENTIAL_PURPLE`.
- **Mapa de segmentos** (K-Means sobre los pesos del SOM): identidad de cluster → `ListedColormap(CLUSTER_PALETTE[:k])`, regla 12.
- **Categoría real superpuesta al mapa SOM o a una proyección PCA** (ej. posición real de un jugador): identidad de categoría → `CLUSTER_PALETTE[i]` + `CLUSTER_MARKERS[i]`, mismo color en todos los gráficos del notebook que usen esa misma categoría (regla de oro).

---

## Accesibilidad — ya validado, no hace falta repetir el cálculo

- `PURPLE`, `POSITIVE` sobre `BACKGROUND`: ~3.3–4.1:1 → válidos como **relleno** (barra, punto), no como texto pequeño.
- `NEGATIVE` sobre `BACKGROUND`: 4.95:1 → válido incluso como texto.
- `NEUTRAL_BAR` sobre `BACKGROUND`: 1.4:1 → relleno silencioso, exige etiqueta de valor visible (regla 1).
- `POSITIVE` ↔ `NEGATIVE`: ΔE 5.1 en deuteranopia (por debajo del suelo de 6) pero ΔE 19.4 en visión normal. **Nunca codifiques signo solo con color** — añade siempre icono (▲/▼) o etiqueta directa.
- `CLUSTER_PALETTE`: pasa el check de pares adyacentes (ΔE ≥ 8 CVD, ≥ 15 visión normal) en el orden dado — no reordenar la lista sin volver a validar. No pasa el check "todos contra todos" propio de scatter con 4+ categorías; por eso `CLUSTER_MARKERS` es obligatorio ahí, no opcional.

---

## Estado de la migración

| Carpeta | Estado | Notas |
|---|---|---|
| `01-supervisado/clasificacion/` | ✅ Migrada | 12 notebooks |
| `01-supervisado/regresion/` | ✅ Migrada | 8 notebooks |
| `02-no-supervisado/clustering/` | ✅ Migrada | 9 notebooks |
| `02-no-supervisado/reduccion-dimensionalidad/` | ✅ Migrada | 2 notebooks |
| `03-redes-neuronales/` | ✅ Migrada | mlp (4 notebooks), som (2 notebooks) |
| `04-series-temporales/` | ⬜ Pendiente | arima |
| `05-aprendizaje-por-refuerzo/` | ⬜ Pendiente | sarsa |

## Casos especiales ya resueltos (para no volver a decidirlos)

- **Random Forest / permutación negativa**: `feature_importances_` (Gini/gain) siempre ≥0 → Modo A. `permutation_importance` puede ser negativo → Modo B, aunque esté en el mismo panel doble que el Gini.
- **Ridge vs Lasso**: identidad de modelo, no signo → `PURPLE` (Ridge) + `CONTEXT_LINES[0]` (Lasso), mismo color en el gráfico de coeficientes y en el scatter real-vs-predicho.
- **Conjoint (utilidades parciales)**: el nivel de referencia (utilidad = 0 por definición) va en `NEUTRAL_BAR`; el resto por signo real (`POSITIVE`/`NEGATIVE`).
- **Heatmap centrado en un valor ≠ 0** (ej. perfil de cluster como ratio vs media global, `center=1`): el `threshold` de `color_annotations` tiene que calcularse sobre la desviación respecto a ese centro (`valores - 1`), nunca sobre el valor bruto — si no, el texto puede quedar oscuro sobre relleno oscuro.
- **Boxplot con `hue` que no es el cluster** (ej. compara dos variables dentro de cada cluster, no clusters entre sí): no le apliques `CLUSTER_PALETTE` — usa `[PURPLE, NEUTRAL_LINE]` como en cualquier comparación de 2 series.
- **Dos líneas de corte candidatas en un dendrograma** (ej. k=3 elegido y k=5 alternativo): la elegida en `INK` sólido, la alternativa en `NEUTRAL_LINE` discontinuo — nunca las dos en rojo/naranja.
- **Target binario con lectura de negocio real** (ej. `Aprobado`/`Rechazado`, `Requiere_reemplazo`): aunque sea la "identidad" de una categoría en un scatter o una barra de distribución, si una clase es objetivamente el desenlace bueno y la otra el malo, se trata como signo real → `POSITIVE`/`NEGATIVE`, no como identidad neutra. Distinto de clases sintéticas sin lectura de negocio (ej. `make_circles`, XOR), que sí son identidad pura → `PURPLE` + `CONTEXT_LINES[0]`.
- **Comparativa de 3+ modelos en el mismo gráfico** (ej. MLP vs Regresión Lineal vs Random Forest, tanto en scatter real-vs-predicho como en barra de métrica): es identidad de modelo, nunca signo → el protagonista en `PURPLE`, el resto en `CONTEXT_LINES[0]`, `CONTEXT_LINES[1]`... en el mismo orden en todos los gráficos del notebook donde aparezcan esos modelos (regla de oro).
- **Segunda métrica en un eje secundario (`twinx`)** que no es la serie protagonista (ej. R² de validación superpuesto al loss de entrenamiento): no es signo ni identidad de cluster → trátala como serie de contexto, `CONTEXT_LINES[0]`.
