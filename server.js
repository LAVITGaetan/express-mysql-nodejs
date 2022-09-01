const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const services = require('./app/services/render.js');
const fileUpload = require('express-fileupload');
const fetch = require('node-fetch');
const { response } = require('express');

var corsOptions = {
  origin: "http://localhost:7070"
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs')

// Static Files
app.use(express.static('public'));

app.use(fileUpload({
  limits: {
    fileSize: 10000000, // Around 10MB
  },
  abortOnLimit: true,
}))

// Session

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Authentification 
app.post('/auth', services.auth);

// Connexion
app.get('/', services.login)

// Accueil
app.get('/accueil', services.index)

// Adhérents
app.get('/adherents', services.adherents)
app.get('/adherent', services.adherent)
app.get('/nouvel-adherent', services.newAdherent)
app.get('/edit-adherent', services.editAdherent)

// Mandats
app.get('/mandats', services.mandats)
app.get('/mandat', services.mandat)
app.get('/nouveau-mandat', services.newMandat)
app.get('/edit-mandat', services.editMandat)

// Portraits
app.get('/portraits', services.portraits)
app.get('/portrait', services.portrait)
app.get('/nouveau-portrait', services.newPortrait)
app.get('/edit-portrait', services.editPortrait)

// Annuaires
app.get('/edit-annuaire', services.editAnnuaire)

//upload
app.post('/upload', (req, res) => {
  const uri = `http://localhost:7070/api/portraits/`;
  let nom = req.body.nom;
  let prenom = req.body.prenom;
  if (req.files) {
    const { image } = req.files;
    path = nom + prenom + '_' + image.name
    image.mv(__dirname + '/public/upload/' + nom + prenom + '_' + image.name);
  }
  else {
    path = '';
  }

  fetch(`${uri}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: path, nom: nom, prenom: prenom })
  })

  let portraits = [];
  let representations = [];
  const result = fetch(uri)
    .then((response) => response.json())
    .then((response) => {
      response.forEach(item => {
        portraits.push(item)
      })
      return fetch(`http://localhost:7070/api/representations/`)
        .then((response) => response.json())
        .then((response) => {
          response.forEach(item => {
            representations.push(item)
          })
        })
    })

  result.then(r => {
    if (req.session.loggedin) {
      res.render('pages/portraits', { portraits: portraits, title: "Portraits", representations: representations, message: `${prenom} ${nom} ajouté` });
    }
    else {
      res.send("Veuillez vous connecter pour accéder à cette page")
    }
  })
});

const PORT = process.env.PORT || 7070

require("./app/routes/adherent.routes.js")(app);
require("./app/routes/annuaire.routes.js")(app);
require("./app/routes/mandat.routes.js")(app);
require("./app/routes/portrait.routes.js")(app);
require("./app/routes/representation.routes.js")(app)
app.listen(PORT, () => {
  console.log(`Serveur actif => http://localhost:${PORT}`);
})