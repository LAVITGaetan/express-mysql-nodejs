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

//upload
app.post('/edit-portrait', (req, res) => {
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
  let bodyPortrait = {
    image: path,
    nom: nom,
    prenom: prenom,
}

  fetch(`http://localhost:7070/api/portraits/${req.body.id}`, {
    method: "PUT",
    headers: {
      'Accept': 'application/json',
        'Content-type': 'application/json'
    },
    body: JSON.stringify(bodyPortrait)
})
const uri = `http://localhost:7070/api/portraits/${req.body.id}`;
    let portrait = [];
    let representations = [];
    let mandats = [];
    const result = fetch(uri)
        .then((response) => response.json())
        .then((response) => {
            portrait.push(response)
            return fetch(`${uri}/representations`)
                .then((response) => response.json())
                .then((response) => {
                    response.forEach(item => {
                        representations.push(item)
                    })
                    return fetch(`http://localhost:7070/api/mandats`)
                        .then((response) => response.json())
                        .then((response) => {
                            response.forEach(item => {
                                mandats.push(item)
                            })
                        })
                })
        })

    result.then(r => {
        if (req.session.loggedin) {
            res.render('pages/portrait', { title: "Portrait", portrait: portrait, representations: representations, mandats: mandats });
        }
        else {
            res.send("Veuillez vous connecter pour accéder à cette page")
        }
    })

});


// nouvel adhérent
app.post('/nouvel-adherent', (req, res) => {
  const uri = `http://localhost:7070/api/adherents/`;
  let entreprise = req.body.entreprise;
  let section = req.body.section;
  let activite = req.body.activite;
  let adresse = req.body.adresse;
  let nom = req.body.nom;
  let prenom = req.body.prenom;
  let email = req.body.email;
  let telephone = req.body.telephone;
  let identifiant = req.body.identifiant;
  let siteweb = req.body.siteweb;
  if (req.files) {
    const { image } = req.files;
    path = entreprise + '_' + image.name
    image.mv(__dirname + '/public/upload/' + entreprise + '_' + image.name);
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
    body: JSON.stringify({ logo: path, entreprise: entreprise, section: section,activite : activite, adresse : adresse, nom : nom, prenom : prenom, email : email, telephone, telephone, identifiant : identifiant, siteweb : siteweb, status : 1  })
  })

  let adherents = [];
  const result = fetch(uri)
    .then((response) => response.json())
    .then((response) => {
      response.forEach(item => {
        adherents.push(item)
      })
    })

  result.then(r => {
    if (req.session.loggedin) {
      res.render('pages/adherents', { adherents: adherents, title: "Adhérents", message: `${entreprise} ajoutée` });
    }
    else {
      res.send("Veuillez vous connecter pour accéder à cette page")
    }
  })
});


//upload
app.post('/edit-adherent', (req, res) => {
  let entreprise = req.body.entreprise;
  let section = req.body.section;
  let activite = req.body.activite;
  let adresse = req.body.adresse;
  let nom = req.body.nom;
  let prenom = req.body.prenom;
  let email = req.body.email;
  let telephone = req.body.telephone;
  let identifiant = req.body.identifiant;
  let siteweb = req.body.siteweb;
  if (req.files) {
    const { image } = req.files;
    path = entreprise + '_' + image.name
    image.mv(__dirname + '/public/upload/' + entreprise + '_' + image.name);
  }
  else {
    path = '';
  }
  let bodyAdherent = {
    logo : path,
    entreprise : entreprise,
    section : section,
    adresse : adresse,
    activite : activite,
    nom : nom,
    prenom : prenom,
    email : email,
    telephone : telephone,
    identifiant : identifiant,
    siteweb : siteweb,
    status : 1
}

  fetch(`http://localhost:7070/api/adherents/${req.body.id}`, {
    method: "PUT",
    headers: {
      'Accept': 'application/json',
        'Content-type': 'application/json'
    },
    body: JSON.stringify(bodyAdherent)
})

console.log(bodyAdherent);
const uri = `http://localhost:7070/api/annuaires/all/${req.body.id}`;
let adherent = [];
fetch(uri)
    .then((response) => response.json())
    .then((response) => {
        adherent.push(response[0])
        if (req.session.loggedin) {
            res.render('pages/adherent', { title: "Profil adhérent", adherent: adherent, message : 'Adhérent modifié' });
        }
        else {
            res.send("Veuillez vous connecter pour accéder à cette page")
        }
    })
});

// nouveau mandat
app.post('/nouveau-mandat', (req, res) => {
  const uri = `http://localhost:7070/api/mandats/`;
  let label = req.body.label;
  let nom = req.body.nom;
  let categorie = req.body.categorie;
  let mission = req.body.mission;
  let composition = req.body.composition;
  let renouvellement = req.body.renouvellement;
  let duree = req.body.duree;
  if (req.files) {
    const { image } = req.files;
    path = label + '_' + image.name
    image.mv(__dirname + '/public/upload/' + label + '_' + image.name);
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
    body: JSON.stringify({ logo: path, label: label, nom: nom, categorie: categorie, mission : mission, composition : composition, renouvellement : renouvellement, duree : duree })
  })

  let mandats = [];
  const result = fetch(uri)
    .then((response) => response.json())
    .then((response) => {
      response.forEach(mandat => {
        mandats.push(mandat)
      })
    })

  result.then(r => {
    if (req.session.loggedin) {
      res.render('pages/mandats', { mandats: mandats, title: "Mandats", message: `${label} ajoutée` });
    }
    else {
      res.send("Veuillez vous connecter pour accéder à cette page")
    }
  })
});

// modifier un mandat
app.post('/edit-mandat', (req, res) => {
  let label = req.body.label;
  let nom = req.body.nom;
  let categorie = req.body.categorie;
  let mission = req.body.mission;
  let composition = req.body.composition;
  let renouvellement = req.body.renouvellement;
  let duree = req.body.duree;
  if (req.files) {
    const { image } = req.files;
    path = label + '_' + image.name
    image.mv(__dirname + '/public/upload/' + label + '_' + image.name);
  }
  else {
    path = '';
  }
  let bodyMandat = {
    logo : path,
    label : label,
    nom : nom,
    categorie : categorie,
    mission : mission,
    composition : composition,
    renouvellement : renouvellement,
    duree : duree
}

console.log(bodyMandat);
  fetch(`http://localhost:7070/api/mandats/${req.body.id}`, {
    method: "PUT",
    headers: {
      'Accept': 'application/json',
        'Content-type': 'application/json'
    },
    body: JSON.stringify(bodyMandat)
})
const uri = `http://localhost:7070/api/mandats/`;
    let mandats = [];
    fetch(uri)
        .then((response) => response.json())
        .then((response) => {
            response.forEach(item => {
                mandats.push(item)
            });
            if (req.session.loggedin) {
                res.render('pages/mandats', { mandats: mandats, title: "Mandats", message : 'Mandat modifié' });
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