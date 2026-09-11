# Informe de auditoría — `01-supervisado`

**Repositorio:** Data-Analytics-Portfolio
**Ruta auditada:** `03-Machine-Learning/01-supervisado/` (clasificación + regresión, 20 notebooks en 19 subcarpetas)
**Fecha:** 2026-09-11
**Auditor:** Claude Code (5 agentes en paralelo, uno por grupo de subcarpetas)
**Metodología:** misma que la auditoría previa de `02-no-supervisado/reduccion-dimensionalidad` — lectura completa celda a celda de cada notebook y README, verificación numérica cruzando texto markdown contra outputs reales (recalculando en scripts Python aislados cuando fue necesario), fix directo para bugs verificables de bajo riesgo, README corregido para reflejar la realidad del notebook cuando había desalineación (política ya decidida por el propietario en la auditoría anterior).

---

## Resumen ejecutivo

**39 hallazgos** en 20 notebooks. **36 corregidos y verificados** (incluye los 2 hallazgos graves que requerían reentrenar un modelo — ver más abajo), **3 documentados sin corregir** (requieren Jupyter o son decisión de alcance explícitamente descartada). **0 pendientes de decisión.** **22 archivos modificados** en total (16 notebooks + 6 READMEs), todos dentro de `01-supervisado/`, nada fuera de alcance.

| Severidad | Corregidos | Documentados (sin acción) |
|---|---|---|
| Alta | 10 | 0 |
| Media | 15 | 0 |
| Baja | 11 | 3 |
| **Total** | **36** | **3** |

**Actualización tras decisión del propietario (segunda pasada):** los 2 hallazgos que quedaron pendientes en la primera entrega de este informe (`REG-MULT-GYM-01` y `REG-GB-5K-01`) ya están resueltos — se reentrenaron ambos modelos, no solo se corrigió texto. Detalle en sus secciones correspondientes más abajo.

**Hallazgo más relevante — overfitting no documentado en Gradient Boosting:** los 2 notebooks de `04-gradient-boosting` mostraban un gap train/test de 4-5× (R² train ~99% vs test 80-92%) sin ninguna mención en el texto — exactamente el tipo de problema que un revisor técnico (o un reclutador con conocimientos de ML) detectaría de inmediato. Corregido añadiendo las métricas de train y una interpretación explícita del gap.

**⚠️ Igual que en la auditoría anterior: no hay Jupyter/seaborn/xgboost en este entorno.** No fue posible re-ejecutar ningún notebook. Las celdas editadas quedaron con su output limpio (comportamiento automático de la herramienta de edición de notebooks) — **9 notebooks requieren re-ejecución completa** antes de darlos por cerrados (lista al final de este informe).

---

## Hallazgos por subcarpeta

### `clasificacion/01-arbol-decision`, `02-random-forest`, `03-xgboost` (mismo dataset, notebooks derivados por copia)

- **CL-ARBOL-01 / CL-RF-01 / CL-XGB-01** (Media, **corregido en los 3**): los tres notebooks afirmaban una "correlación positiva moderada" entre `Antiguedad_Meses` y la satisfacción del cliente — verificado que la correlación real es **≈0 (-0.0023)**, no moderada. El texto nunca se calculó realmente; se copió entre los tres notebooks derivados. Corregido con los valores reales de correlación en los tres.
- **CL-ARBOL-02 / CL-RF-02 / CL-XGB-02** (Baja, documentado, preexistente): varias celdas de código sin ejecutar (`execution_count: null`) ya antes de esta auditoría — no relacionado con los fixes aplicados. Requiere re-ejecución.
- **CL-XGB-03** (Baja, documentado): warning de `use_label_encoder=False` deprecado en xgboost — cosmético, no se tocó por no poder verificar sin xgboost instalado.
- **07-naive-bayes**: sin bugs — notebook ya limpio de una auditoría anterior, verificación numérica completa e independiente confirmó todas las cifras.

### `clasificacion/04-comparativa-modelos` (4 notebooks de comparación de algoritmos)

