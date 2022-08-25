module.exports = app => {
    const adherents = require("../controllers/adherent.controller.js");
    var router = require("express").Router();

    // Ajouter un adhérent
    router.post("/", adherents.create);

    // Récupérer tous les adhérents
    router.get("/", adherents.findAll);

    // Récupérer tous les adhérents actifs
    router.get("/active", adherents.findAllActive);

    // Récupérer un adhérent
    router.get("/:id", adherents.findOne);

    // Metre à jour un adhérent
    router.put("/:id", adherents.update);

    // Supprimer un adhérent
    router.delete("/:id", adherents.delete);

    // Désactiver un adhérent
    router.put("/disable/:id", adherents.disable);

    // Activer un adhérent
    router.put("/enable/:id", adherents.enable);


    app.use('/api/adherents', router);
};