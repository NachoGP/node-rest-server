const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos ={
   values:['ADMIN_ROLE', 'USER_ROLE'],
   message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
   nombre: {
      type: String,
      required:[true, 'El nombre es necesario']
   }, 
   email: {
      type: String,
      unique:true,
      required: [true, ' El email es obligatorio']

   }, 
   password:{
      type: String,
      required: [true, ' El password es necesario']
   }, 
   img:{
      type: String,
      required: false
   }, //No es olbigatoria
   role:{
type: String,
default: 'USER_ROLE',
enum: rolesValidos

   }, // default: 'USER_ROLE'
   estado:{
      type:Boolean, 
      dafault: true
   }, //boolean
   google:{
      type: String, 
      default: false
   } // boolean
});

usuarioSchema.methods.toJSON = function(){
   let user = this;
   let userObject = user.toObject();
   delete userObject.password;

   return userObject;
}
usuarioSchema.plugin(uniqueValidator,{
   message:'{PATH} debe de ser único'
})

module.exports = mongoose.model('Usuario', usuarioSchema);