
// ======================
// Puerto
// ======================

process.env.PORT = process.env.PORT || 3000;

// ======================
// Entorno
// ======================
// si la variable no existe entonces estoy en entorno de desarrollo

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======================
// Vencimiento del token
// ======================
// expira en 60 seg 60 min 24 hs 30 dias
process.env.CADUCIDAD_TOKEN =  60 * 60 * 24 * 30

// ======================
// SEED o semilla de autenticacion 
// ======================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'


// ======================
// Base de datos
// ======================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    
    urlDB = 'mongodb://localhost:27017/cafe'
   
} else {
    urlDB = process.env.MONGO_URI // creamos la variable en consola con heroku para protegerla en GitHub => heroku config:set MONGO_URI="escribirurl"
}


process.env.URLDB = urlDB

// ======================
// Client ID de google
// ======================
process.env.CLIENT_ID = process.env.CLIENT_ID || '113170598534-5p4308sa0eotbv4ja2vbftgb9ka93uhp.apps.googleusercontent.com' 
