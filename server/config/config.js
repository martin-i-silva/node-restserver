
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
// Base de datos
// ======================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    
    urlDB = 'mongodb://localhost:27017/cafe'
   
} else {
    urlDB = process.env.MONGO_URI // creamos la variable en consola con heroku para protegerla en GitHub => heroku config:set MONGO_URI="escribirurl"
}


process.env.URLDB = urlDB