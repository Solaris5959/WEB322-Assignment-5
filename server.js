/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Connor McDonald        Student ID: 136123221      Date: 11/15/2023
*
*  Published URL: 
*
********************************************************************************/


const legoData = require("./modules/legoSets");
const express = require('express');
var path = require('path');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.set('view engine', 'ejs');

// Postgres Database
const postgres = require('postgres');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

getPgVersion();

// Middleware

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get("/lego/sets", async (req,res)=>{    
  try {
    if (req.query.theme) {
      let legoSets = await legoData.getSetsByTheme(req.query.theme);
      res.render("sets",{sets: legoSets});
    }
    else {
      let legoSets = await legoData.getAllSets();
      res.render("sets",{sets: legoSets});
    }
  } catch(err) {
    // not sure why this one just doesn't work. getSetsByTheme isn't rejecting for some reason
    res.render('404', {message: err});
  }
  
});

app.get("/lego/sets/:id", async (req,res)=>{
  try{
    let legoSet = await legoData.getSetByNum(req.params.id);
    res.render("set", {set: legoSet});
  }catch(err){
    res.render('404', {message: err});
  }
});

app.use((req, res) => {
  res.status(404).render('404', {message: "I'm Sorry, we're unable to find the page you were looking for (︶︹︺)"})
});

legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});