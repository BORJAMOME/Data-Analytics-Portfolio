# SVM — Propensión de compra de iPhone

Support Vector Classifier con kernel lineal, polinómico y RBF, para un caso en el que la frontera entre comprar y no comprar no es una recta.

---

## Contexto de negocio

Un e-commerce de tecnología quiere saber qué clientes tienen más papeletas de comprar un iPhone, usando sus ingresos y su fidelidad a la marca. Como la frontera entre comprar y no comprar no es lineal, pruebo el mismo problema con tres kernels.

## Dataset

Sintético (233 clientes): Score_Fidelidad, Ingresos_Mensuales y Compra_iPhone (target binario, 36,5% de compradores).

## Técnicas aplicadas

- SVC con 3 kernels (lineal, polinómico y RBF) y comparación entre ellos
- Estandarización, que en SVM no es opcional
- `classification_report` (precision, recall, f1-score) para evaluar cada kernel
- Visualización de la frontera de decisión sobre los datos originales

## Hallazgo clave

> Gana el kernel polinómico de grado 2, con un 98% de accuracy, por delante del RBF (97%) y el lineal (93%). Los kernels no lineales recogen mejor cómo se combinan ingresos y fidelidad para separar a quien compra de quien no. Con 233 clientes sintéticos y dos variables, lo tomo como un ejercicio y no como un modelo para producción.



