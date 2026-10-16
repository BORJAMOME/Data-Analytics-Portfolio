"""Genera 00_schema_y_datos.sql para TiendaDB (datos sintéticos, semilla fija).

Uso: python generar_datos.py 00_schema_y_datos.sql
"""
import random, sys, datetime as dt

out = sys.argv[1]
rng = random.Random(2024)

categorias = ["Lacteos","Fruta","Carniceria","Despensa","Snacks","Bebidas","Limpieza","Higiene",
              "Congelados","Panaderia","Mascotas","Bebes","Electrodomesticos","Ropa","Tecnologia",
              "Juguetes","Papeleria","Ferreteria","Jardin","Otros"]
proveedores = [("Danone","Espana"),("Bimbo","Espana"),("Gallina Blanca","Espana"),("Frutas SA","Espana"),
               ("Carnes SL","Espana"),("PescaMar","Espana"),("Aceites Sur","Espana"),("Cafe Global","Colombia"),
               ("SnackCorp","USA"),("Bebidas SA","Espana"),("CleanPro","Alemania"),("HigienePlus","Francia"),
               ("FrozenFoods","Italia"),("PanExpress","Espana"),("PetFood","USA"),("BabyCare","Suiza"),
               ("ElectroMax","China"),("TextilHome","India"),("TechWorld","Corea"),("ToyFun","Japon")]
clientes = [("Ana","Madrid",30),("Luis","Sevilla",45),("Marta","Valencia",28),("Carlos","Madrid",50),
            ("Lucia","Bilbao",35),("Pedro","Madrid",60),("Sofia","Barcelona",22),("Jorge","Valencia",40),
            ("Elena","Sevilla",33),("Raul","Madrid",27),("Carmen","Bilbao",48),("David","Madrid",52),
            ("Paula","Sevilla",29),("Alberto","Barcelona",37),("Sara","Madrid",41),("Miguel","Valencia",55),
            ("Laura","Madrid",23),("Fernando","Bilbao",62),("Irene","Sevilla",31),("Hugo","Madrid",38)]
empleados = [("Juan","Cajero",1400),("Maria","Reponedor",1300),("Luis","Encargado",2000),("Ana","Cajero",1450),
             ("Pedro","Seguridad",1500),("Laura","Cajero",1420),("Sergio","Reponedor",1350),("Elena","Encargado",2100),
             ("Raul","Cajero",1380),("Carmen","Limpieza",1200),("Jorge","Seguridad",1550),("Lucia","Cajero",1470),
             ("Alberto","Reponedor",1320),("Sara","Encargado",2200),("Miguel","Cajero",1390),("Paula","Limpieza",1180),
             ("David","Seguridad",1520),("Irene","Cajero",1410),("Fernando","Reponedor",1340),("Hugo","Encargado",2050)]
# (nombre, precio, id_categoria, id_proveedor): catálogo original
productos = [("Leche",1.20,1,1),("Pan",0.80,10,2),("Huevos",2.50,1,3),("Manzanas",1.80,2,4),("Platanos",1.60,2,4),
             ("Pollo",5.50,3,5),("Ternera",10.00,3,5),("Pescado",8.00,3,6),("Yogur",2.00,1,1),("Queso",4.50,1,2),
             ("Arroz",1.30,4,3),("Pasta",1.10,4,3),("Aceite",6.00,4,7),("Azucar",1.20,4,3),("Cafe",3.50,4,8),
             ("Galletas",2.20,5,9),("Chocolate",2.80,5,9),("Cerveza",1.50,6,10),("Vino",7.00,6,10),("Agua",0.70,6,10)]

# Clientes 19 y 20 sin pedidos; peso de compra desigual (unos pocos compran mucho).
compradores = list(range(1, 19))
pesos = [rng.lognormvariate(0, 0.8) for _ in compradores]
# Producto 14 (Azucar) sin ventas; popularidad desigual entre el resto.
vendibles = [i for i in range(1, 21) if i != 14]
pop = [rng.uniform(0.5, 3.0) for _ in vendibles]
cajeros = [i for i, e in enumerate(empleados, 1) if e[1] == "Cajero"]

pedidos, detalle = [], []
inicio = dt.date(2024, 1, 2)
id_det = 1
for id_ped in range(1, 301):
    fecha = inicio + dt.timedelta(days=int((id_ped - 1) * 363 / 300) + rng.randint(0, 1))
    cli = rng.choices(compradores, weights=pesos)[0]
    emp = rng.choice(cajeros)
    lineas = rng.sample(vendibles, k=rng.randint(1, 5))  # sin repetir producto en un pedido
    total = 0
    for prod in sorted(lineas, key=lambda p: rng.random()):
        cant = rng.choices([1, 2, 3, 4, 5, 6], weights=[30, 28, 18, 12, 7, 5])[0]
        precio = productos[prod - 1][1]
        detalle.append((id_det, id_ped, prod, cant, precio)); id_det += 1
        total += round(cant * precio, 2)
    pedidos.append((id_ped, cli, emp, fecha.isoformat(), round(total, 2)))

def q(s): return "'" + s.replace("'", "''") + "'"
def rows(vals, per=5):
    lines = []
    for i in range(0, len(vals), per):
        lines.append(",".join(vals[i:i+per]))
    return ",\n".join(lines) + ";"

