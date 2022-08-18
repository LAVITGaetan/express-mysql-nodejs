const sql = require("./db.js");

// Constructeur
const Adherent = function (adherent) {
    this.entreprise = adherent.entreprise;
    this.section = adherent.section;
    this.adresse = adherent.adresse;
    this.nom = adherent.nom;
    this.prenom = adherent.prenom;
    this.email = adherent.email;
    this.telephone = adherent.telephone;
    this.identifiant = adherent.identifiant;
    this.siteweb = adherent.siteweb;
    this.status = adherent.status;
};

// Ajouter un adhérent
Adherent.create = (newAdherent, result) => {
    sql.query("INSERT INTO adherent SET ?", newAdherent, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("Nouvel adhérent crée : ", { id: res.insertId, ...newAdherent });
        result(null, { id: res.insertId, ...newAdherent });
    });
};

// Récupérer un adhérent
Adherent.findById = (id, result) => {
    sql.query(`SELECT * FROM adherent WHERE id = ${id}`, (err, res) => {

        // Erreur
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        // Succés
        if (res.length) {
            console.log("Adherent trouvé : ", res[0]);
            result(null, res[0]);
            return;
        }

        // Id introuvable
        result({ kind: "not_found" }, null);
    });
};

// Récupérer tous les adhérents
Adherent.getAll = (result) => {
    let query = "SELECT * FROM adherent";
    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("Liste de des adhérents : ", res);
        result(null, res);
    });
};

// Récupérer les adhérents actifs
Adherent.getActive = (result) => {
    sql.query("SELECT * FROM adherent WHERE status= 'true'", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("Adhérents actifs: ", res);
        result(null, res);
    });
};

// Mettre à jour un adhérent
Adherent.updateById = (id, adherent, result) => {
    sql.query(
        "UPDATE adherent SET entreprise = ?, section = ?, adresse = ?, nom = ?, prenom = ?, email = ?, telephone = ?, identifiant = ?, siteweb = ?, status = ? WHERE id = ?",
        [adherent.entreprise, adherent.section, adherent.adresse, adherent.nom, adherent.prenom, adherent.email, adherent.telephone, adherent.identifiant, adherent.siteweb, adherent.status, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            // Id introuvable
            if (res.affectedRows == 0) {
                // not found Adherent with the id
                result({ kind: "not_found" }, null);
                return;
            }
            
            console.log("adherent: ", { id: id, ...adherent });
            result(null, { id: id, ...adherent });
        }
    );
};

// Supprimer un adhérent
Adherent.remove = (id, result) => {
    sql.query("DELETE FROM adherent WHERE id = ?", id, (err, res) => {
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
        console.log("Adherent supprimé");
        result(null, res);
    });
};

module.exports = Adherent;