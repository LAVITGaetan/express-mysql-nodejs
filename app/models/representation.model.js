const sql = require("./db.js");

// Constructeur
const Representation = function (representation) {
    this.id_mandat = representation.id_mandat;
    this.id_portrait = representation.id_portrait;
    this.titre = representation.titre;
};

// Ajouter une representation
Representation.create = (newRepresentation, result) => {
    sql.query("INSERT INTO representation SET ?", newRepresentation, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("Nouvel representation crée : ", { id: res.insertId, ...newRepresentation });
        result(null, { id: res.insertId, ...newRepresentation });
    });
};

// Récupérer une representation
Representation.findById = (id, result) => {
    sql.query(`SELECT * FROM representation WHERE id = ${id}`, (err, res) => {

        // Erreur
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        // Succés
        if (res.length) {
            console.log("Representation trouvé : ", res[0]);
            result(null, res[0]);
            return;
        }

        // Id introuvable
        result({ kind: "not_found" }, null);
    });
};

// Récupérer tous les representations
Representation.getAll = (result) => {
    let query = "SELECT * FROM representation ORDER BY id";
    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("Liste des representations : ", res);
        result(null, res);
    });
};

// Mettre à jour une représentation
Representation.updateById = (id, representation, result) => {
    sql.query(
        "UPDATE representation SET titre = ?, WHERE id = ?",
        [ representation.titre, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            // Id introuvable
            if (res.affectedRows == 0) {
                // not found Representation with the id
                result({ kind: "not_found" }, null);
                return;
            }
            
            console.log("representation: ", { id: id, ...representation });
            result(null, { id: id, ...representation });
        }
    );
};

// Supprimer un representation
Representation.remove = (id, result) => {
    sql.query("DELETE FROM representation WHERE id = ?", id, (err, res) => {
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
        console.log("Representation supprimé");
        result(null, res);
    });
};

module.exports = Representation;