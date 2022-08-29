const express = require('express');
const cors = require('cors');
const app = express();
const fetch = require('node-fetch');
const session = require('express-session');
const connection = require('./app/models/db.js')
const services = require('./app/services/render.js')

var corsOptions = {
  origin: "http://localhost:7070"
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//Set view engine
app.set('view engine', 'ejs')

// Static Files
app.use(express.static('public'));

// Session

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

/* Authentification */
app.post('/auth', function (req, res) {
  let email = req.body.identifiant;
  let password = req.body.password;

  if (email && password) {
    connection.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], function (error, results, fields) {
      // Afficher une erreur potentielle
      if (error) throw error;

      //Si un résultat est trouvé
      if (results.length > 0) {

        // Stockage des infos
        req.session.loggedin = true;
        req.session.email = email;

        // Redirection vers l' accueil
        res.redirect('/accueil');
      } else {
        res.send('Identifiant ou mot de passe incorrect');
      }
      res.end();
    });
  } else {
    res.send('Merci de renseigner un email et un mot de passe');
    res.end();
  }
});

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

app.get('/', (req, res) => {
  res.render('pages/login', { title: "Connexion" });
})

app.get('/accueil', (req, res) => {
  const uri = `http://localhost:7070/api/adherents/`;
  let adherents = [];
  fetch(uri)
    .then((response) => response.json())
    .then((response) => {
      response.forEach(item => {
        adherents.push(item)
      });
      if (req.session.loggedin) {
        res.render('pages/accueil', { adherents: adherents, title: "Accueil" });
      }
      else {
        res.send("Veuillez vous connecter pour accéder à cette page")
      }

    })
})

app.get('/fiches', (req, res) => {
  if (req.session.loggedin) {
    res.render('pages/fiches', { title: "Fiches temps" });
  }
  else {
    res.send("Veuillez vous connecter pour accéder à cette page")
  }
})


app.get('/formulaires', (req, res) => {
  if (req.session.loggedin) {
    res.render('pages/formulaires', { title: "Formulaires" });
  }
  else {
    res.send("Veuillez vous connecter pour accéder à cette page")
  }
})



const PORT = process.env.PORT || 7070

require("./app/routes/adherent.routes.js")(app);
require("./app/routes/annuaire.routes.js")(app);
require("./app/routes/mandat.routes.js")(app);
require("./app/routes/portrait.routes.js")(app);
require("./app/routes/representation.routes.js")(app)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})