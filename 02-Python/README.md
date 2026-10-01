# Python — Análisis Exploratorio y Fundamentos

> Casos de negocio y manuales de referencia que hice durante el Bootcamp de Data Analytics
> en [Neoland](https://www.neoland.es/) (mayo a julio de 2026). Cada caso arranca con una
> pregunta concreta y acaba con recomendaciones que alguien podría poner en marcha.

**Autor:** [Borja Mora Méndez](https://www.linkedin.com/in/borjamoramendez/) · Madrid, 2026

---

## Cómo están hechos

Los casos de análisis exploratorio siguen siempre el mismo orden. Primero el contexto de
negocio, sin hablar todavía de código. Luego las preguntas que haría alguien de dirección.
Después la limpieza, explicando cada decisión: por qué imputar en vez de eliminar, por qué
rellenar con 0 y no con la media, qué hacer cuando toca dividir entre cero. Y al final,
recomendaciones y las limitaciones del análisis, que casi siempre las hay.

Hay 4 casos de sectores distintos (comercial, educación, seguros y restauración) y 4
manuales de referencia: Matplotlib, NumPy y dos de Pandas. Los manuales siguen la misma
pauta en cada concepto: explicación, analogía, código, error típico, uso profesional y
ejercicio.

---

## Stack técnico

```
Python 3.10 · pandas · NumPy · Matplotlib · Seaborn
```

---

## Por dónde empezar

| # | Caso | Por qué destaca |
|---|---|---|
| 1 | [Riesgo cardiovascular en una aseguradora](01-analisis-exploratorio/03-riesgo-salud-pacientes/) | Discute si tiene sentido fijar precios según el riesgo y con qué variables se podría defender. |
| 2 | [Hábitos y rendimiento académico](01-analisis-exploratorio/02-habitos-rendimiento-estudiantes/) | 6 gráficos (histogramas, scatter, heatmap, boxplot, pairplot) que se van construyendo sobre la misma tabla de correlación. |

---

## Estructura del repositorio

```
02-Python/
│
├── 01-analisis-exploratorio/              4 casos de negocio
│   ├── 01-analisis-ventas-empleados/      Servicios · ¿la edad predice el rendimiento?
│   ├── 02-habitos-rendimiento-estudiantes/ Educación · hábitos vs. nota de examen
│   ├── 03-riesgo-salud-pacientes/         Seguros · perfil de riesgo cardiovascular
│   └── 04-propinas-restaurante/            Restauración · pricing y turnos de personal
│
└── 02-guias-referencia/                   4 manuales de estudio
    ├── 01-matplotlib/                     10 tipos de gráfico + cheat sheet
    ├── 02-numpy/                          Arrays, broadcasting, agregación
    ├── 03-pandas-limpieza-datos/          Pipeline completo sobre dataset "sucio"
    └── 04-pandas-numpy-fundamentos/       Teoría + caso guiado paso a paso
```

Cada carpeta de caso incluye: `notebook.ipynb`, su dataset (si aplica) y un `README.md` con
el hallazgo clave y qué técnica se practica.

---


