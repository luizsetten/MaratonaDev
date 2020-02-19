const express = require('express');
const server = express();
const nunjucks = require('nunjucks');


//configurar servidor para apresentar arquivos estáticos
server.use(express.static('public'));

//habilitar o body do formulário
server.use(express.urlencoded({ extended: true}));

// configurar a conexão com o banco de dados
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'luizsetten',
    password: '524524',
    host: 'localhost',
    port: 5432,
    database: 'doe'
});


//configurando a template engine
nunjucks.configure('./', {
    express: server,
    noCache: true
});

//Lista de doadores


server.get('/', function(req,res) {
    db.query(`SELECT * FROM donors`, (error, result) => {
        if(error) return res.send("Erro no banco de dados.");

        const donors = result.rows;
        return res.render('index.html', {donors});

    });
    
});

server.post('/', (req,res) => {
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if(name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios!");
    }

    //coloca valores dentro do banco de dados
    const query = `INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)`;

    const values = [name, email, blood];

    db.query(query, values, (error) => {
        if(error) return res.send("Erro no banco de dados.");

        return res.redirect('/');
    });


});

server.listen(3000, () => {
    console.log('Servidor listando http://localhost:3000');
});
