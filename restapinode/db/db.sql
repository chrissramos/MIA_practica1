CREATE DATABASE IF NOT EXISTS practica1;
use practica1;

/*****************************************/
/**********    PRACTICA 1    *************/
/*****************************************/



create table tblTemporal(
    nombre_compania VARCHAR(255),
    contacto_compania VARCHAR(255),
    correo_compania varchar(255),
    telefono_compania varchar(255),
    tipo varchar(2),
    nombre varchar(255),
    correo varchar(255),
    telefono varchar(255),
    fecha_registro date,
    direccion varchar(255),
    ciudad varchar(255),
    codigo_postal int,
    region varchar(255),
    producto varchar(255),
    categoria_producto varchar(255),
    cantidad int,
    precio_unitario varchar(45)
);
truncate table tblTemporal;  -- este es para vaciarla
drop table tblTemporal;      -- este para eliminar la tabla
-- esto es para carga masiva correctamente 
LOAD DATA INFILE '/var/lib/mysql-files/MIA/DataCenterData.csv' 
INTO TABLE tblTemporal
FIELDS TERMINATED BY ';' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS (nombre_compania,contacto_compania, correo_compania, telefono_compania, tipo, nombre, correo, telefono, @datevar, direccion, ciudad, codigo_postal, region, producto, categoria_producto, cantidad, precio_unitario)
set fecha_registro=str_to_date(@datevar, '%d/%m/%Y');
-- fin carga masiva correctamente 

select * from tblTemporal;
select * from compra;

SET FOREIGN_KEY_CHECKS = 0;
truncate table venta;
truncate table compra;
truncate table proveedor;
truncate table cliente;
truncate table ubicacion;
truncate table ciudad;
truncate table region;
truncate table producto;
truncate table categoria_producto;
truncate table compania;
truncate table contacto_compania;
SET FOREIGN_KEY_CHECKS = 1;

select * from venta;
select * from compra;
select * from proveedor;
select * from cliente;
select * from ubicacion;
select * from ciudad;
select * from region;
select * from producto;
select * from categoria_producto;
select * from compania;
select * from contacto_compania;




drop table employees;
-- creando modelo

create table contacto_compania(
	idcontacto_compania INT NOT NULL auto_increment,
    contacto varchar(200),
    primary key(idcontacto_compania)
);
create table compania(
	idcompania INT not null auto_increment,
    idcontacto_compania int, 
    correo_compania varchar(200),
    telefono_compania varchar(200),
    primary key(idcompania),
    foreign key(idcontacto_compania) references contacto_compania(idcontacto_compania)
);
create table categoria_producto(
	idcategoria_producto int not null auto_increment,
    categoria varchar(200),
    primary key(idcategoria_producto)
);
create table producto(
	idproducto int not null auto_increment,
    producto varchar(200),
    precio decimal(5,2),
    idcategoria_producto int,
    primary key(idproducto),
    foreign key(idcategoria_producto) references categoria_producto(idcategoria_producto)
);
create table region(
	idregion int not null auto_increment,
    region varchar(200),
    primary key(idregion)
);
create table ciudad(
	idciudad int not null auto_increment,
    ciudad varchar(200),
    idregion int,
    primary key(idciudad),
    foreign key(idregion) references region(idregion)
); 
create table ubicacion(
	idubicacion int not null auto_increment,
    ubicacion varchar(200),
    codigo_postal int,
    idciudad int,
    primary key(idubicacion),
    foreign key(idciudad) references ciudad(idciudad)
);
create table cliente(
	idcliente int not null auto_increment,
    nombre varchar(200),
    correo varchar(200),
    telefono varchar(200),
    fecha DATE,
    idubicacion int,
    primary key(idcliente),
    foreign key (idubicacion) references ubicacion(idubicacion)
);
create table proveedor(
	idproveedor int not null auto_increment,
    nombre varchar(200),
    correo varchar(200),
    telefono varchar(200),
    fecha DATE,
    idubicacion int,
    primary key(idproveedor),
    foreign key (idubicacion) references ubicacion(idubicacion)
);
create table compra(
	idcompra int not null auto_increment,
    idproveedor int,
    idproducto int,
    cantidad int,
    primary key(idcompra),
    foreign key(idproveedor) references proveedor(idproveedor),
    foreign key(idproducto) references producto(idproducto)
);
create table venta(
	idventa int not null auto_increment,
    idcliente int,
    idproducto int,
    cantidad int,
    primary key(idventa),
    foreign key(idcliente) references cliente(idcliente),
    foreign key(idproducto) references producto(idproducto)
);
-- llenando tabla contacto_compania
insert into contacto_compania(contacto) 
select distinct contacto_compania from tblTemporal;

