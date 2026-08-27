# Pipeline de ventas distribuido con PySpark

## Contexto de negocio
Una cadena de retail tecnológico con presencia en 8 ciudades españolas acumula un histórico de ventas (2022–2024) que ha crecido hasta un volumen en el que los análisis mensuales en Excel y pandas tardan más que la reunión en la que se presentan. Antes de mover el proceso a un lakehouse (Databricks / Microsoft Fabric), hay que validar el pipeline completo en local con el mismo motor que se usará en producción.

La pregunta no es solo qué productos y ciudades concentran el ingreso, sino **qué patrones de código hay que fijar ahora para que el mismo notebook siga funcionando cuando el dataset sea 1.000 veces mayor**.

## Dataset
`ventas_grandes.csv` — 203.533 operaciones de venta (2022-01-01 a 2024-09-27), 11,2 MB.
Columnas: `IdVenta`, `Fecha`, `Producto` (10), `Categoria` (4), `Ciudad` (8), `Precio`, `Cantidad`.

## Técnicas aplicadas
- **Lectura tipada:** `inferSchema` frente a esquema explícito con `StructType` como contrato de datos
- **Calidad de datos:** nulos, duplicados, cardinalidad, `fillna`, `when/otherwise`, marcado en vez de borrado
- **Agregaciones:** `groupBy().agg()` multimétrica, `pivot`, conteo aproximado con HyperLogLog
- **Spark SQL:** `createOrReplaceTempView` + consultas con CTE — mismo plan físico que la API de DataFrames
- **Funciones de ventana:** `rank`, total acumulado, `lag` para variación intermensual, media móvil
- **Joins:** `broadcast` para dimensiones pequeñas, `left_anti` para auditar integridad referencial
- **Motor:** evaluación perezosa, lectura de planes con `explain()`, transformaciones *narrow* vs *wide*, `Exchange`/shuffle
- **Rendimiento:** particiones, `repartition` vs `coalesce`, `cache()`, UDF vs funciones nativas vs `pandas_udf`
- **Formatos:** CSV frente a Parquet columnar particionado, *partition pruning*
- **MLlib:** `Pipeline` con `StringIndexer` → `OneHotEncoder` → `VectorAssembler` → `LinearRegression`

## Hallazgo clave

> **El dataset no contiene ninguna señal, y el notebook lo reporta así.** Los ingresos se reparten casi uniformemente entre las 4 categorías y las 8 ciudades, el producto líder de cada categoría tiene un **10,4 %** de cuota frente al **10 %** de un reparto perfectamente equitativo, la variación mensual es indistinguible del ruido y la correlación entre precio y cantidad es de **0,0007**. Es un generador de datos aleatorios. Lo que queda validado es el pipeline, que era el objetivo.

La sección de MLlib construye ese diagnóstico sobre una **fuga de datos deliberada**, porque es el error más fácil de cometer y el más difícil de ver:

| Modelo | Variable objetivo | R² | Lectura |
|---|---|---|---|
| A | `Importe` | **0,8714** | Parece un buen modelo. No lo es: `Importe = Precio × Cantidad`, es decir, la respuesta está entre las preguntas |
| B | `Importe` + interacción `Precio × Cantidad` | **1,0000** | RMSE = 0,00 €. La prueba de que no es un modelo, es una fórmula |
| C | `Cantidad` (planteamiento honesto) | **-0,0001** | RMSE 2,88 uds, idéntico a predecir siempre la media. No hay nada que predecir |

## Mediciones

El notebook mide en lugar de afirmar, e incluye **dos resultados que salen en contra de la recomendación de manual** — precisamente por eso merece la pena medir:

| Comparación | Resultado |
|---|---|
| `StructType` frente a `inferSchema` | Entre **4x y 5x** más rápido (una pasada sobre el fichero en vez de dos) |
| UDF de Python frente a funciones nativas | La UDF es **~15x más lenta** sobre 203.533 filas |
| `cache()` sobre una carga de 4 consultas | Cerca de **2x** más rápido al no reparsear el CSV cuatro veces |
| Parquet frente a CSV | **3,6x** menos espacio (11,19 MB → 3,13 MB) |
| `approx_count_distinct` frente al conteo exacto | ⚠️ **Más lento**, con un 2 % de error: a 203.533 filas y 3 particiones, HyperLogLog no se amortiza |
| `pandas_udf` frente a UDF clásica | ⚠️ **No mejora**: la conversión a Arrow no se amortiza a este volumen |

Ambas optimizaciones son reales, pero a una escala que este dataset no alcanza. **Una optimización solo lo es a la escala para la que fue diseñada.**

## Stack
PySpark 3.5 (Spark SQL, funciones de ventana, MLlib) · pandas · pyarrow · Matplotlib

## Requisitos de entorno
- **Java (JDK 8, 11 o 17)** es obligatorio: Spark corre sobre la JVM. El notebook localiza el JDK automáticamente si no está en el `PATH`.
- **En Windows hace falta `winutils.exe`** con `HADOOP_HOME` definido. Sin él, la creación de la `SparkSession` falla de forma intermitente (basta reejecutar la celda) y **cualquier `df.write` o `spark.read.parquet` sobre ruta local falla siempre** con `UnsatisfiedLinkError: NativeIO$Windows.access0`. Por eso la sección 13 escribe el Parquet con `pyarrow`, que no depende de Hadoop, dejando documentado el código equivalente de Spark. En **Linux, macOS, WSL2, Databricks o Fabric** ninguna de las dos limitaciones existe.

## Notas

Este caso nació de un ejercicio de exploración de PySpark cuya primera versión contenía un bug que merece quedar documentado, porque es de los que no dan ningún síntoma:

```python
.option("inferShema", True)   # inferSchema, no inferShema
```

**Spark ignora en silencio cualquier opción cuyo nombre no reconoce.** No hay excepción ni warning: las 7 columnas se leían como texto y `describe()` devolvía estadísticos comparados alfabéticamente — precio máximo **999,99 €** en lugar de **2.000,00 €**, cantidad máxima **9** en lugar de **10**, `IdVenta` máximo **99.999** en lugar de **203.533**. Lo peligroso es que el filtro `col("Precio") > 1000` **sí funcionaba**, porque Spark hace un *cast* implícito al comparar texto con número: parte del código acertaba y parte mentía. La sección 2 del notebook reproduce el error a propósito antes de corregirlo.

La versión final corrige además cuatro problemas de patrón: `from pyspark.sql.functions import sum, avg` (sobrescribe las funciones nativas de Python), dos `toPandas()` sobre el DataFrame completo (203.533 filas al driver, y el fichero leído dos veces), un `scatter` de 203.533 puntos ilegible, y `spark.sql.shuffle.partitions` en su valor por defecto de 200 para un dataset local.

---

[Volver a Big Data Distribuido](../README.md) · [Volver a IA & Big Data](../../README.md)
