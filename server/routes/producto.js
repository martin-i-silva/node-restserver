const express = require('express');
const _ = require('underscore');

const Producto = require('../models/producto')
const { verificaToken, verificaAdmin_Role } = require('../middlewares/Autenticacion');
const { query } = require('express');
const producto = require('../models/producto');

const app = express();

// ======== Obtener productos ==========
app.get('/productos', verificaToken, (req, res)=>{

    Producto.find({disponible: true})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos)=>{
            if(err){
                return res.status(400).json({
                     ok: false,
                     err
                 })
             }
             
             res.json({
                ok: true,
                productos
            }) 

        })
})


// ======== Obtener producto por id ==========

app.get('/productos/:id', verificaToken, (req, res)=>{
    let id = req.params.id;

    let body = req.body;

    Producto.findById(id, body, {new: true, runValidators: true, context: 'query'})
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false, 
                err
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {message: 'No existe el producto en la base de datos'}
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })

})
// ======== Buscar producto ==========

app.get('/productos/buscar/:termino', verificaToken, (req, res)=>{

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria', 'nombre')
        .exec((err, productos)=>{
            if(err){
                return res.status(500).json({
                    ok: false, 
                    err,
                })
            }
            if(!productos){
                return res.status(400).json({
                    ok: false,
                    err: {message: 'No existe el producto en la base de datos'}
                })
            }
            res.json({
                ok: true, 
                productos 
            })
        })
})



// ======== Crear producto ==========
app.post('/productos', verificaToken, (req, res)=>{
    //console.log(req)
    let body = req.body;


    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB)=>{
        if(err){
            return res.status(500).json({
                 ok: false,
                 err
             })
         }
         if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

// ======== Modificar producto ==========
app.put('/productos/:id', verificaToken, (req, res)=>{

    let id = req.params.id;
    let body = req.body

    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!productoDB){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'No existe el producto con el ID indicado'
                }
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })



} )



// // ======== Eliminar producto ==========

app.delete('/productos/:id', verificaToken, (req, res)=>{

    let id = req.params.id;
   

    Producto.findById(id, {new: true, runValidators: true, context: 'query'}, (err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!productoDB){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'No existe el producto con el ID indicado'
                }
            })
        }
        productoDB.disponible = false;
        productoDB.save((err, productoBorrado)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
           
            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto borrado'
            })
    

        })
        


    })


} )

// app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res)=>{

//     let id = req.params.id;
    
//     Categoria.findByIdAndRemove(id, {new: true, runValidators: true, context: query}, (err, categoriaBorrada)=>{
//         if(err){
//             return res.status(400).json({
//                  ok: false,
//                  err
//                 })
//         }
//         if(!categoriaBorrada){
//             return res.status(400).json({
//                 ok: false,
//                 err: {message: 'Categoria no encontrada'}
//             })
//         }

//         res.json({
//             ok: true,
//             message: 'La categoria ha sido borrada',
//             categoria: categoriaBorrada
//         })

//     })


// })



module.exports = app;