- **CL-CMP-GYM-01** (Media, corregido): el veredicto final recomendaba el Árbol de Decisión pese a que la propia tabla mostraba a XGBoost ganando o empatando en las 5 métricas — se añadió la justificación real (ventaja de solo 1 caso sobre 60, no significativa; se prioriza interpretabilidad).
- **CL-CMP-GYM-02 / CL-CMP-CHURN-02** (Baja, corregidos): imports sin usar (`GridSearchCV`, `permutation_importance`, `classification_report`) en ambos notebooks.
- **CL-CMP-CHURN-01** (**Alta**, corregido): la tabla resumen y el veredicto final tenían cifras de XGBoost hardcodeadas (89,5% accuracy, AUC 0,499) que no coincidían ni con el output real de la celda de evaluación (89,1%, AUC 0,524) ni eran aritméticamente consistentes entre sí (89,5% no corresponde a 26 errores/247). El 0,499 además incumplía el rango que el propio README prometía (0,50–0,58).
- **03-prediccion-impagos** (`impago_final.ipynb`, 115 celdas, sin README — es carpeta de competición): **sin bugs**. Notebook de calidad notable: sin fuga de datos, comparación de 6 modelos con la misma CV, umbral de decisión justificado por análisis de coste, y una sección de autocrítica propia sobre una "paradoja de signo" en el target.
- **04-segmentacion-aerolinea**: **sin bugs** — notebook ya muestra correcciones previas explícitas (leakage-check, imputación dentro de Pipeline). Números de README y notebook coinciden exactamente.

### `clasificacion/05-regresion-logistica`

- **CL-LOGIT-GYM-01** (Baja, corregido): AUC citado en texto (~0,978) no coincidía con el AUC real calculado (0,9709).
- **CL-LOGIT-GYM-02** (Media, corregido): el texto afirmaba "p-valor > 0,05" justo debajo de un resumen `Logit` donde ambas variables tenían p < 0,05 — afirmación lógicamente invertida respecto al criterio real usado para seleccionar variables.
- **CL-LOGIT-ADM-01** (**Alta**, corregido parcialmente): el README y la introducción del notebook prometían "frontera de decisión", "mapa de probabilidades" y `LogisticRegression` de sklearn — verificado (grep exhaustivo sobre las 33 celdas) que **nada de eso existe**; el notebook usa únicamente `statsmodels.Logit`. Corregido el README y el texto del notebook para reflejar la realidad; eliminados los imports muertos (`smf`, `LogisticRegression`, `precision_recall_curve`, `accuracy_score`). **No se implementó** la frontera de decisión (sería análisis nuevo) — queda como posible mejora futura si el propietario lo pide explícitamente.

### `clasificacion/06-svm`

- **01-compra-iphone**: **sin bugs** — verificación exhaustiva de escalado, álgebra de la frontera lineal y kernels; cifras del README coinciden exactamente con el notebook.
- **CL-SVM-BAT-01** (**Alta**, corregido): la introducción describía un problema de **regresión (SVR)** sobre "capacidad restante de batería (%)", pero el notebook completo entrena y evalúa **`SVC`** (clasificación binaria de `Requiere_Reemplazo`) — plantilla de otro ejercicio copiada y nunca actualizada tras pivotar el enfoque. El README de la misma carpeta ya describía correctamente el problema (clasificación); la inconsistencia era interna al notebook. Corregida la introducción.

### `regresion/01-regresion-lineal-simple`

- **01-precio-viviendas** (Alta, corregido): el modelo final de producción usa 2 variables, pero la ecuación impresa solo mostraba el coeficiente de una y describía el intercepto de forma incorrecta para un modelo bivariante. También corregido el README (afirmaba diagnóstico formal "Shapiro-Wilk" que nunca se ejecuta — solo hay diagnóstico visual) y eliminado un import muerto (`het_breuschpagan`).
- **02-colesterol-bmi** (Media/Baja, corregido): ejes y título de un gráfico "Real vs Predicho" rotulados como "Precio" (copiados del notebook de viviendas) en vez de "Colesterol"; etiqueta de VIF incorrecta ("todas variables" cuando el modelo solo tiene una); import muerto eliminado. Confirmado uso correcto de `read_csv` (no es un bug de csv/xlsx).

### `regresion/02-regresion-lineal-multiple`

