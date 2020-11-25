const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'postgres',
    database: 'test',
    password: 'password',
    port: 5432
});

app.use(cors());
app.use(bodyParser.json());
app.listen(21000, () => {
    console.log('Server is running.');
});

//teste
app.get('/', (request, response) => {
    response.json({ info: 'It works!' })
  });

//Inserir  
app.post('/api/v1/artista',(req,res) => {
    const {seq_artista, dsc_nome, dsc_estudio,num_telefone,dsc_foto_url,dsc_endereco} = req.body;

    pool.query(
        'INSERT INTO ARTISTA (SEQ_ARTISTA,DSC_NOME,DSC_ESTUDIO,NUM_TELEFONE,DSC_FOTO_URL,DSC_ENDERECO) VALUES($1,$2,$3,$4,$5,$6)',
        [seq_artista, dsc_nome, dsc_estudio,num_telefone,dsc_foto_url,dsc_endereco],
        (error, results) => {
            if(error){
                throw error;
            }

            res.sendStatus(201);
        }
    );
});

app.get("/api/v1/artistaCategoria/:id",(req,res) => {
    pool.query(
        "SELECT CA.DSC_CATEGORIA " +
        "FROM CATEGORIAS CA " +
        "JOIN ARTISTA_CATEGORIA AC ON AC.SEQ_CATEGORIA = CA.SEQ_CATEGORIA AND AC.SEQ_ARTISTA = $1",
        [id],
        (error,results) => {
            if(error){
                throw error;
            }

            res.status(200).json(results.rows);
        }
    );
});

//Buscar todos
app.get("/api/v1/artista",(req,res) => {
    pool.query(
        "SELECT * FROM ARTISTA",
        [],
        (error,results) => {
            if (error){
                throw error;
            }

            res.status(200).json(results.rows);
        }
    );
});

//Buscar por ID
app.get("/api/v1/artista/:id", (req,res) => {
    const {id} = req.params;

    pool.query(
        "SELECT * FROM ARTISTA WHERE SEQ_ARTISTA = $1",
        [id],
        (error,results) => {
            if(error){
                throw error;
            }

            res.status(200).json(results.rows);
        }
    );
});

//UPDATE
app.put("/api/v1/artista/:id", (req,res) => {
    const {id} = req.params;
    const {dsc_nome,dsc_estudio,num_telefone,dsc_foto_url,dsc_endereco} = req.body;

    pool.query(
        "UPDATE ARTISTA SET DSC_NOME = $1, DSC_ESTUDIO = $2, NUM_TELEFONE = $3, DSC_FOTO_URL = $4, DSC_ENDERECO = $5 WHERE SEQ_ARTISTA = $6",
        [dsc_nome,dsc_estudio,num_telefone,dsc_foto_url,dsc_endereco,id],
        (error,results) => {
            if(error){
                throw error;
            }

            res.sendStatus(200);
        }
    );
});

app.delete("/api/v1/artista/:id" ,(req,res) => {
    const {id} = req.params;

    pool.query("DELETE FROM ARTISTA WHERE SEQ_ARTISTA = $1", 
    [id],
    (error,results) => {
        if(error){
        throw error;
        
        }

        res.sendStatus(200);
    });
});

