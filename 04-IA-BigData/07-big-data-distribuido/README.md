# Big Data Distribuido

Procesamiento de datos con **Apache Spark**, el motor que reparte datos y cálculo entre varias
máquinas cuando un dataset ya no cabe en la memoria de una sola. En el resto del portfolio pandas
y scikit-learn resuelven el problema en un solo ordenador. Aquí lo que estudio es el **motor**:
cómo planifica, cuándo mueve datos de un sitio a otro y qué código pasa de un portátil a un
clúster sin cambiar una línea.

La regla que sigo en toda la categoría es **medir antes de afirmar**. Cada recomendación de
rendimiento (esquema explícito, `cache`, funciones nativas frente a UDF, formato columnar) va con
su medición, también cuando el resultado no es el que esperaba.

## Proyectos

| # | Caso | Qué se aprende |
|---|------|-----------------|
| 1 | [Pipeline de ventas distribuido con PySpark](01-pipeline-ventas-pyspark/) | Esquema como contrato, Spark SQL, funciones de ventana, broadcast joins, planes de ejecución, particiones y caché, UDF vs nativo, Parquet, MLlib y una fuga de datos de manual |

## Stack
`pyspark` 3.5 (Spark SQL · Window functions · MLlib) · `pandas` · `pyarrow` · `matplotlib`

## Requisitos
Spark funciona sobre la **JVM**, así que hace falta un JDK 8, 11 o 17. En **Windows** además
hay que tener `winutils.exe` y `HADOOP_HOME` definido para leer y escribir ficheros locales; en
Linux, macOS, WSL2, Databricks o Microsoft Fabric no hace falta. Cada caso explica sus requisitos
en su propio README.

---

[Volver a IA & Big Data](../README.md)
