# 📚 Gestión de una Librería con SQL
[![SQL](https://img.shields.io/badge/MySQL-8.0+-f29221?style=for-the-badge&logo=mysql&logoColor=white&labelColor=101010)](https://mysql.com)



## Problema
Las bibliotecas modernas enfrentan retos de gestión:

- Inventario de libros extenso y diverso  
- Registro y seguimiento de usuarios  
- Control de préstamos y devoluciones  
- Identificación de libros más demandados para análisis estratégico  

Sin un **modelo de datos eficiente**, estos procesos se vuelven lentos, propensos a errores y poco escalables.



## Contexto del Proyecto
Este proyecto desarrolla un **sistema de gestión de biblioteca en SQL**, aplicando:

- **Modelado relacional normalizado** (3FN)  
- **Claves primarias y foráneas** para integridad referencial  
- **Restricciones de integridad** y validación de datos  
- **Índices** para consultas rápidas  
- **Consultas analíticas orientadas a negocio**  

El objetivo no es solo almacenar datos, sino permitir **análisis estratégicos** que aporten valor a la toma de decisiones.



## Modelo de Datos

El sistema incluye 5 entidades principales:

| Tabla      | Función |
|------------|---------|
| `users`   | Usuarios registrados |
| `author`  | Autores de los libros |
| `thematic`| Categorías literarias |
| `books`   | Catálogo de libros |
| `lends`   | Historial de préstamos |

**Insight profesional:** La base está diseñada para escalabilidad y para integrarse fácilmente con herramientas de BI como Power BI.


### KPIs Clave

| KPI | Valor | Visualización |
|-----|-------|---------------|
| Total de libros | 100 | `██████████ 100%` |
| Total de usuarios | 20 | `██████████ 100%` |
| Libros prestados | 8 | `████ 40%` |
| Libros devueltos | 92 | `██████████ 92%` |
| Autor más prolífico | J.K. Rowling | `🏆` |
| Libro más antiguo | *Romeo y Julieta* (1597) | `📜` |
| Libro más popular | *Harry Potter y la Piedra Filosofal* | `🔥` |
| Usuario más activo | Ethan Johnson | `15 préstamos` |



**Préstamos vs Devoluciones**
| Métrica | Valor | Visualización |
|---------|-------|---------------|
| Préstamos | 8 | `████████ 8` |
| Devoluciones | 92 | `█████████████████████████ 92` |



**Popularidad de Libros (Top 5)**
| Libro | Veces Prestado | Visualización |
|-------|----------------|---------------|
| Harry Potter | 20 | `██████████ 20` |
| The Shining | 15 | `████████ 15` |
| Foundation | 12 | `██████ 12` |
| Murder on the Orient Express | 10 | `█████ 10` |
| The Da Vinci Code | 8 | `████ 8` |


**Usuarios más activos (Top 5)**
| Usuario | Préstamos | Visualización |
|---------|-----------|---------------|
| Ethan Johnson | 15 | `██████████ 15` |
| Olivia Smith | 12 | `████████ 12` |
| Liam Williams | 10 | `███████ 10` |
| Ava Jones | 9 | `██████ 9` |
| Noah Brown | 7 | `████ 7` |



## Consultas lanzadas a la base de datos:

#### Total de libros en la base de datos

```sql

SELECT COUNT(*) AS total_books
FROM books;
```

#### Total de usuarios

```sql
SELECT COUNT(*) AS total_users
FROM users;
```

#### Libros prestados por un usuario específico

```sql
SELECT COUNT(*) AS borrowed_books
FROM lends
WHERE user_id = 1;
```

#### Libros prestados por usuario
```sql
SELECT COUNT(*) AS borrowed_books
FROM lends
WHERE user_id = 12;
```

#### Libros devueltos y en préstamo

```sql
SELECT
    SUM(CASE WHEN returned = TRUE THEN 1 ELSE 0 END) AS returned_books,
    SUM(CASE WHEN returned = FALSE THEN 1 ELSE 0 END) AS borrowed_books
FROM lends;
```


#### Autor más prolífico 
```sql
SELECT a.name AS prolific_author, COUNT(b.book_id) AS total_books
FROM author a
JOIN books b ON a.author_id = b.author_id
GROUP BY a.author_id
ORDER BY total_books DESC
LIMIT 1;
```

#### Libro más antiguo
```sql
SELECT title, published_year
FROM books
ORDER BY published_year ASC
LIMIT 1;
```

#### Total de préstamos
```sql
SELECT COUNT(*) AS total_loans
FROM lends;
```

#### Libros actualmente en préstamo
```sql
SELECT COUNT(*) AS borrowed_books
FROM lends
WHERE returned = FALSE;
```

#### Libros prestados por usuario en un año específico
```sql
SELECT COUNT(*) AS borrowed_books_in_year
FROM lends
WHERE user_id = 1
  AND YEAR(lend_date) = 2023;
```

#### Libro más popular
```sql
SELECT b.title, COUNT(l.lend_id) AS total_times_borrowed
FROM books b
JOIN lends l ON b.book_id = l.book_id
GROUP BY b.book_id
ORDER BY total_times_borrowed DESC
LIMIT 1;
```

#### Próxima fecha de devolución
```sql
SELECT 
    l.lend_id,
    b.title,
    u.name,
    u.lastname,
    DATE_ADD(l.lend_date, INTERVAL 30 DAY) AS due_date
FROM lends l
JOIN books b ON l.book_id = b.book_id
JOIN users u ON l.user_id = u.user_id
WHERE l.returned = FALSE
ORDER BY due_date ASC
LIMIT 1;
```

#### Usuario más activo
```sql
SELECT 
    u.user_id,
    CONCAT(u.name, ' ', u.lastname) AS full_name,
    COUNT(l.lend_id) AS total_loans
FROM users u
JOIN lends l ON u.user_id = l.user_id
GROUP BY u.user_id
ORDER BY total_loans DESC
LIMIT 1;
```
