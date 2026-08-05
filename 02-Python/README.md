# Python — Análisis Exploratorio y Fundamentos

> Colección de casos de negocio y manuales de referencia desarrollados durante el **Bootcamp
> de Data Analytics en [Neoland](https://www.neoland.es/)** (mayo – julio 2026). De pandas
> puro a storytelling de negocio: cada caso empieza con una pregunta real y termina con
> recomendaciones accionables, no con una tabla suelta.

**Autor:** [Borja Mora Méndez](https://www.linkedin.com/in/borjamoramendez/) · Madrid, 2026

---

## Por qué este repositorio es diferente

La mayoría de ejercicios de Python de bootcamp son un notebook con celdas de código y un
`print()` al final. Aquí no.

Cada caso de la carpeta de análisis exploratorio sigue la misma disciplina: contexto de
negocio primero (sin mencionar código todavía), preguntas concretas que alguien de
dirección haría de verdad, limpieza de datos justificada (no solo `dropna()` porque sí), y un
cierre con recomendaciones accionables y limitaciones honestas del análisis.

**Lo que encontrarás aquí:**

- **4 casos de negocio** en sectores distintos: comercial, educación, seguros/salud y
  restauración — todos con storytelling completo y visualización.
- **4 manuales de referencia** (Matplotlib, NumPy, y 2 de Pandas) con formato pedagógico:
  explicación → analogía → código → error común → aplicación profesional → ejercicio.
- **Decisiones de limpieza siempre justificadas**: por qué imputar y no eliminar, por qué 0 y
  no la media, qué hacer con una división entre cero.

---

## Stack técnico

```
Python 3.10 · pandas · NumPy · Matplotlib · Seaborn
```

---

## Highlights — 2 casos que recomiendo leer primero

| # | Caso | Por qué destaca |
|---|---|---|
| 1 | [Riesgo cardiovascular en una aseguradora](01-analisis-exploratorio/03-riesgo-salud-pacientes/) | Caso de negocio completo con argumentación (no solo cálculo) sobre si segmentar precios por riesgo es defendible, y con qué variables. |
| 2 | [Hábitos y rendimiento académico](01-analisis-exploratorio/02-habitos-rendimiento-estudiantes/) | Panel de 6 visualizaciones (histogramas, scatter, heatmap, boxplot, pairplot) construido progresivamente a partir de la misma tabla de correlación. |

---

## Estructura del repositorio

```
02-Python/
│
├── 01-analisis-exploratorio/              4 casos de negocio
│   ├── 01-analisis-ventas-empleados/      Servicios · ¿la edad predice el rendimiento?
│   ├── 02-habitos-rendimiento-estudiantes/ Educación · hábitos vs. nota de examen
│   ├── 03-riesgo-salud-pacientes/         Seguros · perfil de riesgo cardiovascular
│   └── 04-consumo-propinas-restaurante/   Restauración · pricing y turnos de personal
│
└── 02-manuales-referencia/                4 manuales de estudio
    ├── 01-matplotlib/                     10 tipos de gráfico + cheat sheet
    ├── 02-numpy/                          Arrays, broadcasting, agregación
    ├── 03-pandas-limpieza-datos/          Pipeline completo sobre dataset "sucio"
    └── 04-pandas-numpy-fundamentos/       Teoría + caso guiado paso a paso
```

Cada carpeta de caso incluye: `notebook.ipynb`, su dataset (si aplica) y un `README.md` con
el hallazgo clave y qué técnica se practica.

---


