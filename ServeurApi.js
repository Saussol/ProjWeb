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
  const sql = 'SELECT nom, score FROM scoreBorad ORDER BY score DESC LIMIT 1';

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

  // Insérez le nom et le score dans la base de données
  const sql = 'INSERT INTO scoreBorad (nom, score) VALUES (?, ?)';
  db.query(sql, [name, score], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'enregistrement du score :', err);
      res.status(500).json({ error: 'Erreur lors de l\'enregistrement du score.' });
      return;
    }

    console.log('Score enregistré avec succès !');
    res.status(200).json({ message: 'Score enregistré avec succès !' });
  });
});


// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur API en cours d'exécution sur le port ${port}`);
});