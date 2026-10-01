# Manual ML para dummies

Manual visual e interactivo de Machine Learning para analistas de datos: **63 modelos** explicados de lo intuitivo a lo técnico, con un **visual interactivo propio por modelo** (2D y 3D), **casos reales de negocio**, laboratorios, fundamentos, glosario y un asistente para elegir modelo.

**Abrir:** descarga [`ml_manual_modelos.html`](ml_manual_modelos.html) y ábrelo en el navegador. Es un único archivo; los visuales 3D cargan three.js desde CDN la primera vez.

## Cómo está organizada cada ficha

| Capítulo | Qué contiene |
|---|---|
| 1 · Entiéndelo | El modelo en una frase, analogía, pasos como si lo hicieras a mano, ejemplo con números y la idea clave |
| 2 · Míralo en acción | Visual interactivo propio del modelo + laboratorios relacionados |
| 3 · Úsalo en una empresa | Caso a fondo + 3 casos de negocio, cuándo sí / cuándo no, métricas y notebooks del portfolio |
| 4 · Por dentro | Fórmula explicada, código en Python y modelos con los que se confunde |
| 5 · Ponte a prueba | Lo que tienes que recordar y pregunta de autochequeo (con progreso guardado) |
| 6 · Nivel profesional | Hiperparámetros, trampas, producción y estado del arte a octubre de 2026 |

La sección **Auditoría** del propio manual recoge qué se revisó y corrigió en la edición de octubre de 2026 y las propuestas de mejora.

## Estructura del código

```
00-manual-ml/
├── ml_manual_modelos.html   ← el manual (generado, autocontenido)
├── build.py                 ← une src/ en un único HTML
└── src/
    ├── template.html · body.html · styles.css   estructura y sistema de diseño (marca: #7a7bff, Segoe UI)
    ├── core.js        glosario, fundamentos, motor de laboratorios y visuales
    ├── viz-a…d.js     un visual interactivo por modelo (canvas 2D y three.js)
    ├── easy-*.js      capa «para dummies» y casos de negocio por modelo
    ├── audit.js       auditoría y propuestas de mejora
    └── app.js         catálogo de modelos, fichas, rutas, asistente y buscador (Ctrl + K)
```

Para regenerar el HTML tras editar `src/`:

```bash
python3 build.py
```

Los gráficos siguen el sistema de color de [`DISENO-VISUAL.md`](../DISENO-VISUAL.md).
