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

// Configuration de la route de soumission des scores
app.post('/scoreSubmissionEndpoint', (req, res) => {
    const nom = req.body.name;
    const score = req.body.score;

    // Insérez les données dans la base de données MySQL
    const sql = 'INSERT INTO scores (nom, score) VALUES (?, ?)';
    db.query(sql, [nom, score], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion du score : ', err);
            res.status(500).json({ error: 'Erreur lors de l\'enregistrement du score.' });
        } else {
            console.log('Score enregistré avec succès.');
            res.status(200).json({ message: 'Score enregistré avec succès.' });
        }
    });
});

// Exemple de route pour récupérer des données depuis la base de données
app.get('/scoreBorad', (req, res) => {
  const sql = 'SELECT * FROM scores';
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur API en cours d'exécution sur le port ${port}`);
});