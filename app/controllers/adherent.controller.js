const Adherent = require('../models/adherent.model.js')

// Ajouter un nouvel adhérent
exports.create = (req, res) => {

    // Valider la requête
    if (!req.body.entreprise) {
        res.status(400).send({
            message: "Le champ entreprise doit être complété"
        });
        return;
    }
    if (!req.body.section) {
        res.status(400).send({
            message: "Le champ section doit être complété"
        });
        return;
    }
    if (!req.body.adresse) {
        res.status(400).send({
            message: "Le champ adresse doit être complété"
        });
        return;
    }
    if (!req.body.nom) {
        res.status(400).send({
            message: "Le champ nom doit être complété"
        });
        return;
    }
    if (!req.body.prenom) {
        res.status(400).send({
            message: "Le champ prenom doit être complété"
        });
        return;
    }
    if (!req.body.email) {
        res.status(400).send({
            message: "Le champ email doit être complété"
        });
        return;
    }
    if (!req.body.telephone) {
        res.status(400).send({
            message: "Le champ téléphone doit être complété"
        });
        return;
    }
    if (!req.body.identifiant) {
        res.status(400).send({
            message: "Le champ identifiant doit être complété"
        });
        return;
    }

    req.body.status = 1;

    // Récupérer les données envoyées
    const adherent = new Adherent(req.body);

    // Enregistrer l' adhérent dans la base de données
    Adherent.create(adherent, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Une erreur est survenue pendant la création de l'adhérent"
            });
        else res.send(data);
    });
}

// Récupérer les adhérents
exports.findAll = (req, res) => {

    Adherent.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Une erreur est survenue pendant la récupération des adhérents"
            });
        else res.send(data);
    });
}

// Récupérer les adhérents actifs
exports.findAllActive = (req, res) => {

    Adherent.getActive((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Une erreur est survenue pendant la récupération des adhérents"
            });
        else res.send(data);
    });
}

// Récupérer un adhérent
exports.findOne = (req, res) => {
    Adherent.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Adhérent introuvable, id : ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Une erreur est survenue en récupérant l' adhérent, id : " + req.params.id
                });
            }
        } else res.send(data);
    });
};

// Mettre à jour un adhérent
exports.update = (req, res) => {
    // Valider la requête
    if (!req.body.entreprise) {
        res.status(400).send({
            message: "Le champ entreprise doit être complété"
        });
        return;
    }
    if (!req.body.section) {
        res.status(400).send({
            message: "Le champ section doit être complété"
        });
        return;
    }
    if (!req.body.adresse) {
        res.status(400).send({
            message: "Le champ adresse doit être complété"
        });
        return;
    }
    if (!req.body.nom) {
        res.status(400).send({
            message: "Le champ nom doit être complété"
        });
        return;
    }
    if (!req.body.prenom) {
        res.status(400).send({
            message: "Le champ prenom doit être complété"
        });
        return;
    }
    if (!req.body.email) {
        res.status(400).send({
            message: "Le champ email doit être complété"
        });
        return;
    }
    if (!req.body.telephone) {
        res.status(400).send({
            message: "Le champ téléphone doit être complété"
        });
        return;
    }
    if (!req.body.identifiant) {
        res.status(400).send({
            message: "Le champ identifiant doit être complété"
        });
        return;
    }
    req.body.status = 1;
    
    Adherent.updateById(
        req.params.id,
        new Adherent(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Adhérent introuvable, id : ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: `Une erreur est survenue en récupérant l' adhérent, id : ${req.params.id}`
                    });
                }
            } else res.send(data);
        }
    );
};

// Supprimer un adhérent
exports.delete = (req, res) => {
    Adherent.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Adherent with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: `Impossible de supprimer l' adhérent, id : ${req.params.id}.`
                });
            }
        } else res.send({ message: `Adhérent supprimé !` });
    });
};

//Désactiver un adhérent
exports.disable = (req, res) => {
    Adherent.disable(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Adherent with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: `Impossible de supprimer l' adhérent, id : ${req.params.id}.`
                });
            }
        } else res.send({ message: `Adhérent désactivé !` });
    });
};

//Désactiver un adhérent
exports.enable = (req, res) => {
    Adherent.enable(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Adherent with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: `Impossible de supprimer l' adhérent, id : ${req.params.id}.`
                });
            }
        } else res.send({ message: `Adhérent activé !` });
    });
};