const pg = require('pg');

//A config do banco tem que ir para um doc .env
const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'streammotodb',
    password: '2606',
    port: 5432,
};
const connectionString = "postgres://postgres:2606@database_server:5432/streammotodb";

function NovaConexao(){
    return new pg.Client(connectionString);
}

module.exports = {
    NovaConexao
};

