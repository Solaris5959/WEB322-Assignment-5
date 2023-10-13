const legoData = require("./modules/legoSets");

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Assignment 2:  Student Name - Student Id');
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

legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});