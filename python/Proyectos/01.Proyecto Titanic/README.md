# Análisis de Supervivientes del Titanic con Python
<img src="https://img.shields.io/badge/Language-Python-yellow" alt="Language">
<img src="https://img.shields.io/badge/Notebook-Jupyter-orange" alt="Jupyter Notebook">
<img src="https://img.shields.io/badge/Data-Kaggle-blue" alt="Kaggle Data">

Este proyecto tiene como objetivo analizar los datos del famoso naufragio del Titanic para descubrir patrones que pudieron influir en la **supervivencia de los pasajeros**. A través de técnicas de análisis de datos y visualización en **Python**, se exploran variables como el género, la edad, la clase del billete o el puerto de embarque.

Este trabajo forma parte de mi proceso de aprendizaje en ciencia de datos y análisis exploratorio utilizando herramientas como `Pandas`, `Matplotlib` y `Seaborn`.

## Dataset

Los datos utilizados provienen del clásico dataset del Titanic, muy popular en competencias de aprendizaje automático como **Kaggle**. A continuación se describen las principales variables:

| Columna       | Descripción |
|---------------|-------------|
| `PassengerId` | Identificador único del pasajero |
| `Survived`    | Supervivencia (0 = No, 1 = Sí) |
| `Pclass`      | Clase del pasajero (1ª, 2ª o 3ª) |
| `Name`        | Nombre completo del pasajero |
| `Sex`         | Género (`male` o `female`) |
| `Age`         | Edad del pasajero |
| `SibSp`       | Nº de hermanos/esposos a bordo |
| `Parch`       | Nº de padres/hijos a bordo |
| `Ticket`      | Nº de billete |
| `Fare`        | Tarifa del billete |
| `Cabin`       | Nº de camarote |
| `Embarked`    | Puerto de embarque (`C`, `Q`, `S`) |


## Estructura del Proyecto

1. **Carga de datos en Python**
2. **Revisión y limpieza del dataset**
3. **Análisis exploratorio (EDA)**
4. **Visualizaciones clave sobre supervivencia**


## Análisis y Visualizaciones

Durante el análisis se han realizado visualizaciones para responder preguntas clave sobre el desastre:

-  **Pasajeros por clase**  
-  **Supervivientes por clase**
-  **Supervivencia según género y clase**
-  **Gráficos combinados por clase y sexo**
-  **Análisis por género**
-  **Distribución de edad y su relación con la supervivencia**
-  **Relación entre el precio del billete (`Fare`) y supervivencia**
-  **Análisis por puerto de embarque**



Este análisis permite observar patrones significativos en los datos:

- Las mujeres y los niños tenían una tasa de supervivencia más alta.
- Los pasajeros de primera clase tenían más posibilidades de sobrevivir.
- El precio del billete y el puerto de embarque muestran correlaciones interesantes.

