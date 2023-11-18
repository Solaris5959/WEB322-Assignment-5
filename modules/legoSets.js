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

function initialize() {
  return new Promise(async (resolve, reject) => {
    try {
      await sequelize.sync();
      resolve();
    }catch(err){
      reject(err.message);
    }
  });
}

// get all sets in DB
function getAllSets() {
  return new Promise((resolve, reject) => {
    Set.findAll({
      include: [Theme],
    }).then((sets) => {
      resolve(sets);
    }).catch((err) => {
      reject(err.message);
    });
  });
}

// get single set with set_num matching param
function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    Set.findAll({
      where: {set_num: setNum},
      include: [Theme]
    }).then((set) => {
      resolve(set[0]); // returns just the set found
    }).catch((err) => {
      reject("unable to find requested set");
    });
  });
}

// get all sets with theme matching param
function getSetsByTheme(theme) {
  return new Promise((resolve, reject) => {
    Set.findAll({
      include: [Theme],
      where: {
        '$Theme.name$': { [Sequelize.Op.iLike]: `%${theme}%` }
      }
    })
      .then((sets) => {
        resolve(sets); // Return an array of sets matching the theme
      })
      .catch((err) => {
        reject("Unable to find requested sets");
      });
  });
}

// add a new set with data = setData
function addSet(setData) {
  return new Promise((resolve, reject) => {
    Set.create({
      set_num: setData.set_num,
      name: setData.name,
      year: setData.year,
      num_parts: setData.num_parts,
      theme_id: setData.theme_id,
      img_url: setData.img_url,
    }).then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

// return list of all themes
function getAllThemes() {
  return new Promise((resolve, reject) => {
    Theme.findAll({})
      .then((themes) => {
        resolve(themes);
      })
      .catch((err) => {
        reject(err.message);
      })
  })
}

// update set with set_num matching setNum with data = setData
function editSet(setNum, setData) {
  return new Promise((resolve, reject) => {
    Set.update({
      set_num: setData.set_num,
      name: setData.name,
      year: setData.year,
      num_parts: setData.num_parts,
      theme_id: setData.theme_id,
      img_url: setData.img_url,
    }, {
      where: {set_num: setNum}
    }).then(() => {
      resolve();
    }).catch((err) => {
      reject(err.errors[0].message);
    });
  });
}

// delete set with set_num matching setNum
function deleteSet(setNum) {
  return new Promise((resolve, reject) => {
    Set.destroy({
      where: {set_num: setNum}
    }).then(() => {
      resolve();
    }).catch((err) => {
      reject(err.errors[0].message);
    });
  });
} 

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, addSet, getAllThemes, editSet, deleteSet }