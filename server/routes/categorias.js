const express = require('express');
const _ = require('underscore');

const Categoria = require('../models/categorias')
const { verificaToken, verificaAdmin_Role } = require('../middlewares/Autenticacion');
const { query } = require('express');

const app = express();

// ======== Obtener categorias ==========
app.get('/categoria', verificaToken , (req, res)=> {
 
    let desde = Number(req.query.desde) || 0;
    //desde = Number(desde);
    let limite = Number(req.query.limite) || 5;
    

 Categoria.find({ })
        // .skip(desde)
        // .limit(limite)
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias)=>{
            if(err){
                return res.status(400).json({
                     ok: false,
                     err
                 })
             }

             Categoria.countDocuments({estado: true}, (err, count)=>{
                if(err){
                    return res.status(400).json({
                         ok: false,
                         err
                     })
                 }
                 res.json({
                     ok: true,
                     total: count,
                     totalRequerido: categorias.length,
                     categorias
                 }) 
             })
        })
 

})

// ======== Obtener categoria por id ==========
app.get('/categoria/:id', verificaToken, (req, res)=> {
    
    let id = req.params.id;
    //let body = _.pick(req.body, ['descripcion', 'usuario'] );
    let body = req.body;    
        Categoria.findById(id, body, {new: true, runValidators: true, context: 'query'}, (err, categoriaDB)=>{ 
            if(err){
                return res.status(400).json({
                     ok: false,
                     err
                     
                 })
             }
             if(!categoriaDB){
                return res.status(400).json({
                    ok: false,
                    err: {message: 'No existe la categoria con ese ID'}
                })
            }
             res.json({
                 ok: true,
                 categoria: categoriaDB
             })


        })

    })

// ======== Crear categoria ==========
app.post('/categoria', verificaToken, (req, res)=>{
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                 ok: false,
                 err
             })
         }
         if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }
         res.json({
             ok: true,
             categoria: categoriaDB
         })
    })
console.log(categoria)


})
// ======== Modificar categoria ==========

app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res)=>{

    let id = req.params.id;
    //let body = _.pick(req.body, ['nombre', 'tipo', 'estado'] );
    let body = req.body;
    console.log(body)
    let descCategoria = {descripcion: body.descripcion};

    
        Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true, context: 'query'}, (err, categoriaDB)=>{ 
            if(err){
                return res.status(500).json({
                     ok: false,
                     err
                     
                 })
             }
             if(!categoriaDB){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
             res.json({
                 ok: true,
                 categoria: categoriaDB
             })
        })
});

// ======== Eliminar categoria ==========

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res)=>{

    let id = req.params.id;
    
    Categoria.findByIdAndRemove(id, {new: true, runValidators: true, context: query}, (err, categoriaBorrada)=>{
        if(err){
            return res.status(500).json({
                 ok: false,
                 err
                })
        }
        if(!categoriaBorrada){
            return res.status(400).json({
                ok: false,
                err: {message: 'Categoria no encontrada'}
            })
        }

        res.json({
            ok: true,
            message: 'La categoria ha sido borrada',
            categoria: categoriaBorrada
        })

    })


})




module.exports = app;