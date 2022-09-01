const fetch = require('node-fetch');
const connection = require('../models/db.js')

exports.auth = (req, res) => {
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
}

exports.login = (req, res) => {
    res.render('pages/login', { title: "Connexion" });
}

exports.index = (req, res) => {
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
}

exports.adherents = (req, res) => {
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
}

exports.adherent = (req, res) => {
    const uri = `http://localhost:7070/api/annuaires/all/${req.query.id}`;
    let adherent = [];
    fetch(uri)
        .then((response) => response.json())
        .then((response) => {
            adherent.push(response[0])
            if (req.session.loggedin) {
                res.render('pages/adherent', { title: "Profil adhérent", adherent: adherent });
            }
            else {
                res.send("Veuillez vous connecter pour accéder à cette page")
            }
        })
}

exports.editAdherent = (req, res) => {
    const uri = `http://localhost:7070/api/adherents/${req.query.id}`;
    let adherent = [];
    fetch(uri)
        .then((response) => response.json())
        .then((response) => {
            adherent.push(response)
            if (req.session.loggedin) {
                res.render('pages/edit-adherent', { title: "Modifer un adhérent", adherent: adherent });
            }
            else {
                res.send("Veuillez vous connecter pour accéder à cette page")
            }
        })
}

exports.newAdherent = (req, res) => {
    if (req.session.loggedin) {
        res.render('pages/nouvel-adherent', { title: "Ajouter un adhérent" });
    }
    else {
        res.send("Veuillez vous connecter pour accéder à cette page")
    }
}

exports.mandats = (req, res) => {
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
}

exports.mandat = (req, res) => {
    const uri = `http://localhost:7070/api/mandats/${req.query.id}`;
    let mandat = [];
    let representations = [];
    let portraits = [];
    const result = fetch(uri)
        .then((response) => response.json())
        .then((response) => {
            mandat.push(response)
            return fetch(`${uri}/representations`)
                .then((response) => response.json())
                .then((response) => {
                    response.forEach(item => {
                        representations.push(item)
                    })
                    return fetch(`http://localhost:7070/api/portraits`)
                        .then((response) => response.json())
                        .then((response) => {
                            response.forEach(item => {
                                portraits.push(item)
                            })
                        })
                })
        })

    result.then(r => {
        if (req.session.loggedin) {
            res.render('pages/mandat', { title: "Mandat", mandat: mandat, representations: representations, portraits: portraits });
        }
        else {
            res.send("Veuillez vous connecter pour accéder à cette page")
        }
    })
}

exports.editMandat = (req, res) => {
    const uri = `http://localhost:7070/api/mandats/${req.query.id}`;
    let mandat = [];
    fetch(uri)
        .then((response) => response.json())
        .then((response) => {
            mandat.push(response)
            if (req.session.loggedin) {
                res.render('pages/edit-mandat', { title: "Modifer un mandat", mandat: mandat });
            }
            else {
                res.send("Veuillez vous connecter pour accéder à cette page")
            }
        })
}

exports.newMandat = (req, res) => {
    if (req.session.loggedin) {
        res.render('pages/nouveau-mandat', { title: "Ajouter un mandat" });
    }
    else {
        res.send("Veuillez vous connecter pour accéder à cette page")
    }
}


// Portraits

exports.portraits = (req, res) => {
    const uri = `http://localhost:7070/api/portraits/`;
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
                res.render('pages/portraits', { portraits: portraits, title: "Portraits", representations: representations, message : '' });
            }
            else {
                res.send("Veuillez vous connecter pour accéder à cette page")
            }
        })
}

exports.portrait = (req, res) => {
    const uri = `http://localhost:7070/api/portraits/${req.query.id}`;
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
}

exports.newPortrait = (req, res) => {
    if (req.session.loggedin) {
        res.render('pages/nouveau-portrait', { title: "Ajouter un portrait" });
    }
    else {
        res.send("Veuillez vous connecter pour accéder à cette page")
    }
}

exports.editPortrait = (req, res) => {
    const uri = `http://localhost:7070/api/portraits/${req.query.id}`;
    let portrait = [];
    fetch(uri)
        .then((response) => response.json())
        .then((response) => {
            portrait.push(response)
            if (req.session.loggedin) {
                res.render('pages/edit-portrait', { title: "Modifer un portrait", portrait: portrait });
            }
            else {
                res.send("Veuillez vous connecter pour accéder à cette page")
            }
        })
}

//annuaire

exports.editAnnuaire = (req, res) => {
    const uri = `http://localhost:7070/api/annuaires/all/${req.query.id}`;
    let annuaire = [];
    fetch(uri)
        .then((response) => response.json())
        .then((response) => {
            annuaire.push(response[0])
            if (req.session.loggedin) {
                res.render('pages/edit-annuaire', { title: "Modifer un adhérent", annuaire: annuaire });
            }
            else {
                res.send("Veuillez vous connecter pour accéder à cette page")
            }
        })
}