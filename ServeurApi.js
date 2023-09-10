const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Configuration de la connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'sql11.freemysqlhosting.net',
  user: 'sql11645476',
  password:'hli67ET6XJ',
  database: 'sql11645476'
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connecté à la base de données MySQL');
});

//  WEB
// Route pour récupérer le dernier ID référencé depuis la base de données
app.get('/getLastID', (req, res) => {
  // Requête SQL pour récupérer le dernier ID trié par ordre décroissant
  const sql = 'SELECT id FROM gamename ORDER BY id DESC LIMIT 1';

  // Exécutez la requête sur la connexion à la base de données
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération du dernier ID référencé :', err);
      res.status(500).send('Erreur lors de la récupération du dernier ID référencé.');
    } else {
      const lastID = result[0].id;
      console.log('Dernier ID référencé récupéré depuis la base de données :', lastID);

      // Envoyez le dernier ID en tant que réponse JSON
      res.json({ lastID });
    }
  });
});




// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur API en cours d'exécution sur le port ${port}`);
});