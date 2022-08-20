const sql = require("./db.js");

// Constructeur
const Mandat = function (mandat) {
    this.entreprise = mandat.entreprise;
    this.section = mandat.section;
    this.adresse = mandat.adresse;
    this.nom = mandat.nom;
    this.prenom = mandat.prenom;
    this.email = mandat.email;
    this.telephone = mandat.telephone;
    this.identifiant = mandat.identifiant;
    this.siteweb = mandat.siteweb;
    this.status = mandat.status;
};

// Ajouter un mandat
Mandat.create = (newMandat, result) => {
    sql.query("INSERT INTO mandat SET ?", newMandat, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("Nouvel mandat crée : ", { id: res.insertId, ...newMandat });
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
    let query = "SELECT * FROM mandat";
    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("Liste de des mandats : ", res);
        result(null, res);
    });
};

// Récupérer les mandats actifs
Mandat.getActive = (result) => {
    sql.query("SELECT * FROM mandat WHERE isActive= '1'", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("Mandats actifs: ", res);
        result(null, res);
    });
};

// Mettre à jour un mandat
Mandat.updateById = (id, mandat, result) => {
    sql.query(
        "UPDATE mandat SET entreprise = ?, section = ?, adresse = ?, nom = ?, prenom = ?, email = ?, telephone = ?, identifiant = ?, siteweb = ?, status = ? WHERE id = ?",
        [mandat.label, mandat.nom, mandat.categorie, mandat.mission, mandat.composition, nombre_mandataires.email, noms_mandataires.telephone, renouvellement.identifiant, duree.siteweb, isActive.status, id],
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
            
            console.log("mandat: ", { id: id, ...mandat });
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