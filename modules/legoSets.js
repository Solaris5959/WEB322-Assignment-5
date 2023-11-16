const setData = require("../data/setData");
const themeData = require("../data/themeData");
require('dotenv').config();
const Sequelize = require('sequelize');

let sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });

const Theme = sequelize.define('Theme', {
    id: { 
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  },
);

const Set = sequelize.define('Set', {
    set_num: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  },
);

Set.belongsTo(Theme, {foreignKey: 'theme_id'})

let sets = [];

function initialize() {
  return new Promise((resolve, reject) => {
    setData.forEach(setElement => {
      let setWithTheme = { ...setElement, theme: themeData.find(themeElement => themeElement.id == setElement.theme_id).name }
      sets.push(setWithTheme);
      resolve();
    });
  });

}

function getAllSets() {
  return new Promise((resolve, reject) => {
    resolve(sets);
  });
}

function getSetByNum(setNum) {

  return new Promise((resolve, reject) => {
    let foundSet = sets.find(s => s.set_num == setNum);

    if (foundSet) {
      resolve(foundSet)
    } else {
      reject("Unable to find requested set");
    }

  });

}

function getSetsByTheme(theme) {

  return new Promise((resolve, reject) => {
    let foundSets = sets.filter(s => s.theme.toUpperCase().includes(theme.toUpperCase()));

    if (foundSets) {
      resolve(foundSets)
    } else {
      reject("Unable to find requested sets");
    }

  });

}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }