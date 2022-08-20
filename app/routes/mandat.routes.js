module.exports = app => {
    const mandats = require("../controllers/mandat.controller.js");
    var router = require("express").Router();

    // Ajouter un adhérent
    router.post("/", mandats.create);

    // Récupérer tous les adhérents
    router.get("/", mandats.findAll);

    // Récupérer tous les adhérents actifs
    router.get("/active", mandats.findAllActive);

    // Récupérer un adhérent
    router.get("/:id", mandats.findOne);

    // Metre à jour un adhérent
    router.put("/:id", mandats.update);

    // Supprimer un adhérent
    router.delete("/:id", mandats.delete);

    app.use('/api/mandats', router);
};