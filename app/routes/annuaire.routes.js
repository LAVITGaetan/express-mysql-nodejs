module.exports = app => {
    const annuaires = require("../controllers/annuaire.controller.js");
    var router = require("express").Router();

    // Ajouter un annuaire
    router.post("/", annuaires.create);

    // Récupérer tous les annuaires
    router.get("/", annuaires.findAll);

    // Récupérer tous les annuaires actifs
    router.get("/active", annuaires.findAllActive);

    // Récupérer un annuaire
    router.get("/:id", annuaires.findOne);

        // Récupérer un annuaire via l'id adhérent
        router.get("/all/:id", annuaires.findAdherent);

    // Metre à jour un annuaire
    router.put("/:id", annuaires.update);

    // Supprimer un annuaire
    router.delete("/:id", annuaires.delete);

        // Désactiver un annuaire
        router.put("/disable/:id", annuaires.disable);

        // Activer un annuaire
        router.put("/enable/:id", annuaires.enable);

    app.use('/api/annuaires', router);
};