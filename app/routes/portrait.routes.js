module.exports = app => {
    const portraits = require("../controllers/portrait.controller.js");
    var router = require("express").Router();

    // Ajouter un portrait
    router.post("/", portraits.create);

    // Récupérer tous les portraits
    router.get("/", portraits.findAll);

    // Récupérer un portrait
    router.get("/:id", portraits.findOne);

    // Récupérer les représentations d' un portrait
    router.get("/:id/representations", portraits.findRepresentations)

    // Metre à jour un portrait
    router.put("/:id", portraits.update);

    // Supprimer un portrait
    router.delete("/:id", portraits.delete);

    app.use('/api/portraits', router);
};