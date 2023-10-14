const legoData = require("./modules/legoSets");
const express = require('express');
var path = require('path');
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
  try {
    if (req.query.theme) {
      let sets = await legoData.getSetsByTheme(req.query.theme);
      res.send(sets);
    }
    else {
      let sets = await legoData.getAllSets();
      res.send(sets);
    }
  } catch(err) {
    res.send(err);
  }
  
});

app.get("/lego/sets/:id", async (req,res)=>{
  try{
    let set = await legoData.getSetByNum(req.params.id);
    res.send(set);
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