-- llenando tabla compania
insert into compania(idcontacto_compania, correo_compania, telefono_compania) 
select distinct idcontacto_compania, correo_compania, telefono_compania from tblTemporal 
inner join contacto_compania on tblTemporal.contacto_compania = contacto_compania.contacto;

/* llenando categoria producto*/
insert into categoria_producto(categoria)
select distinct categoria_producto from tblTemporal;

/*llenando tabla PRODUCTO*/
insert into producto(producto, precio, idcategoria_producto)
select distinct producto, CAST(precio_unitario as decimal(5,2)) as precio , idcategoria_producto from tblTemporal
inner join categoria_producto on tblTemporal.categoria_producto = categoria_producto.categoria;

/*llenando REGION*/
insert into region(region)
select distinct region from tblTemporal;

/*llenando ciudad*/
insert into ciudad(ciudad, idregion)
select distinct  ciudad, idregion from tblTemporal
inner join region on tblTemporal.region = region.region;


/* LLENANDO UBICACION */
insert into ubicacion(ubicacion, codigo_postal, idciudad)
select distinct direccion, codigo_postal, idciudad from tblTemporal
inner join ciudad on tblTemporal.ciudad = ciudad.ciudad;

/*LLENANDO CLIENTE*/
insert into cliente(nombre, correo, telefono, fecha, idubicacion)
select distinct nombre, correo, telefono, fecha_registro, idubicacion from tblTemporal
INNER JOIN ubicacion on tblTemporal.direccion = ubicacion.ubicacion where tipo = 'C'; 

/*LLENANDO PROVEEDORES*/
insert into proveedor(nombre, correo, telefono, fecha, idubicacion)
select distinct nombre, correo, telefono, fecha_registro, idubicacion from tblTemporal
INNER JOIN ubicacion on tblTemporal.direccion = ubicacion.ubicacion where tipo = 'P'; 

/** LLENANDO COMPRA **/
insert into compra(idproveedor, idproducto, cantidad)
select  idproveedor, idproducto, cantidad from tblTemporal 
inner join proveedor on tblTemporal.nombre = proveedor.nombre
inner join producto on tblTemporal.producto = producto.producto
where tipo = 'P';

/** LLENANDO VENTA **/
insert into venta(idcliente, idproducto, cantidad)
select idcliente, idproducto, cantidad from tblTemporal 
inner join cliente on tblTemporal.nombre = cliente.nombre
inner join producto on tblTemporal.producto = producto.producto
where tipo = 'C';

-- ventas son 2969  
-- compras son 3138


/*FIN MODELO*/



/*INICIO CONSULTAS*/


/* CONSULTA 1*/



select  proveedor.nombre, proveedor.telefono, idcompra as 'Numero de Orden', sum(compra.cantidad * producto.precio) as total  from compra
inner join proveedor on proveedor.idproveedor = compra.idproveedor
inner join producto on producto.idproducto = compra.idproducto
group by proveedor.nombre, proveedor.telefono, idcompra
order by total desc limit 1;

-- ----------------------------



/*consulta 2*/
-- cliente: numero, nombre, apellido, total del cliente que mas productos ha comprado
select cliente.nombre, cliente.telefono, sum(cantidad) as suma from venta
inner join cliente on venta.idcliente= cliente.idcliente
group by cliente.nombre, cliente.telefono 
order by(suma) desc limit 1; 


/*consulta 3*/

