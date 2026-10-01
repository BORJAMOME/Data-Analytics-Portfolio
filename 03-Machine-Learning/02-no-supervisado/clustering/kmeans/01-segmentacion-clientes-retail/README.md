# K-Means — Segmentación de clientes retail

## Contexto de negocio
Un centro comercial quiere agrupar a sus clientes por ingresos y por cómo gastan, para hacer campañas distintas (VIP, activación, fidelización).

## Dataset
Sintético: 200 clientes con 5 segmentos naturales (ingreso anual vs spending score).

## Técnicas aplicadas
- Método del codo (inercia)
- Silhouette score
- K-Means con k=5
- Visualización de centroides en espacio original
- Perfil descriptivo de cada cluster

## Hallazgo clave
K-Means encuentra 5 perfiles: premium, aspiracional, prudente con ingresos altos, prudente con ingresos bajos y medio. Con los centroides, cualquier cliente nuevo se puede asignar a su grupo automáticamente. Como los datos son sintéticos y traen 5 grupos de serie, el valor está en el método más que en el resultado.

