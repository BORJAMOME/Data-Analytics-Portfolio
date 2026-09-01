# SARSA — Política de Marketing Personalizado para E-Commerce

## Contexto de negocio

Una plataforma de e-commerce lanza campañas de marketing de forma homogénea a toda su base de clientes, sin distinguir entre un cliente activo que no necesita incentivos y un cliente en riesgo que necesita un descuento para no perderse. Las decisiones manuales son inconsistentes y no optimizan el valor a largo plazo del cliente.

## Dataset

Entorno simulado (MDP determinista) con 4 estados de ciclo de vida del cliente (Nuevo, Activo, Riesgo, Inactivo) y 4 acciones de marketing (Sin acción, Email, Descuento, Contactar). Las 16 transiciones y recompensas están definidas por la tabla del enunciado del ejercicio.

## Técnicas aplicadas

- **SARSA** (*on-policy* temporal-difference learning) con exploración ε-greedy y decay
- Validación de la política aprendida contra la **solución analítica exacta** (iteración de valor)
- Simulación comparativa: política SARSA vs política aleatoria (1.000 trayectorias)
- Heatmap de la tabla Q, curva de convergencia, histograma de recompensas

## Hallazgo clave

El agente aprende la política óptima en los **4 estados**, verificada contra Q\*: email de bienvenida para nuevos, no intervención para activos, y descuento exclusivamente como herramienta de recuperación (riesgo e inactivos). La política SARSA mejora la recompensa acumulada un **+92%** frente a una política aleatoria. El principio descubierto: **los descuentos son para recuperar clientes, no para retener a los que ya compran**.


## Stack

NumPy, pandas, Matplotlib, Seaborn
