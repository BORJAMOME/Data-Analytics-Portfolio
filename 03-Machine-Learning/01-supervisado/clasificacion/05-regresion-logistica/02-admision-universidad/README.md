# Regresión Logística — Admisión universitaria

Con solo dos variables, el modelo clasifica bien al 99% de los candidatos. Es un buen ejemplo de regresión logística que predice y a la vez se puede explicar, aunque con un resultado tan limpio hay que sospechar de los datos (lo comento abajo).

---

## Contexto de negocio

Un departamento de admisiones recibe miles de solicitudes en cada convocatoria y quiere un scoring que estime la probabilidad de admisión solo con las horas de estudio y la nota del examen de acceso.

## Objetivo

Ajustar una regresión logística con `statsmodels`, interpretar sus coeficientes con odds ratios e intervalos de confianza y evaluar cuánto acierta.

## Dataset

`admitidos.xlsx`

1.140 candidatos con las siguientes variables:

**Variables predictoras**

- `Horas_estudio`
- `Nota_examen`

**Variable objetivo**

- `Admitido` (clasificación binaria)

## Técnicas aplicadas

- **statsmodels.Logit** para inferencia estadística y predicción
- Interpretación mediante **Odds Ratio** e intervalos de confianza
- Diagnóstico de multicolinealidad con **VIF**
- Curva ROC
- Matriz de confusión
- Evaluación mediante Accuracy, Recall, F1-score y AUC-ROC

## Hallazgo clave

El modelo llega a un 99% de accuracy y un AUC-ROC de 0,999: separa casi a la perfección a admitidos y no admitidos. Lo que más pesa es la nota del examen. Las horas de estudio dejan de ser significativas porque están correlacionadas a 0,987 con la nota y dicen prácticamente lo mismo.

Un resultado tan perfecto apunta a que la admisión se decide casi con un corte en la nota. statsmodels, de hecho, avisa de cuasi-separación.

## Lectura de negocio

La probabilidad de admisión depende sobre todo del examen: cada punto más multiplica por 2,14 las odds de entrar. Con eso se puede montar un scoring transparente y fácil de meter en el proceso de admisiones.

## Librerías principales

- `pandas`
- `matplotlib`
- `seaborn`
- `scikit-learn`
- `statsmodels`

