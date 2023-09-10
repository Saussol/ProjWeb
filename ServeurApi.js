const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

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

// Define a route to serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Web
app.get('/bestPlayer', (req, res) => {
  const sql = 'SELECT nom, score FROM scoreBoard ORDER BY score DESC LIMIT 1';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération du meilleur joueur :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération du meilleur joueur.' });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: 'Aucun joueur trouvé.' });
      return;
    }

    const bestPlayer = result[0];
    console.log('Meilleur joueur récupéré depuis la base de données :', bestPlayer);

    res.json(bestPlayer);
  });
});



// Unity
app.post('/savescore', (req, res) => {
  const { name, score } = req.body;

  // Vérifiez le nombre d'entrées actuelles dans la base de données
  const countSql = 'SELECT COUNT(*) AS count FROM scoreBoard';

  db.query(countSql, (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération du nombre d\'entrées :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération du nombre d\'entrées.' });
      return;
    }

    const currentCount = result[0].count;

    // Si le nombre d'entrées est déjà de 10, renvoyez une erreur
    if (currentCount >= 10) {
      console.error('Le tableau est plein. Impossible d\'ajouter un nouveau score.');
      res.status(400).json({ error: 'Le tableau est plein. Impossible d\'ajouter un nouveau score.' });
      return;
    }

    // Si le nombre d'entrées est inférieur à 10, insérez le nouveau score
    const insertSql = 'INSERT INTO scoreBoard (nom, score) VALUES (?, ?)';
    db.query(insertSql, [name, score], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'enregistrement du score :', err);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement du score.' });
        return;
      }

      console.log('Score enregistré avec succès !');
      res.status(200).json({ message: 'Score enregistré avec succès !' });
    });
  });
});


// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur API en cours d'exécution sur le port ${port}`);
});