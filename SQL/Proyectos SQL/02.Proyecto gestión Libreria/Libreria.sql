-- Eliminamos la base de datos si existe (entorno de pruebas)
DROP DATABASE IF EXISTS library;

-- Creamos la base de datos
CREATE DATABASE library;

-- Seleccionamos la base de datos
USE library;

-- Tabla de usuarios
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tematicas 
CREATE TABLE thematic (
    thematic_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);


-- Tabla de autores
CREATE TABLE author (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Tabla de libros
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author_id INT NOT NULL,
    thematic_id INT NOT NULL,
    published_year YEAR NOT NULL,
    
    CONSTRAINT fk_books_author
        FOREIGN KEY (author_id)
        REFERENCES author(author_id)
        ON DELETE CASCADE,
        
    CONSTRAINT fk_books_thematic
        FOREIGN KEY (thematic_id)
        REFERENCES thematic(thematic_id)
        ON DELETE CASCADE,
        
    INDEX idx_author (author_id),
    INDEX idx_thematic (thematic_id)
);


-- Tabla de prestamos
CREATE TABLE lends (
    lend_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    lend_date DATE NOT NULL,
    returned BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT fk_lends_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
        
    CONSTRAINT fk_lends_book
        FOREIGN KEY (book_id)
        REFERENCES books(book_id)
        ON DELETE CASCADE,
        
    INDEX idx_user (user_id),
    INDEX idx_book (book_id),
    INDEX idx_user_date (user_id, lend_date)
);



