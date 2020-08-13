const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'la descripcion es obligatoria'],
        unique: [true, 'La clase ya existe']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

categoriaSchema.methods.toJSON = function (){
    let user = this;
    let userObject = user.toObject();

    return userObject;
}


categoriaSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser unico'})

module.exports = mongoose.model('Categoria', categoriaSchema)

