require('dotenv').config();
if (!process.env.PORT) {
    throw new Error('El puerto no está definido. Asegúrate de tener un archivo .env con PORT=3000');
}
module.exports = {
    PORT: process.env.PORT,
}