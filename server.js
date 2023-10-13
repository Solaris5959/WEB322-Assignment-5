const legoData = require("./modules/legoSets");
var path = require('path');

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'))
});

app.get("/lego/sets", async (req,res)=>{
  let sets = await legoData.getAllSets();
  res.send(sets);
});

app.get("/lego/sets/id-demo", async (req,res)=>{
  try{
    let set = await legoData.getSetByNum("001-1");
    res.send(set);
  }catch(err){
    res.send(err);
  }
});

app.get("/lego/sets/theme-demo", async (req,res)=>{
  try{
    let sets = await legoData.getSetsByTheme("tech");
    res.send(sets);
  }catch(err){
    res.send(err);
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '/views/404.html'))
});

legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});