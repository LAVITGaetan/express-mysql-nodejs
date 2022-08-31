const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const services = require('./app/services/render.js')

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

const PORT = process.env.PORT || 7070

require("./app/routes/adherent.routes.js")(app);
require("./app/routes/annuaire.routes.js")(app);
require("./app/routes/mandat.routes.js")(app);
require("./app/routes/portrait.routes.js")(app);
require("./app/routes/representation.routes.js")(app)
app.listen(PORT, () => {
  console.log(`Serveur actif à l'adresse http://localhost:${PORT}`);
})