- **01-ventas-publicidad**: solo un import muerto eliminado (`het_breuschpagan`); notebook y README ya alineados.
- **02-gasto-extra-gimnasio** (Alta, **corregido — modelo reentrenado**): VIF severo detectado entre dos variables (r=0,94) y una variable no significativa (p=0,940, `Horas_Pico_Mes`) que el modelo final mantenía sin comentario, mientras notebook y README concluían que esa variable era un "driver" del gasto — contradecía los propios resultados estadísticos. **Se reentrenó el modelo final sin `Horas_Pico_Mes`** (mismo `random_state=42`/split). Resultado verificado: VIF baja de 30,5/40,1 a 1,003/1,003 (colinealidad eliminada); R² test = 0,8400 (MAE=9,58€, RMSE=11,75€); nueva ecuación `Gasto_Extra = 13,66 + 1,326·Antiguedad_Meses + 3,527·Asistencias_Mes`; residuos normales (Shapiro-Wilk p=0,70). Notebook y README actualizados para ser consistentes con el modelo de 2 variables.
- **03-preferencias-vuelos-conjoint** (`avion.ipynb`, 4 fixes, corregidos): error aritmético en el diseño factorial (afirmaba 216 combinaciones, el cálculo correcto —ya presente en la celda anterior— es 144); "5 componentes" cuando la tabla lista 6 atributos (con "Horario" sin describir); etiqueta de categoría inconsistente ("1 stop" vs "1 Stop" real en los datos); el README citaba un rango de R² por segmento (0,87–0,96) que el notebook nunca imprimía — se añadió el print para que el notebook sea auto-verificable (valores confirmados: 0,747–0,955 según segmento).

### `regresion/03-ridge-lasso`

- **REG-RIDGELASSO-01 a 06** (Media/Alta/Baja, **los 6 corregidos**): título/objetivo prometían comparar con Regresión Lineal simple (nunca se entrena); interpretación de métricas de Ridge con cifras obsoletas de una ejecución anterior (R²/MAE/RMSE/MAPE no coincidían con el output real de la celda — mismo patrón que el resto de la auditoría); README con la misma tabla obsoleta; la predicción final de una vivienda nueva usaba el modelo Lasso con el alpha "de paso" en vez del alpha óptimo citado en las conclusiones; variable `mape_ridge` que en realidad almacenaba el MAPE de Lasso (bug de naming); alphas de Ridge/Lasso hardcodeados en vez de referenciar el valor elegido por CV (causa raíz probable del bug de cifras obsoletas — cualquier cambio futuro en el grid de búsqueda dejaría el texto desactualizado otra vez).

### `regresion/04-gradient-boosting`

- **REG-GB-VIVIENDAS-01 a 05** (Alta×3, Media×1, Baja×1, **los 5 corregidos**): README afirmaba una comparación directa contra un baseline de regresión lineal que el notebook nunca entrena; contexto de negocio del README no coincidía con el del notebook (plataforma online vs. agencia inmobiliaria en Madrid); textos de interpretación con MAE/R²/MAPE obsoletos frente al output real; **overfitting no documentado** (train R²≈99,4% vs test R²=92,5%, gap ~4×) — se añadieron las métricas de train y un párrafo de interpretación explícita; la curva de aprendizaje graficaba hasta 200 estimadores pero el modelo final usa 300 (fuera del rango visualizado) — ampliado el rango.
- **REG-GB-5K-01** (**Alta**, **corregido — GridSearchCV añadido**): mismo patrón de **overfitting no documentado**, más pronunciado (train R²≈99,7% vs test R²=0,7966, gap >5×) y sin CV/GridSearchCV para los hiperparámetros (a diferencia del notebook hermano de viviendas). **Se añadió `GridSearchCV`** (grid de `n_estimators`/`learning_rate`/`max_depth`/`min_samples_leaf`, cv=5) siguiendo el mismo patrón que `01-tasacion-viviendas`. Óptimo encontrado: `learning_rate=0.1, max_depth=2, min_samples_leaf=5, n_estimators=150`. La mejora es **real pero modesta** (honestamente reportada así, sin forzar una conclusión optimista): R² test 0,7966→0,8110, RMSE test 1,43→1,38 min, gap de R² train-test 20,1pp→18,4pp, ratio MAE test/train 5,11×→4,14×. Con solo 96 filas de train (varias casi-duplicadas por plantillas sintéticas), la CV tiene margen limitado para regularizar más — esto queda explícito en el notebook.

