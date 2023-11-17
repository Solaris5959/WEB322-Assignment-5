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
const Sequelize = require('sequelize');


const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


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
      let sets = await legoData.getSetsByTheme(req.query.theme);
      res.render("sets",{sets: sets});
    }
    else {
      let sets = await legoData.  getAllSets();
      res.render("sets",{sets: sets});
    }
  } catch(err) {
    res.render('404', {message: err});
  }
});

app.get("/lego/sets/:id", async (req,res)=>{
  try{
    let set = await legoData.getSetByNum(req.params.id);
    res.render("set", {set: set});
  }catch(err){
    res.render('404', {message: err});
  }
});

app.get("/lego/addSet", async (req,res)=>{
  try{
    let themeData = await legoData.getAllThemes();
    res.render("addSet", {theme: themeData});
  }catch(err){
    res.render('404', {message: err});
  }
});

app.post("/lego/addSet", async (req,res)=>{
  try{
    await legoData.addSet(req.body);
    res.redirect("/lego/sets");
  }catch(err){
    res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
});




app.use((req, res) => {
  res.status(404).render('404', {message: "I'm Sorry, we're unable to find the page you were looking for (︶︹︺)"})
});

legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});