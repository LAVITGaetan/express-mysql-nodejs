module.exports = app => {
    const portraits = require("../controllers/portrait.controller.js");
    var router = require("express").Router();

    // Ajouter un adhérent
    router.post("/", portraits.create);

    // Récupérer tous les portraits
    router.get("/", portraits.findAll);


    // Récupérer un adhérent
    router.get("/:id", portraits.findOne);

    // Metre à jour un adhérent
    router.put("/:id", portraits.update);

    // Supprimer un adhérent
    router.delete("/:id", portraits.delete);

    app.use('/api/portraits', router);
};