const express = require('express');
const cors = require('cors');
const app = express();
const fetch = require('node-fetch');
const session = require('express-session');
const connection = require('./app/models/db.js')

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

app.get('/', function (req, res) {
  res.json({ message: "Server running" });
});

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

// Dashboard views
app.get('/adherents', (req, res) => {
  const uri = `http://localhost:7070/api/adherents/`;
  let adherents = [];
  fetch(uri)
    .then((response) => response.json())
    .then((response) => {
      response.forEach(item => {
        adherents.push(item)
      });
      if (req.session.loggedin) {
        res.render('pages/adherents', { adherents: adherents, title: "Adhérents" });
      }
      else {
        res.send("Veuillez vous connecter pour accéder à cette page")
      }

    })
})

app.get('/mandats', (req, res) => {
  const uri = `http://localhost:7070/api/mandats/`;
  let mandats = [];
  fetch(uri)
    .then((response) => response.json())
    .then((response) => {
      response.forEach(item => {
        mandats.push(item)
      });
      if (req.session.loggedin) {
        res.render('pages/mandats', { mandats: mandats, title: "Mandats" });
      }
      else {
        res.send("Veuillez vous connecter pour accéder à cette page")
      }

    })
})

app.get('/login', (req, res) => {
  res.render('pages/login', { title: "Connexion" });
})

app.get('/logiciels', (req, res) => {
  if (req.session.loggedin) {
    res.render('pages/logiciels', { title: "Logiciels" });
  }
  else {
    res.send("Veuillez vous connecter pour accéder à cette page")
  }
})

app.get('/accueil', (req, res) => {
  if (req.session.loggedin) {
    res.render('pages/accueil', { title: "Accueil" });

  }
  else {
    res.send("Veuillez vous connecter pour accéder à cette page")
  }
})

app.get('/fiches', (req, res) => {
  if (req.session.loggedin) {
    res.render('pages/fiches', { title: "Fiches temps" });
  }
  else {
    res.send("Veuillez vous connecter pour accéder à cette page")
  }
})

const PORT = process.env.PORT || 7070

require("./app/routes/adherent.routes.js")(app);
require("./app/routes/mandat.routes.js")(app);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})