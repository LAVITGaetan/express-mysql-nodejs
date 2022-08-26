module.exports = app => {
    const representations = require("../controllers/representation.controller.js");
    var router = require("express").Router();

    // Ajouter une représentation
    router.post("/", representations.create);

    // Récupérer tous les representations
    router.get("/", representations.findAll);


    // Récupérer une représentation
    router.get("/:id", representations.findOne);

    // Mettre à jour une représentation
    router.put("/:id", representations.update);

    // Supprimer une représentation
    router.delete("/:id", representations.delete);

    app.use('/api/representations', router);
};