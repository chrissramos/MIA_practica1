const express = require('express');
const mysqlConnection = require('../database');
const router = express.Router();


/*
    CONSULTAS
*/

//////// CONSULTA 1
router.get('/consulta1', (req, res) => {
    mysqlConnection.query('  select  proveedor.nombre, proveedor.telefono, idcompra as \'Numero de Orden\', sum(compra.cantidad * producto.precio) as total  from compra \
    inner join proveedor on proveedor.idproveedor = compra.idproveedor \
    inner join producto on producto.idproducto = compra.idproducto \
    group by proveedor.nombre, proveedor.telefono, idcompra \
    order by total desc limit 1;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});



//////// CONSULTA 2
router.get('/consulta2', (req, res) => {
    mysqlConnection.query(' select cliente.nombre, cliente.telefono, sum(cantidad) as suma from venta \
    inner join cliente on venta.idcliente= cliente.idcliente \
    group by cliente.nombre, cliente.telefono  \
    order by(suma) desc limit 1; ', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});



//////// CONSULTA 3
router.get('/consulta3', (req, res) => {
    mysqlConnection.query('  (select ubicacion.ubicacion, ubicacion.codigo_postal, ciudad.ciudad, region.region, proveedor.nombre, count(cantidad) as conteo from compra \
    inner join proveedor on compra.idproveedor = proveedor.idproveedor \
    inner join ubicacion on proveedor.idubicacion = ubicacion.idubicacion \
    inner join ciudad on ubicacion.idciudad = ciudad.idciudad \
    inner join region on ciudad.idregion = region.idregion \
    group by ubicacion.ubicacion, ubicacion.codigo_postal, ubicacion.idciudad, ciudad.ciudad, region.region, proveedor.nombre \
    order by(conteo) desc limit 1) \
    union all \
    (select ubicacion.ubicacion, ubicacion.codigo_postal, ciudad.ciudad, region.region, proveedor.nombre, count(cantidad) as conteo from compra \
    inner join proveedor on compra.idproveedor = proveedor.idproveedor \
    inner join ubicacion on proveedor.idubicacion = ubicacion.idubicacion \
    inner join ciudad on ubicacion.idciudad = ciudad.idciudad \
    inner join region on ciudad.idregion = region.idregion \
    group by ubicacion.ubicacion, ubicacion.codigo_postal, ubicacion.idciudad, ciudad.ciudad, region.region, proveedor.nombre \
    order by(conteo) asc limit 1  );', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});

//////// CONSULTA 4
router.get('/consulta4', (req, res) => {
    mysqlConnection.query('   select cliente.telefono, venta.idcliente, nombre, count(venta.idcliente) as \'Numero de Ordenes\',( \
        select  sum(producto.precio * ventados.cantidad) as sumadinero from venta as ventados \
        inner join producto on ventados.idproducto = producto.idproducto \
        inner join categoria_producto on categoria_producto.idcategoria_producto = producto.idcategoria_producto \
        where ventados.idcliente = venta.idcliente and categoria_producto.categoria = \'Cheese\' \
                ) as total from venta \
        inner join cliente on cliente.idcliente = venta.idcliente \
        inner join producto on producto.idproducto = venta.idproducto \
        inner join categoria_producto on categoria_producto.idcategoria_producto = producto.idcategoria_producto \
        where categoria = \'Cheese\' \
        group by cliente.telefono, venta.idcliente, nombre  \
        order by total desc limit 5;  ', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});

//////// CONSULTA 5
router.get('/consulta5', (req, res) => {
    mysqlConnection.query(' (select month(cliente.fecha) as mes,cliente.telefono, cliente.nombre,  sum(venta.cantidad * producto.precio) as total  from venta \
    inner join cliente on cliente.idcliente = venta.idcliente \
    inner join producto on producto.idproducto = venta.idproducto \
    group by cliente.telefono, cliente.nombre, mes \
    order by total desc limit 99) \
    union all \
    (select month(cliente.fecha) as mes, cliente.telefono, cliente.nombre,  sum(venta.cantidad * producto.precio) as total  from venta \
    inner join cliente on cliente.idcliente = venta.idcliente \
    inner join producto on producto.idproducto = venta.idproducto \
    group by cliente.telefono, cliente.nombre, mes \
    order by total asc limit 99);', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});

//////// CONSULTA 6
router.get('/consulta6', (req, res) => {
    mysqlConnection.query('  (select categoria_producto.categoria as categoria, sum(venta.cantidad * producto.precio) as total   from venta \
    inner join producto on producto.idproducto = venta.idproducto \
    inner join categoria_producto on producto.idcategoria_producto = categoria_producto.idcategoria_producto \
    group by categoria \
    order by total desc limit 1) \
    union all \
    (select categoria_producto.categoria as categoria, sum(venta.cantidad * producto.precio) as total   from venta \
    inner join producto on producto.idproducto = venta.idproducto \
    inner join categoria_producto on producto.idcategoria_producto = categoria_producto.idcategoria_producto \
    group by categoria \
    order by total asc limit 1);', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});


//////// CONSULTA 7
router.get('/consulta7', (req, res) => {
    mysqlConnection.query(' select compra.idproveedor, nombre,( \
        select  sum(producto.precio * comprados.cantidad) as sumadinero from compra as comprados \
        inner join producto on comprados.idproducto = producto.idproducto \
        inner join categoria_producto on categoria_producto.idcategoria_producto = producto.idcategoria_producto \
        where comprados.idproveedor = compra.idproveedor and categoria_producto.categoria = \'Fresh Vegetables\' \
        ) as total from compra \
        inner join proveedor on proveedor.idproveedor = compra.idproveedor \
        inner join producto on producto.idproducto = compra.idproducto \
        inner join categoria_producto on categoria_producto.idcategoria_producto = producto.idcategoria_producto  \
        where categoria = \'Fresh Vegetables\' \
        group by compra.idproveedor, nombre  \
        order by(total) desc \
        limit 5 ;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});

//////// CONSULTA 8
router.get('/consulta8', (req, res) => {
    mysqlConnection.query(' (select ubicacion.ubicacion as direccion, ubicacion.codigo_postal as codigop, ciudad.ciudad as ciudad, region.region as region, ventados.idcliente, \
        ( \
        select   sum(producto.precio * venta.cantidad) as sumadinero from venta \
        inner join producto on venta.idproducto = producto.idproducto \
        where venta.idcliente = ventados.idcliente \
        ) as total \
        from venta as ventados \
        inner join cliente on cliente.idcliente = ventados.idcliente \
        inner join ubicacion on ubicacion.idubicacion = cliente.idubicacion \
        inner join ciudad on ciudad.idciudad = ubicacion.idciudad \
        inner join region on region.idregion = ciudad.idregion \
        group by direccion, codigop, ciudad, region, cliente.idubicacion, ventados.idcliente \
        order by (total) desc limit 1) \
        union all \
        ( \
        select ubicacion.ubicacion as direccion, ubicacion.codigo_postal as codigop, ciudad.ciudad as ciudad, region.region as region, ventados.idcliente, \
        ( \
        select   sum(producto.precio * venta.cantidad) as sumadinero from venta \
        inner join producto on venta.idproducto = producto.idproducto \
        where venta.idcliente = ventados.idcliente \
        ) as total \
        from venta as ventados \
        inner join cliente on cliente.idcliente = ventados.idcliente \
        inner join ubicacion on ubicacion.idubicacion = cliente.idubicacion \
        inner join ciudad on ciudad.idciudad = ubicacion.idciudad \
        inner join region on region.idregion = ciudad.idregion \
        group by direccion, codigop, ciudad, region, cliente.idubicacion, ventados.idcliente \
        order by (total) asc limit 1 \
        );', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});

//////// CONSULTA 9
router.get('/consulta9', (req, res) => {
    mysqlConnection.query('select proveedor.nombre, proveedor.telefono, idcompra as orden, cantidad from compra \
    inner join proveedor on compra.idproveedor = proveedor.idproveedor \
    group by proveedor.nombre, proveedor.telefono, orden, cantidad \
    order by(cantidad)asc limit 1;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});


//////// CONSULTA 10
router.get('/consulta10', (req, res) => {
    mysqlConnection.query(' select nombre, count(categoria) as conteo from venta \
    inner join cliente on cliente.idcliente = venta.idcliente \
    inner join producto on producto.idproducto = venta.idproducto \
    inner join categoria_producto on categoria_producto.idcategoria_producto = producto.idcategoria_producto \
    where categoria = \'Seafood\' \
    group by(nombre) \
    order by(conteo)desc limit 10;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});

/**********************************------MODELO-----************************************************************************/
router.get('/eliminarModelo', (req, res) => {
    mysqlConnection.query('SET FOREIGN_KEY_CHECKS = 0;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('truncate table venta;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('truncate table compra; ', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('truncate table proveedor;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('truncate table cliente; ', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('truncate table ubicacion;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('truncate table ciudad;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('truncate table region;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('truncate table producto; ', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('truncate table categoria_producto; ', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('truncate table compania;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('truncate table contacto_compania; ', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('SET FOREIGN_KEY_CHECKS = 1;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});

router.get('/cargarModelo', (req, res) => {
    mysqlConnection.query('insert into contacto_compania(contacto) \
    select distinct contacto_compania from tblTemporal;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('insert into compania(idcontacto_compania, correo_compania, telefono_compania) \
    select distinct idcontacto_compania, correo_compania, telefono_compania from tblTemporal  \
    inner join contacto_compania on tblTemporal.contacto_compania = contacto_compania.contacto;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('insert into categoria_producto(categoria) \
    select distinct categoria_producto from tblTemporal;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('insert into producto(producto, precio, idcategoria_producto) \
    select distinct producto, CAST(precio_unitario as decimal(5,2)) as precio , idcategoria_producto from tblTemporal \
    inner join categoria_producto on tblTemporal.categoria_producto = categoria_producto.categoria;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('insert into region(region) \
    select distinct region from tblTemporal;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('insert into ciudad(ciudad, idregion) \
    select distinct  ciudad, idregion from tblTemporal \
    inner join region on tblTemporal.region = region.region;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('insert into ubicacion(ubicacion, codigo_postal, idciudad) \
    select distinct direccion, codigo_postal, idciudad from tblTemporal \
    inner join ciudad on tblTemporal.ciudad = ciudad.ciudad;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('insert into cliente(nombre, correo, telefono, fecha, idubicacion) \
    select distinct nombre, correo, telefono, fecha_registro, idubicacion from tblTemporal \
    INNER JOIN ubicacion on tblTemporal.direccion = ubicacion.ubicacion where tipo = \'C\'; ', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('insert into proveedor(nombre, correo, telefono, fecha, idubicacion) \
    select distinct nombre, correo, telefono, fecha_registro, idubicacion from tblTemporal \
    INNER JOIN ubicacion on tblTemporal.direccion = ubicacion.ubicacion where tipo = \'P\'; ', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('insert into compra(idproveedor, idproducto, cantidad) \
    select  idproveedor, idproducto, cantidad from tblTemporal  \
    inner join proveedor on tblTemporal.nombre = proveedor.nombre \
    inner join producto on tblTemporal.producto = producto.producto \
    where tipo = \'P\';', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
    mysqlConnection.query('insert into venta(idcliente, idproducto, cantidad) \
    select idcliente, idproducto, cantidad from tblTemporal \
    inner join cliente on tblTemporal.nombre = cliente.nombre \
    inner join producto on tblTemporal.producto = producto.producto \
    where tipo = \'C\';', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});


/**************************************TABLA TEMPORAL************************************************************/
router.get('/eliminarTemporal', (req, res) => {
    mysqlConnection.query('TRUNCATE TABLE tblTemporal;', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});

router.get('/cargarTemporal', (req, res) => {
    mysqlConnection.query('  LOAD DATA INFILE \'/var/lib/mysql-files/MIA/DataCenterData.csv\' INTO TABLE tblTemporal FIELDS TERMINATED BY \';\' ENCLOSED BY \'"\'  LINES TERMINATED BY \'\n\'  IGNORE 1 ROWS (nombre_compania,contacto_compania, correo_compania, telefono_compania, tipo, nombre, correo, telefono, @datevar, direccion, ciudad, codigo_postal, region, producto, categoria_producto, cantidad, precio_unitario) set fecha_registro=str_to_date(@datevar, \'%d/%m/%Y\');     ', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});

router.get('/verTemporal', (req, res) => {
    mysqlConnection.query(' select * from tblTemporal; ', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else{
            console.log(err);
        }
    });
});
module.exports = router;