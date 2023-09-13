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
document.addEventListener('DOMContentLoaded', () => {
  fetch('/bestPlayers')
    .then(response => response.json())
    .then(data => {
      const podium = document.querySelector('.podium');
      data.forEach((player, index) => {
        const playerElement = podium.querySelector(`#player${index + 1}`);
        if (playerElement) {
          playerElement.querySelector('span#player1Name').textContent = player.nom;
          playerElement.querySelector('span#player1Score').textContent = player.score;
        }
      });
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des meilleurs joueurs :', error);
    });
});


// Unity
app.post('/savescore', (req, res) => {
  const { name, score } = req.body;

  // Vérifiez le nombre d'entrées actuelles dans la base de données
  const countSql = 'SELECT COUNT(*) AS count FROM scoreBoard';
  const selectLowestScoreSql = 'SELECT MIN(score) AS lowestScore FROM scoreBoard';

  db.query(countSql, (err, resultCount) => {
    if (err) {
      console.error('Erreur lors de la récupération du nombre d\'entrées :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération du nombre d\'entrées.' });
      return;
    }

    const currentCount = resultCount[0].count;

    // Si le nombre d'entrées est déjà de 10, vérifiez le score le plus bas
    if (currentCount >= 10) {
      db.query(selectLowestScoreSql, (err, resultLowestScore) => {
        if (err) {
          console.error('Erreur lors de la récupération du score le plus bas :', err);
          res.status(500).json({ error: 'Erreur lors de la récupération du score le plus bas.' });
          return;
        }

        const lowestScore = resultLowestScore[0].lowestScore;

        // Si le nouveau score est supérieur au score le plus bas, supprimez le score le plus bas
        if (score > lowestScore) {
          const deleteSql = 'DELETE FROM scoreBoard WHERE score = ? LIMIT 1';
          db.query(deleteSql, [lowestScore], (err) => {
            if (err) {
              console.error('Erreur lors de la suppression du score le plus bas :', err);
              res.status(500).json({ error: 'Erreur lors de la suppression du score le plus bas.' });
              return;
            }

            // Maintenant, insérez le nouveau score
            const insertSql = 'INSERT INTO scoreBoard (nom, score) VALUES (?, ?)';
            db.query(insertSql, [name, score], (err) => {
              if (err) {
                console.error('Erreur lors de l\'enregistrement du score :', err);
                res.status(500).json({ error: 'Erreur lors de l\'enregistrement du score.' });
                return;
              }

              console.log('Score enregistré avec succès !');
              res.status(200).json({ message: 'Score enregistré avec succès !' });
            });
          });
        } else {
          console.error('Le tableau est plein et le score est inférieur au score le plus bas.');
          res.status(400).json({ error: 'Le tableau est plein et le score est inférieur au score le plus bas.' });
        }
      });
    } else {
      // Si le nombre d'entrées est inférieur à 10, insérez simplement le nouveau score
      const insertSql = 'INSERT INTO scoreBoard (nom, score) VALUES (?, ?)';
      db.query(insertSql, [name, score], (err) => {
        if (err) {
          console.error('Erreur lors de l\'enregistrement du score :', err);
          res.status(500).json({ error: 'Erreur lors de l\'enregistrement du score.' });
          return;
        }

        console.log('Score enregistré avec succès !');
        res.status(200).json({ message: 'Score enregistré avec succès !' });
      });
    }
  });
});


// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur API en cours d'exécution sur le port ${port}`);
});