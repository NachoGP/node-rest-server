const express = require ('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();


app.get ('/usuario', function(req,res){


      //{estado:true}

      let desde = req.query.desde || 0;
      desde = Number(desde);

      let limite = req.query.limite || 5;
      limite = Number(limite)
      Usuario.find({}, 'nombre email rol estado google img')
            .skip(desde) //Con esto se salta los 5 primeros registros
            .limit(limite) //Este limite se establece para que al suaurio solo se le devuelvan 5 registros. Con limite ya controlaré cuantos quiero
            .exec((err, usuarios)=>{

                  if (err) {
                        return res.status(400).json({
                              ok: false,
                              err
                        });
                  }

                  Usuario.count({}, (err, conteo)=>{
                        res.json({
                              ok:true,
                              usuarios, 
                              cuantos: conteo
                        });
                  })
                 

            })



});
app.post('/usuario', function(req,res){

   let body = req.body;
   
   let usuario = new Usuario({
         nombre: body.nombre,
         email: body.email,
         role: body.role,
         estado:body.estado,
         password: bcrypt.hashSync(body.password,10)
       
   });

      //¿Cómo guardo el objeto Usuario en la base de datos. Palabra seresrvada 'save'
      usuario.save((err, usuarioDB) => {

            if (err) {
                  return res.status(400).json({
                        ok: false,
                        err
                  });
            }
           // usuarioDB.password = null;
            res.json({
                  ok: true,
                  usuario: usuarioDB
            });
      });
});

app.put('/usuario/:id', function(req,res){
   
   let id = req.params.id;
   let body = _.pick(req.body, ['nombre','email','img','role','estado']);

   Usuario.findByIdAndUpdate(id, body, {new:true, runValidators:true}, (err, usuarioDB)=>{
      
      if (err) {
            return res.status(400).json({
                  ok: false,
                  err
            });
      }

      res.json({
            ok:true,
            usuario: usuarioDB
         });
   })

});


app.delete('/usuario/:id', function(req,res){

  // 1. Obtenemos el Id
      let id = req.params.id;

//3. cambiar el estado cuando este borrado a false. 
let cambioEstado = {
      estado:false
}

//2. Ellminamos el registro
      Usuario.findByIdAndUpdate(id, (err, usuarioBorrado)=>{
      //Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
            if (err) {
                  return res.status(400).json({
                        ok: false,
                        err
                  });
            }
            //Si viniera un usuario ya borrado
            if (!usuarioBorrado) {
                  return res.status(400).json({
                        ok: false,
                        err:{
                              message: 'Usuario no encontrado'
                        }
                  });
            }



            res.json({
                  ok:true, 
                  usuario:usuarioBorrado
            })

      })


});




module.exports=app;