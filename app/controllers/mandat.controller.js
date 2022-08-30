const Mandat = require('../models/mandat.model.js')

// Ajouter un nouveau mandat
exports.create = (req, res) => {

    // Valider la requête
    if (!req.body.label) {
        res.status(400).send({
            message: "Le champ label doit être complété"
        });
        return;
    }
    if (!req.body.nom) {
        res.status(400).send({
            message: "Le champ nom doit être complété"
        });
        return;
    }
    if (!req.body.categorie) {
        res.status(400).send({
            message: "Le champ catégorie doit être complété"
        });
        return;
    }
    if (!req.body.mission) {
        res.status(400).send({
            message: "Le champ mission doit être complété"
        });
        return;
    }
    if (!req.body.composition) {
        res.status(400).send({
            message: "Le champ composition doit être complété"
        });
        return;
    }
    // Récupérer les données envoyées
    const mandat = new Mandat(req.body);

    // Enregistrer le mandat dans la base de données
    Mandat.create(mandat, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Une erreur est survenue pendant la création de l'mandat"
            });
        else res.send(data);
    });
}

// Récupérer les mandats
exports.findAll = (req, res) => {

    Mandat.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Une erreur est survenue pendant la récupération des mandats"
            });
        else res.send(data);
    });
}

// Récupérer un mandat
exports.findOne = (req, res) => {
    Mandat.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Mandat introuvable, id : ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Une erreur est survenue en récupérant le mandat, id : " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.findRepresentations = (req, res) => {
    Mandat.getRepresentations(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Représentation introuvable, id : ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Une erreur est survenue en récupérant le mandat, id : " + req.params.id
                });
            }
        } else res.send(data);
    })
}

// Mettre à jour un mandat
exports.update = (req, res) => {
// Valider la requête
if (!req.body.label) {
    res.status(400).send({
        message: "Le champ label doit être complété"
    });
    return;
}
if (!req.body.nom) {
    res.status(400).send({
        message: "Le champ nom doit être complété"
    });
    return;
}
if (!req.body.categorie) {
    res.status(400).send({
        message: "Le champ catégorie doit être complété"
    });
    return;
}
if (!req.body.mission) {
    res.status(400).send({
        message: "Le champ mission doit être complété"
    });
    return;
}
if (!req.body.composition) {
    res.status(400).send({
        message: "Le champ composition doit être complété"
    });
    return;
}
    Mandat.updateById(
        req.params.id,
        new Mandat(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Mandat introuvable, id : ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: `Une erreur est survenue en récupérant le mandat, id : ${req.params.id}`
                    });
                }
            } else res.send(data);
        }
    );
};

// Supprimer un mandat
exports.delete = (req, res) => {
    Mandat.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Mandat with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: `Impossible de supprimer le mandat, id : ${req.params.id}.`
                });
            }
        } else res.send({ message: `Mandat supprimé !` });
    });
};