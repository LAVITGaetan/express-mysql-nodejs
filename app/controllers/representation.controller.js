const Representation = require('../models/representation.model.js')

// Ajouter une nouvelle representation
exports.create = (req, res) => {

    // Valider la requête
    if (!req.body) {
        res.status(400).send({
            message: "Le contenu ne peut être vide"
        });
    }

    // Récupérer les données envoyées
    const representation = new Representation(req.body);

    // Enregistrer le representation dans la base de données
    Representation.create(representation, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Une erreur est survenue pendant la création du representation"
            });
        else res.send(data);
    });
}

// Récupérer les representations
exports.findAll = (req, res) => {

    Representation.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Une erreur est survenue pendant la récupération des representations"
            });
        else res.send(data);
    });
}

// Récupérer une representation
exports.findOne = (req, res) => {
    Representation.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Representation introuvable, id : ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Une erreur est survenue en récupérant le representation, id : " + req.params.id
                });
            }
        } else res.send(data);
    });
};

// Mettre à jour un representation
exports.update = (req, res) => {
    // Valider la requête
    if (!req.body) {
        res.status(400).send({
            message: "Le contenu ne peut être vide"
        });
    }
    console.log(req.body);
    Representation.updateById(
        req.params.id,
        new Representation(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Representation introuvable, id : ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: `Une erreur est survenue en récupérant le representation, id : ${req.params.id}`
                    });
                }
            } else res.send(data);
        }
    );
};

// Supprimer un representation
exports.delete = (req, res) => {
    Representation.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Representation with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: `Impossible de supprimer le representation, id : ${req.params.id}.`
                });
            }
        } else res.send({ message: `Representation supprimé !` });
    });
};