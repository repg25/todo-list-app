//Archivo de configuracion para conexion a DB
const sql = require('mssql');
require('dotenv').config();

//Configuracion de la conexion a la base de datos
const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        trustedConnection: true,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let poolPromise;

const getConnection = async () => {
    if( !poolPromise ) {
        poolPromise = sql.connect(config)
            .then(pool => {
                console.log('Conectado a Base de datos - SQL Server: ', process.env.DB_DATABASE);
            })
            .catch(err => {
                console.log('Error de conexion a SQL Server:', err);
                poolPromise = null; // reiniciar poolPromise para intentar reconectar en el futuro
                throw err;
            });
    }
    return poolPromise;
};

module.exports = {
    sql, getConnection
};