# SARSA — Política de Marketing Personalizado para E-Commerce

## Contexto de negocio

Un e-commerce manda las mismas campañas a todos sus clientes. Trata igual al cliente activo, que no necesita ningún incentivo, que al que está a punto de irse y a lo mejor volvería con un descuento. Cuando se decide a mano, cada uno hace una cosa y nadie piensa en el valor del cliente a largo plazo.

## Dataset

Entorno simulado (un MDP determinista) con 4 fases del cliente (nuevo, activo, en riesgo, inactivo) y 4 acciones de marketing (nada, email, descuento, contacto directo). Las 16 transiciones y recompensas vienen de la tabla del enunciado.

## Técnicas aplicadas

- **SARSA** (*on-policy* temporal-difference learning) con exploración ε-greedy y decay
- Validación de la política aprendida contra la **solución analítica exacta** (iteración de valor)
- Simulación comparativa: política SARSA vs política aleatoria (1.000 trayectorias)
- Heatmap de la tabla Q, curva de convergencia, histograma de recompensas

## Hallazgo clave

El agente aprende la política óptima en los **4 estados**, y lo compruebo contra Q\*: email de bienvenida para los nuevos, no tocar a los activos y descuento solo para recuperar a los que están en riesgo o inactivos. Frente a elegir al azar, la recompensa acumulada sube un **92%**. La idea que se lleva uno: **los descuentos sirven para recuperar clientes, no para retener a los que ya compran**.


## Stack

NumPy, pandas, Matplotlib, Seaborn