-- Insertamos datos de usuarios
INSERT INTO users (name, lastname, email)
VALUES ("Ethan", "Johnson", "ethanjohnson@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Olivia", "Smith", "oliviasmith@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Liam", "Williams", "liamwilliams@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Ava", "Jones", "avajones@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Noah", "Brown", "noahbrown@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Emma", "Taylor", "emmataylor@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("William", "Davies", "williamdavies@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Sophia", "Evans", "sophiaevans@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("James", "Wilson", "jameswilson@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Isabella", "Thomas", "isabellathomas@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Oliver", "Roberts", "oliverroberts@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Mia", "Green", "miagreen@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Benjamin", "Clark", "benjaminclark@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Charlotte", "Hill", "charlottehill@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Elijah", "Hughes", "elijahhughes@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Amelia", "Walker", "ameliawalker@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Lucas", "Lewis", "lucaslewis@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Harper", "King", "harperking@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Mason", "Turner", "masonturner@example.com");

INSERT INTO users (name, lastname, email)
VALUES ("Evelyn", "White", "evelynwhite@example.com")


-- Insertamos valores de temáticas
INSERT INTO thematic (name)
VALUES ("Fantasy");

INSERT INTO thematic (name)
VALUES ("Horror");

INSERT INTO thematic (name)
VALUES ("Science Fiction");

INSERT INTO thematic (name)
VALUES ("Mystery");

INSERT INTO thematic (name)
VALUES ("Romance");

INSERT INTO thematic (name)
VALUES ("Adventure");

INSERT INTO thematic (name)
VALUES ("Historical Fiction");

INSERT INTO thematic (name)
VALUES ("Thriller");

INSERT INTO thematic (name)
VALUES ("Biography");

INSERT INTO thematic (name)
VALUES ("Self-help");

INSERT INTO thematic (name)
VALUES ("Poetry");

INSERT INTO thematic (name)
VALUES ("Humor");

INSERT INTO thematic (name)
VALUES ("Drama");

INSERT INTO thematic (name)
VALUES ("Action");

INSERT INTO thematic (name)
VALUES ("Children's");

INSERT INTO thematic (name)
VALUES ("Young Adult");

-- Insertamos valores de autores
INSERT INTO author (name) VALUES ("J.R.R. Tolkien"); -- Fantasy 
INSERT INTO author (name) VALUES ("Stephen King"); -- Horror 
INSERT INTO author (name) VALUES ("Isaac Asimov"); -- Science Fiction 
INSERT INTO author (name) VALUES ("Agatha Christie"); -- Mystery 
INSERT INTO author (name) VALUES ("Jane Austen"); -- Romance 
INSERT INTO author (name) VALUES ("Jules Verne"); -- Adventure 
INSERT INTO author (name) VALUES ("Ken Follett"); -- Historical Fiction 
INSERT INTO author (name) VALUES ("Dan Brown"); -- Thriller 
INSERT INTO author (name) VALUES ("Walter Isaacson"); -- Biography 
INSERT INTO author (name) VALUES ("Dale Carnegie"); -- Self-help 
INSERT INTO author (name) VALUES ("Rumi"); -- Poetry 
INSERT INTO author (name) VALUES ("Mark Twain"); -- Humor 
INSERT INTO author (name) VALUES ("William Shakespeare"); -- Drama 
INSERT INTO author (name) VALUES ("Tom Clancy"); -- Action 
INSERT INTO author (name) VALUES ("Dr. Seuss"); -- Children's 
INSERT INTO author (name) VALUES ("J.K. Rowling"); -- Young Adult

-- Insertamos nombres de los libros
authors and literary themes 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("The Fellowship of the Ring", 1, 1, 1954); -- Fantasy (J.R.R. Tolkien) 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("The Shining", 2, 2, 1977); -- Horror (Stephen King) 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("Foundation", 3, 3, 1951); -- Science Fiction (Isaac Asimov) 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("Murder on the Orient Express", 4, 4, 1934); -- Mystery (Agatha Christie) 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("Pride and Prejudice", 5, 5, 1813); -- Romance (Jane Austen) 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("Twenty Thousand Leagues Under the Sea", 6, 6, 1870); -- Adventure (Jules Verne) 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("The Pillars of the Earth", 7, 7, 1989); -- Historical Fiction (Ken Follett) 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("The Da Vinci Code", 8, 8, 2003); -- Thriller (Dan Brown) 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("Steve Jobs", 9, 9, 2011); -- Biography (Walter Isaacson) 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("How to Win Friends and Influence People", 10, 10, 1936); -- Self-help (Dale Carnegie) 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("The Essential Rumi", 11, 11, 1995); -- Poetry (Rumi) 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("The Adventures of Tom Sawyer", 12, 12, 1876); -- Humor (Mark Twain) 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("Romeo and Juliet", 13, 13, 1597); -- Drama (William Shakespeare) 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("The Hunt for Red October", 14, 14, 1984); -- Action (Tom Clancy) 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("Green Eggs and Ham", 15, 15, 1960); -- Children's (Dr. Seuss) 
INSERT INTO books (name, author_id, thematic_id, year) VALUES ("Harry Potter and the Philosopher's Stone", 16, 16, 1997); -- Young Adult (J.K. Rowling)

-- Insertamos registros de préstamos
Insert Into lends (user_id, book_id, date, returned)
Values (1, 1, '2020-06-20', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (7, 14, '2023-02-15', 0);

Insert Into lends (user_id, book_id, date, returned)
Values (4, 9, '2023-11-09', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (19, 2, '2023-07-23', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (5, 5, '2023-04-30', 0);

Insert Into lends (user_id, book_id, date, returned)
Values (11, 11, '2023-05-12', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (9, 8, '2023-08-07', 0);

Insert Into lends (user_id, book_id, date, returned)
Values (3, 3, '2023-10-18', 0);

Insert Into lends (user_id, book_id, date, returned)
Values (6, 13, '2023-03-27', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (10, 6, '2023-09-05', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (13, 8, '2023-05-25', 0);

Insert Into lends (user_id, book_id, date, returned)
Values (2, 4, '2023-12-19', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (8, 12, '2023-11-01', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (14, 14, '2023-07-02', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (20, 16, '2023-01-20', 0);

Insert Into lends (user_id, book_id, date, returned)
Values (15, 7, '2023-09-10', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (18, 10, '2023-03-03', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (1, 15, '2023-06-28', 0);

Insert Into lends (user_id, book_id, date, returned)
Values (16, 1, '2023-08-13', 0);

Insert Into lends (user_id, book_id, date, returned)
Values (12, 3, '2023-10-06', 0);

Insert Into lends (user_id, book_id, date, returned)
Values (17, 8, '2023-12-27', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (11, 5, '2023-02-25', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (8, 6, '2023-09-19', 0);

Insert Into lends (user_id, book_id, date, returned)
Values (5, 11, '2023-04-14', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (2, 15, '2023-06-08', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (9, 9, '2023-01-10', 0);

Insert Into lends (user_id, book_id, date, returned)
Values (10, 2, '2023-05-06', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (4, 3, '2023-10-30', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (14, 4, '2023-08-24', 0);

Insert Into lends (user_id, book_id, date, returned)
Values (3, 12, '2023-11-16', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (19, 7, '2023-07-07', 1);

Insert Into lends (user_id, book_id, date, returned)
Values (13, 10, '2023-02-19', 0);

-- =====================================================
-- CONSULTAS ANALÍTICAS
-- =====================================================

-- Total de libros
SELECT COUNT(*) AS total_books
FROM books;

-- Total de usuarios
SELECT COUNT(*) AS total_users
FROM users;

-- Préstamos activos
SELECT COUNT(*) AS active_loans
FROM lends
WHERE returned = FALSE;

-- Usuario más activo
SELECT 
    u.user_id,
    CONCAT(u.name, ' ', u.lastname) AS full_name,
    COUNT(l.lend_id) AS total_loans
FROM users u
JOIN lends l ON u.user_id = l.user_id
GROUP BY u.user_id
ORDER BY total_loans DESC
LIMIT 1;

-- Libro más popular
SELECT 
    b.title,
    COUNT(l.lend_id) AS total_times_borrowed
FROM books b
JOIN lends l ON b.book_id = l.book_id
GROUP BY b.book_id
ORDER BY total_times_borrowed DESC
LIMIT 5;

-- Ratio de devolución
SELECT
    COUNT(*) AS total_loans,
    SUM(returned = TRUE) AS returned_loans,
    ROUND(SUM(returned = TRUE) / COUNT(*) * 100, 2) AS return_rate_percentage
FROM lends;
