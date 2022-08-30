const sql = require("./db.js");

// Constructeur
const Mandat = function (mandat) {
    this.label = mandat.label;
    this.nom = mandat.nom;
    this.categorie = mandat.categorie;
    this.mission = mandat.mission;
    this.composition = mandat.composition;
    this.renouvellement = mandat.renouvellement;
    this.duree = mandat.duree;
};

// Ajouter un mandat
Mandat.create = (newMandat, result) => {
    sql.query("INSERT INTO mandat SET ?", newMandat, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newMandat });
    });
};

// Récupérer un mandat
Mandat.findById = (id, result) => {
    sql.query(`SELECT * FROM mandat WHERE id = ${id}`, (err, res) => {

        // Erreur
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        // Succés
        if (res.length) {
            console.log("Mandat trouvé : ", res[0]);
            result(null, res[0]);
            return;
        }

        // Id introuvable
        result({ kind: "not_found" }, null);
    });
};

// Récupérer tous les mandats
Mandat.getAll = (result) => {
    let query = "SELECT * FROM mandat ORDER BY label";
    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};

// Récupérer toutes les representations d' un mandats
Mandat.getRepresentations = (id, result) => {
    let query = `SELECT * FROM representation WHERE id_mandat = ${id}`;
    sql.query(query, (err, res) => {
        if(err) {
            console.log('Une erreur est survenue : ', err);
            result(null, err)
            return;
        }
        result(null, res)
    })
}

// Mettre à jour un mandat
Mandat.updateById = (id, mandat, result) => {
    sql.query(
        "UPDATE mandat SET label = ?, nom = ?, categorie = ?, mission = ?, composition = ?, renouvellement = ?, duree = ? WHERE id = ?",
        [mandat.label, mandat.nom, mandat.categorie, mandat.mission, mandat.composition, mandat.renouvellement, mandat.duree, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            // Id introuvable
            if (res.affectedRows == 0) {
                // not found Mandat with the id
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, { id: id, ...mandat });
        }
    );
};

// Supprimer un mandat
Mandat.remove = (id, result) => {
    sql.query("DELETE FROM mandat WHERE id = ?", id, (err, res) => {
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
        console.log("Mandat supprimé");
        result(null, res);
    });
};

module.exports = Mandat;