const sql = require("./db.js");

// Constructeur
const Annuaire = function (annuaire) {
    this.id_adherent = annuaire.id_adherent;
    this.contact_titre = annuaire.contact_titre;
    this.contact_nom = annuaire.contact_nom;
    this.contact_prenom = annuaire.contact_prenom;
    this.contact_email = annuaire.contact_email;
    this.contact_telephone = annuaire.contact_telephone;
    this.parution = annuaire.parution;
};

// Ajouter une parution
Annuaire.create = (newAnnuaire, result) => {
    sql.query("INSERT INTO annuaire SET ?", newAnnuaire, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("Nouvel annuaire crée : ", { id: res.insertId, ...newAnnuaire });
        result(null, { id: res.insertId, ...newAnnuaire });
    });
};

// Récupérer un annuaire
Annuaire.findById = (id, result) => {
    sql.query(`SELECT * FROM annuaire WHERE id = ${id}`, (err, res) => {

        // Erreur
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        // Succés
        if (res.length) {
            console.log("Annuaire trouvé : ", res[0]);
            result(null, res[0]);
            return;
        }

        // Id introuvable
        result({ kind: "not_found" }, null);
    });
};

// Récupérer tous les annuaires
Annuaire.getAll = (result) => {
    let query = "SELECT * FROM annuaire";
    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};

// Récupérer un annuaire avec l'id adhérent
Annuaire.getAdherent = (id, result) => {
    let query = `SELECT *, annuaire.id AS id_annuaire FROM annuaire INNER JOIN adherent ON annuaire.id_adherent = adherent.id WHERE adherent.id = ${id}`;
    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};

// Récupérer les annuaires actifs
Annuaire.getActive = (result) => {
    sql.query("SELECT * FROM annuaire WHERE parution= '1'", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("Annuaires actifs: ", res);
        result(null, res);
    });
};

// Mettre à jour un annuaire
Annuaire.updateById = (id, annuaire, result) => {
    sql.query(
        "UPDATE annuaire SET contact_titre = ?, contact_nom = ?, contact_prenom = ?, contact_email = ?, contact_telephone = ?, parution = ? WHERE id = ?",
        [annuaire.contact_titre, annuaire.contact_nom, annuaire.contact_prenom, annuaire.contact_email, annuaire.contact_telephone, annuaire.parution, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            // Id introuvable
            if (res.affectedRows == 0) {
                // not found Annuaire with the id
                result({ kind: "not_found" }, null);
                return;
            }
            
            console.log("annuaire: ", { id: id, ...annuaire });
            result(null, { id: id, ...annuaire });
        }
    );
};

// Supprimer un annuaire
Annuaire.remove = (id, result) => {
    sql.query("DELETE FROM annuaire WHERE id = ?", id, (err, res) => {
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
        console.log("Annuaire supprimé");
        result(null, res);
    });
};

// Désactiver un annuaire
Annuaire.disable = (id, result) => {
    sql.query("UPDATE annuaire SET parution = 0 WHERE id = ?", id, (err, res) => {
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
        console.log("Annuaire désactivé");
        result(null, res);
    });
};

// Activer un annuaire
Annuaire.enable = (id, result) => {
    sql.query("UPDATE annuaire SET parution = 1 WHERE id = ?", id, (err, res) => {
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
        console.log("Annuaire activé");
        result(null, res);
    });
};

module.exports = Annuaire;