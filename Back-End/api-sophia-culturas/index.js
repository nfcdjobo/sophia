const express = require('express');
const cookieParser = require('cookie-parser');
const nodemon = require('nodemon');
const path=require('path');


const cors = require('cors');
const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next(); 
});

// app.use(express.static(path.join(__dirname, 'stockage')));

app.use('/stockage', express.static(path.join(__dirname, 'stockage')));

const port = process.env.PORT || 3005;
const routing = require('./routes/routing');
app.use(routing);
const {mongoose} = require('./dbconnect/dbconnexion');
const { static } = require('express');
app.listen(port, ()=>{console.log(`Le server est est bien démarré sur le port ${port}. Ouvrez le lient http://localhost:${port} pour voir le message`)});

