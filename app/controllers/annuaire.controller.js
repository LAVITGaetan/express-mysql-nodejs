const Annuaire = require('../models/annuaire.model.js')

// Ajouter un nouvel annuaire
exports.create = (req, res) => {

    // Valider la requête
    if (!req.body) {
        res.status(400).send({
            message: "Le contenu ne peut être vide"
        });
    }

    // Récupérer les données envoyées
    const adherent = new Annuaire(req.body);

    // Enregistrer l' annuaire dans la base de données
    Annuaire.create(adherent, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Une erreur est survenue pendant la création de l'annuaire"
            });
        else res.send(data);
    });
}

// Récupérer les annuaires
exports.findAll = (req, res) => {

    Annuaire.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Une erreur est survenue pendant la récupération des annuaires"
            });
        else res.send(data);
    });
}

// Récupérer les annuaires actifs
exports.findAllActive = (req, res) => {

    Annuaire.getActive((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Une erreur est survenue pendant la récupération des annuaires"
            });
        else res.send(data);
    });
}

// Récupérer un annuaire
exports.findOne = (req, res) => {
    Annuaire.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Annuaire introuvable, id : ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Une erreur est survenue en récupérant l' annuaire, id : " + req.params.id
                });
            }
        } else res.send(data);
    });
};

// Récupérer un annuaire avec l'id adhérent
exports.findAdherent = (req, res) => {
    Annuaire.getAdherent(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Annuaire introuvable, id adhérent: ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Une erreur est survenue en récupérant l' annuaire, id adhérent : " + req.params.id
                });
            }
        } else res.send(data);
    })
}

// Mettre à jour un annuaire
exports.update = (req, res) => {
    // Valider la requête
    if (!req.body) {
        res.status(400).send({
            message: "Le contenu ne peut être vide"
        });
    }
    console.log(req.body);
    Annuaire.updateById(
        req.params.id,
        new Annuaire(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Annuaire introuvable, id : ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: `Une erreur est survenue en récupérant l' annuaire, id : ${req.params.id}`
                    });
                }
            } else res.send(data);
        }
    );
};

// Supprimer un annuaire
exports.delete = (req, res) => {
    Annuaire.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Annuaire with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: `Impossible de supprimer l' annuaire, id : ${req.params.id}.`
                });
            }
        } else res.send({ message: `Annuaire supprimé !` });
    });
};