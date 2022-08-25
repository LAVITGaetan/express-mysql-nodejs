const Portrait = require('../models/portrait.model.js')

// Ajouter un nouvel portrait
exports.create = (req, res) => {

    // Valider la requête
    if (!req.body) {
        res.status(400).send({
            message: "Le contenu ne peut être vide"
        });
    }

    // Récupérer les données envoyées
    const portrait = new Portrait(req.body);

    // Enregistrer le portrait dans la base de données
    Portrait.create(portrait, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Une erreur est survenue pendant la création du portrait"
            });
        else res.send(data);
    });
}

// Récupérer les portraits
exports.findAll = (req, res) => {

    Portrait.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Une erreur est survenue pendant la récupération des portraits"
            });
        else res.send(data);
    });
}

// Récupérer un portrait
exports.findOne = (req, res) => {
    Portrait.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Portrait introuvable, id : ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Une erreur est survenue en récupérant le portrait, id : " + req.params.id
                });
            }
        } else res.send(data);
    });
};

// Mettre à jour un portrait
exports.update = (req, res) => {
    // Valider la requête
    if (!req.body) {
        res.status(400).send({
            message: "Le contenu ne peut être vide"
        });
    }
    console.log(req.body);
    Portrait.updateById(
        req.params.id,
        new Portrait(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Portrait introuvable, id : ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: `Une erreur est survenue en récupérant le portrait, id : ${req.params.id}`
                    });
                }
            } else res.send(data);
        }
    );
};

// Supprimer un portrait
exports.delete = (req, res) => {
    Portrait.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Portrait with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: `Impossible de supprimer le portrait, id : ${req.params.id}.`
                });
            }
        } else res.send({ message: `Portrait supprimé !` });
    });
};