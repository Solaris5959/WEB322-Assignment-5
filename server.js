/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Connor McDonald        Student ID: 136123221      Date: 11/04/2023
*
*  Published URL: https://agreeable-ox-sandals.cyclic.cloud
*
********************************************************************************/


const legoData = require("./modules/legoSets");
const express = require('express');
var path = require('path');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.set('view engine', 'ejs');

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
    res.send(err);
  }
  
});

app.get("/lego/sets/:id", async (req,res)=>{
  try{
    let legoSet = await legoData.getSetByNum(req.params.id);
    res.render("set", {set: legoSet});
  }catch(err){
    res.send(err);
  }
});

app.use((req, res) => {
  res.status(404).render('404')
});

legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});