/*  es el id 22 y tiene 114 es tatyana barnett  ciudad flint id 22  y id region 19 MI */
-- direccion region, ciudad y codigo postal de proveedores que mas se han comprado y menos

(select ubicacion.ubicacion, ubicacion.codigo_postal, ciudad.ciudad, region.region, proveedor.nombre, count(cantidad) as conteo from compra
inner join proveedor on compra.idproveedor = proveedor.idproveedor
inner join ubicacion on proveedor.idubicacion = ubicacion.idubicacion
inner join ciudad on ubicacion.idciudad = ciudad.idciudad
inner join region on ciudad.idregion = region.idregion
group by ubicacion.ubicacion, ubicacion.codigo_postal, ubicacion.idciudad, ciudad.ciudad, region.region, proveedor.nombre
order by(conteo) desc limit 1)
union all
(select ubicacion.ubicacion, ubicacion.codigo_postal, ciudad.ciudad, region.region, proveedor.nombre, count(cantidad) as conteo from compra
inner join proveedor on compra.idproveedor = proveedor.idproveedor
inner join ubicacion on proveedor.idubicacion = ubicacion.idubicacion
inner join ciudad on ubicacion.idciudad = ciudad.idciudad
inner join region on ciudad.idregion = region.idregion
group by ubicacion.ubicacion, ubicacion.codigo_postal, ubicacion.idciudad, ciudad.ciudad, region.region, proveedor.nombre
order by(conteo) asc limit 1  );

/*consulta 4*/ 
-- numero de ordenes que ha realizado y total de cada uno del top5 compra cat cheese

 -- agregar mas info del cliente  y limit
select cliente.telefono, venta.idcliente, nombre, count(venta.idcliente) as 'Numero de Ordenes',(
select  sum(producto.precio * ventados.cantidad) as sumadinero from venta as ventados
inner join producto on ventados.idproducto = producto.idproducto
inner join categoria_producto on categoria_producto.idcategoria_producto = producto.idcategoria_producto
where ventados.idcliente = venta.idcliente and categoria_producto.categoria = 'Cheese' 
) as total from venta 
inner join cliente on cliente.idcliente = venta.idcliente
inner join producto on producto.idproducto = venta.idproducto
inner join categoria_producto on categoria_producto.idcategoria_producto = producto.idcategoria_producto 
where categoria = 'Cheese' -- categoria 2
group by cliente.telefono, venta.idcliente, nombre 
order by total desc limit 5;



/*consulta 5*/

/*Mostrar el número de mes de la fecha de registro, nombre y apellido de todos
los clientes que más han comprado y los que menos han comprado (en
dinero) utilizando una sola consulta.
*/

(select month(cliente.fecha) as mes,cliente.telefono, cliente.nombre,  sum(venta.cantidad * producto.precio) as total  from venta
inner join cliente on cliente.idcliente = venta.idcliente
inner join producto on producto.idproducto = venta.idproducto
group by cliente.telefono, cliente.nombre, mes
order by total desc limit 99)
union all
(select month(cliente.fecha) as mes, cliente.telefono, cliente.nombre,  sum(venta.cantidad * producto.precio) as total  from venta
inner join cliente on cliente.idcliente = venta.idcliente
inner join producto on producto.idproducto = venta.idproducto
group by cliente.telefono, cliente.nombre, mes
order by total asc limit 99);



/*consulta 6*/
-- nombre categoria mas y menos vendida y total vendido en dinero
-- falta poner el nombre de la categoria  asc union all

(select categoria_producto.categoria as categoria, sum(venta.cantidad * producto.precio) as total   from venta
inner join producto on producto.idproducto = venta.idproducto
inner join categoria_producto on producto.idcategoria_producto = categoria_producto.idcategoria_producto
group by categoria
order by total desc limit 1)
union all
(select categoria_producto.categoria as categoria, sum(venta.cantidad * producto.precio) as total   from venta
inner join producto on producto.idproducto = venta.idproducto
inner join categoria_producto on producto.idcategoria_producto = categoria_producto.idcategoria_producto
group by categoria
order by total asc limit 1);

/*consulta 7*/


