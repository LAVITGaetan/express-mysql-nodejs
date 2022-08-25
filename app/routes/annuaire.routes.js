module.exports = app => {
    const annuaires = require("../controllers/annuaire.controller.js");
    var router = require("express").Router();

    // Ajouter un adhérent
    router.post("/", annuaires.create);

    // Récupérer tous les adhérents
    router.get("/", annuaires.findAll);

    // Récupérer tous les adhérents actifs
    router.get("/active", annuaires.findAllActive);

    // Récupérer un adhérent
    router.get("/:id", annuaires.findOne);

    // Metre à jour un adhérent
    router.put("/:id", annuaires.update);

    // Supprimer un adhérent
    router.delete("/:id", annuaires.delete);

    app.use('/api/annuaires', router);
};