L = []
L.append("""-- ============================================================================
-- TIENDA DE ALIMENTACIÓN: ESQUEMA Y DATOS
-- ============================================================================
-- Crea la base TiendaDB con sus 7 tablas y los datos que usa
-- analisis_tienda.sql. Ejecutar antes que el análisis.
--
-- Datos: sintéticos. Clientes, empleados, proveedores, categorías y
-- productos (catálogo y precios) son los de la base original del ejercicio;
-- los 300 pedidos de 2024 y sus líneas se han generado con un script de
-- Python con semilla fija. El total de cada pedido es la suma de sus líneas
-- (cantidad × precio_unitario), de modo que pedidos y detalle cuadran.
--
-- Autor: Borja Mora Méndez
-- Stack: T-SQL · SQL Server 2019 o superior
-- ============================================================================

IF DB_ID('TiendaDB') IS NULL
    CREATE DATABASE TiendaDB;
GO

USE TiendaDB;
GO

-- Se eliminan las tablas si ya existen para poder reejecutar el script.
DROP TABLE IF EXISTS detalle_pedidos;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS empleados;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS categorias;

CREATE TABLE categorias (
    id_categoria INT         NOT NULL PRIMARY KEY,
    nombre       VARCHAR(50) NOT NULL
);

CREATE TABLE proveedores (
    id_proveedor INT         NOT NULL PRIMARY KEY,
    nombre       VARCHAR(50) NOT NULL,
    pais         VARCHAR(50) NOT NULL
);

CREATE TABLE clientes (
    id_cliente INT         NOT NULL PRIMARY KEY,
    nombre     VARCHAR(50) NOT NULL,
    ciudad     VARCHAR(50) NOT NULL,
    edad       INT         NOT NULL
);

CREATE TABLE empleados (
    id_empleado INT           NOT NULL PRIMARY KEY,
    nombre      VARCHAR(50)   NOT NULL,
    puesto      VARCHAR(50)   NOT NULL,
    salario     DECIMAL(10,2) NOT NULL
);

CREATE TABLE productos (
    id_producto  INT           NOT NULL PRIMARY KEY,
    nombre       VARCHAR(50)   NOT NULL,
    precio       DECIMAL(10,2) NOT NULL,
    id_categoria INT           NOT NULL REFERENCES categorias(id_categoria),
    id_proveedor INT           NOT NULL REFERENCES proveedores(id_proveedor)
);

CREATE TABLE pedidos (
    id_pedido   INT           NOT NULL PRIMARY KEY,
    id_cliente  INT           NOT NULL REFERENCES clientes(id_cliente),
    id_empleado INT           NOT NULL REFERENCES empleados(id_empleado),
    fecha       DATE          NOT NULL,
    total       DECIMAL(10,2) NOT NULL
);

CREATE TABLE detalle_pedidos (
    id_detalle      INT           NOT NULL PRIMARY KEY,
    id_pedido       INT           NOT NULL REFERENCES pedidos(id_pedido),
    id_producto     INT           NOT NULL REFERENCES productos(id_producto),
    cantidad        INT           NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL
);
""")
L.append("INSERT INTO categorias (id_categoria, nombre) VALUES\n" +
         rows([f"({i},{q(n)})" for i, n in enumerate(categorias, 1)]))
L.append("\nINSERT INTO proveedores (id_proveedor, nombre, pais) VALUES\n" +
         rows([f"({i},{q(n)},{q(p)})" for i, (n, p) in enumerate(proveedores, 1)], 4))
L.append("\nINSERT INTO clientes (id_cliente, nombre, ciudad, edad) VALUES\n" +
         rows([f"({i},{q(n)},{q(c)},{e})" for i, (n, c, e) in enumerate(clientes, 1)], 4))
L.append("\nINSERT INTO empleados (id_empleado, nombre, puesto, salario) VALUES\n" +
         rows([f"({i},{q(n)},{q(p)},{s:.2f})" for i, (n, p, s) in enumerate(empleados, 1)], 4))
L.append("\nINSERT INTO productos (id_producto, nombre, precio, id_categoria, id_proveedor) VALUES\n" +
         rows([f"({i},{q(n)},{p:.2f},{c},{v})" for i, (n, p, c, v) in enumerate(productos, 1)], 4))
L.append("\nINSERT INTO pedidos (id_pedido, id_cliente, id_empleado, fecha, total) VALUES\n" +
         rows([f"({a},{b},{c},'{d}',{e:.2f})" for a, b, c, d, e in pedidos], 4))
det_vals = [f"({a},{b},{c},{d},{e:.2f})" for a, b, c, d, e in detalle]
for i in range(0, len(det_vals), 500):  # máx. 1000 filas por INSERT ... VALUES
    L.append("\nINSERT INTO detalle_pedidos (id_detalle, id_pedido, id_producto, cantidad, precio_unitario) VALUES\n" +
             rows(det_vals[i:i+500], 5))
L.append("\nGO\n")
open(out, "w", encoding="utf-8", newline="\r\n").write("\n".join(L))
print(len(pedidos), len(detalle))
