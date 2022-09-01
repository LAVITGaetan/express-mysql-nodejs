const sql = require("./db.js");

// Constructeur
const Portrait = function (portrait) {
    this.image = portrait.image;
    this.nom = portrait.nom;
    this.prenom = portrait.prenom;
};

// Ajouter un portrait
Portrait.create = (newPortrait, result) => {
    sql.query("INSERT INTO portrait SET ?", newPortrait, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("Nouvel portrait crée : ", { id: res.insertId, ...newPortrait });
        result(null, { id: res.insertId, ...newPortrait });
    });
};

// Récupérer un portrait
Portrait.findById = (id, result) => {
    sql.query(`SELECT * FROM portrait WHERE id = ${id}`, (err, res) => {

        // Erreur
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        // Succés
        if (res.length) {
            console.log("Portrait trouvé : ", res[0]);
            result(null, res[0]);
            return;
        }

        // Id introuvable
        result({ kind: "not_found" }, null);
    });
};

// Récupérer toutes les representations d' un portrait
Portrait.getRepresentations = (id, result) => {
    let query = `SELECT * FROM representation WHERE id_portrait = ${id}`;
    sql.query(query, (err, res) => {
        if(err) {
            console.log('Une erreur est survenue : ', err);
            result(null, err)
            return;
        }
        result(null, res)
    })
}

// Récupérer tous les portraits
Portrait.getAll = (result) => {
    let query = "SELECT * FROM portrait ORDER BY nom";
    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("Liste de des portraits : ", res);
        result(null, res);
    });
};

// Mettre à jour un portrait
Portrait.updateById = (id, portrait, result) => {
    sql.query(
        "UPDATE portrait SET image = ?, nom = ?, prenom = ? WHERE id = ?",
        [portrait.image, portrait.nom, portrait.prenom, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            // Id introuvable
            if (res.affectedRows == 0) {
                // not found Portrait with the id
                result({ kind: "not_found" }, null);
                return;
            }
            
            console.log("portrait: ", { id: id, ...portrait });
            result(null, { id: id, ...portrait });
        }
    );
};

// Supprimer un portrait
Portrait.remove = (id, result) => {
    sql.query("DELETE FROM portrait WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        // id introuvable
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Portrait supprimé");
        result(null, res);
    });
};

module.exports = Portrait;