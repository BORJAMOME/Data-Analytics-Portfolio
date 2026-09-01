# SVM — Propensión de compra de iPhone

Support Vector Classifier con kernels linear, polynomial y RBF: cuando la frontera entre comprar y no comprar no es una recta.

---

## Contexto de negocio

Un e-commerce de tecnología quiere anticipar qué clientes son propensos a comprar un iPhone a partir de sus ingresos y su fidelidad tecnológica. La frontera entre "compra" y "no compra" no es lineal — se compara el mismo problema con tres kernels distintos.

## Dataset

Sintético (233 clientes): Score_Fidelidad, Ingresos_Mensuales y Compra_iPhone (target binario, 36,5% de compradores).

## Técnicas aplicadas

- SVC con 3 kernels (linear, polynomial, RBF) + comparativa
- Estandarización obligatoria para SVM
- `classification_report` (precision, recall, f1-score) para evaluar cada kernel
- Visualización de la frontera de decisión sobre los datos originales

## Hallazgo clave

> El kernel polinómico (grado 2) obtiene el mejor resultado, con un 98% de accuracy, seguido del RBF (97%) y el lineal (93%). Los kernels no lineales capturan mejor la combinación entre ingresos y fidelidad que separa a compradores de no compradores.

## Notebooks relacionados

- [SVM — Baterías](../02-reemplazo-baterias/) — SVM aplicado a mantenimiento predictivo
- [Gradient Boosting](../../../regresion/04-gradient-boosting/) — modelo ensemble como alternativa


