# Big Data Distribuido

Procesamiento de datos con **Apache Spark**: el motor que reparte datos y cómputo entre varias
máquinas cuando un dataset deja de caber en la memoria de una sola. A diferencia del resto del
portfolio —donde pandas y scikit-learn resuelven el problema sobre una máquina— aquí el objeto
de estudio es el **motor**: cómo planifica, dónde mueve datos y qué patrones de código escalan
de un portátil a un clúster sin cambiar una línea.

El criterio que atraviesa la categoría es **medir en lugar de asumir**: cada recomendación de
rendimiento (esquema explícito, `cache`, funciones nativas frente a UDF, formato columnar) va
acompañada de su medición, incluidas las que salen en contra de lo esperado.

## Proyectos

| # | Caso | Qué se aprende |
|---|------|-----------------|
| 1 | [Pipeline de ventas distribuido con PySpark](01-pipeline-ventas-pyspark/) | Esquema como contrato, Spark SQL, funciones de ventana, broadcast joins, planes de ejecución, particiones y caché, UDF vs nativo, Parquet, MLlib y una fuga de datos de manual |

## Stack
`pyspark` 3.5 (Spark SQL · Window functions · MLlib) · `pandas` · `pyarrow` · `matplotlib`

## Requisitos
Spark corre sobre la **JVM**: hace falta un JDK 8, 11 o 17 instalado. En **Windows** se necesita
además `winutils.exe` con `HADOOP_HOME` definido para la E/S de ficheros locales; en Linux,
macOS, WSL2, Databricks o Microsoft Fabric no aplica. Cada caso detalla sus requisitos en su
propio README.

---

[Volver a IA & Big Data](../README.md)