select compra.idproveedor, nombre,(
select  sum(producto.precio * comprados.cantidad) as sumadinero from compra as comprados
inner join producto on comprados.idproducto = producto.idproducto
inner join categoria_producto on categoria_producto.idcategoria_producto = producto.idcategoria_producto
where comprados.idproveedor = compra.idproveedor and categoria_producto.categoria = 'Fresh Vegetables' 
) as total from compra 
inner join proveedor on proveedor.idproveedor = compra.idproveedor
inner join producto on producto.idproducto = compra.idproducto
inner join categoria_producto on categoria_producto.idcategoria_producto = producto.idcategoria_producto 
where categoria = 'Fresh Vegetables'
group by compra.idproveedor, nombre 
order by(total) desc
limit 5 ;

/*consulta 8*/

-- mas datos del cliente 

(select ubicacion.ubicacion as direccion, ubicacion.codigo_postal as codigop, ciudad.ciudad as ciudad, region.region as region, ventados.idcliente,
(
select   sum(producto.precio * venta.cantidad) as sumadinero from venta
inner join producto on venta.idproducto = producto.idproducto
where venta.idcliente = ventados.idcliente
) as total
from venta as ventados
inner join cliente on cliente.idcliente = ventados.idcliente
inner join ubicacion on ubicacion.idubicacion = cliente.idubicacion
inner join ciudad on ciudad.idciudad = ubicacion.idciudad
inner join region on region.idregion = ciudad.idregion
group by direccion, codigop, ciudad, region, cliente.idubicacion, ventados.idcliente
order by (total) desc limit 1)
union all
(
select ubicacion.ubicacion as direccion, ubicacion.codigo_postal as codigop, ciudad.ciudad as ciudad, region.region as region, ventados.idcliente,
(
select   sum(producto.precio * venta.cantidad) as sumadinero from venta
inner join producto on venta.idproducto = producto.idproducto
where venta.idcliente = ventados.idcliente
) as total
from venta as ventados
inner join cliente on cliente.idcliente = ventados.idcliente
inner join ubicacion on ubicacion.idubicacion = cliente.idubicacion
inner join ciudad on ciudad.idciudad = ubicacion.idciudad
inner join region on region.idregion = ciudad.idregion
group by direccion, codigop, ciudad, region, cliente.idubicacion, ventados.idcliente
order by (total) asc limit 1
);

select * from region;

/*consulta 9*/   -- nombre, telefono idCompra, total menor cantidad de producto

select proveedor.nombre, proveedor.telefono, idcompra as orden, cantidad from compra
inner join proveedor on compra.idproveedor = proveedor.idproveedor
group by proveedor.nombre, proveedor.telefono, orden, cantidad
order by(cantidad)asc limit 1;

/*consulta 10*/
select nombre, count(categoria) as conteo from venta 
inner join cliente on cliente.idcliente = venta.idcliente
inner join producto on producto.idproducto = venta.idproducto
inner join categoria_producto on categoria_producto.idcategoria_producto = producto.idcategoria_producto 
where categoria = 'Seafood'
group by(nombre)
order by(conteo)desc limit 10;




CREATE DATABASE IF NOT EXISTS ht4;
use ht4;

LOAD DATA INFILE '/var/lib/mysql-files/NotasEC1.csv' 
INTO TABLE notas
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS (carnet, nota);
select * from notas;
create table notas(
	carnet varchar(200),
    nota int
);
/*CONSULTA 1*/
select  AVG(nota) as promedio from notas;
/*CONSULTA 2*/
(select carnet, nota from notas
order by nota asc limit 23)
union all
(select carnet, nota from notas
order by nota desc limit 1);


/*consulta 3*/
(select  AVG(nota) as promedio from notas where carnet >= 201600000 and carnet <= 201700000)
union all 
(select  AVG(nota) as promedio from notas where carnet >= 201700000 and carnet < 201800000)
union all
(select  AVG(nota) as promedio from notas where carnet >= 201800000 and carnet < 201900000);



/*CONSULTA 4*/
select count(nota) as conteo from notas;