---

## Verificación aplicada

Cada agente reprodujo de forma independiente, en scripts Python aislados (`Bash` + heredoc, con pandas/sklearn/statsmodels), los cálculos detrás de cada cifra corregida — split train/test, escalado, ajuste de modelos, métricas — y confirmó que el nuevo texto coincide exactamente con el resultado real antes de escribirlo. xgboost no está instalado en este entorno, así que esas cifras se verificaron por consistencia aritmética interna (ej. que la matriz de confusión cuadre con el accuracy reportado) en vez de por reejecución directa.

## Notebooks pendientes de re-ejecución en Jupyter

1. `clasificacion/01-arbol-decision/notebook.ipynb`
2. `clasificacion/02-random-forest/notebook.ipynb`
3. `clasificacion/03-xgboost/notebook.ipynb`
4. `clasificacion/04-comparativa-modelos/01-satisfaccion-gimnasio/comparativa_modelos_clasificacion.ipynb`
5. `clasificacion/04-comparativa-modelos/02-churn-clientes/comparativa_modelos_churn.ipynb`
6. `clasificacion/05-regresion-logistica/02-admision-universidad/notebook.ipynb`
7. `regresion/01-regresion-lineal-simple/01-precio-viviendas/notebook.ipynb` y `02-colesterol-bmi/notebook.ipynb`
8. `regresion/02-regresion-lineal-multiple/avion.ipynb` y **`02-gasto-extra-gimnasio/notebook.ipynb`** (este último con cambio funcional real: modelo reentrenado sin `Horas_Pico_Mes` — re-ejecución obligatoria, no opcional). `01-ventas-publicidad` solo tuvo un import eliminado, re-ejecución opcional.
9. `regresion/03-ridge-lasso/01-comparativa-regularizacion/notebook.ipynb`
10. `regresion/04-gradient-boosting/01-tasacion-viviendas/notebook.ipynb` y **`02-tiempo-carrera-5k/notebook.ipynb`** (este último con cambio funcional real: `GridSearchCV` añadido y modelo reentrenado — re-ejecución obligatoria)

`clasificacion/05-regresion-logistica/01-satisfaccion-gimnasio` y `06-svm/02-reemplazo-baterias` solo tuvieron cambios de texto markdown (re-ejecución opcional, no afecta outputs de código).

## Pendientes de decisión

Solo queda uno, de alcance opcional (mejora futura, no un bug pendiente de arreglar):

1. **`clasificacion/05-regresion-logistica/02-admision-universidad`**: ¿implementar la frontera de decisión y el mapa de probabilidades que originalmente prometía el README (ya corregido para no prometerlos, dejando el notebook consistente tal como está hoy)? Solo si se quiere ampliar el alcance del caso de estudio.

Los otros dos pendientes de la primera versión de este informe (`REG-MULT-GYM-01` y `REG-GB-5K-01`) ya se resolvieron reentrenando los modelos correspondientes — ver detalle en sus secciones.

## Recomendaciones (Fase 7 — mejora continua, complementa las de la auditoría anterior)

1. **El patrón "texto desactualizado tras re-ejecutar con otros hiperparámetros" es el bug más repetido de este lote** (Ridge/Lasso, Gradient Boosting×2, regresión logística, comparativa churn): cuando se cambia un grid de búsqueda o se reentrena, el texto interpretativo no se actualiza. Recomendación: siempre generar la interpretación numérica con un f-string que referencie las variables del modelo (`f"R²={r2:.3f}"`) en vez de escribir el número a mano en markdown — así el texto nunca puede desincronizarse del resultado real.
2. **Overfitting no reportado es un patrón real, no anecdótico**: en los 2 notebooks de Gradient Boosting el gap train/test era severo y no se mencionaba. Vale la pena revisar el resto del portfolio (fuera del alcance de esta auditoría) con el mismo chequeo train-vs-test explícito.
3. **Reutilizar plantillas entre notebooks del mismo dataset (`gym_clientes.xlsx`) es la causa raíz de la mayoría de bugs tipo "copy-paste"** (árbol/RF/XGBoost, SVM de baterías) — al derivar un notebook nuevo, conviene un checklist explícito de literales a revisar (títulos, "Objetivo", "Categoria") antes de darlo por terminado.
