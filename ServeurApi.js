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
  user: 'sql11647688',
  password:'S9yZs2bsdW',
  database: 'sql11647688'
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
// Ajoutez cette route à votre API
app.get('/meilleurJoueur', (req, res) => {
  const selectMeilleurJoueurSql = 'SELECT nom, score FROM scoreBoard ORDER BY score DESC LIMIT 1';

  db.query(selectMeilleurJoueurSql, (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération du meilleur joueur :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération du meilleur joueur.' });
      return;
    }

    const meilleurJoueur = result[0];

    if (!meilleurJoueur) {
      console.error('Aucun joueur trouvé.');
      res.status(404).json({ error: 'Aucun joueur trouvé.' });
      return;
    }

    res.status(200).json(meilleurJoueur);
  });
});

app.get('/top3Scores', (req, res) => {
  const selectTop3ScoresSql = 'SELECT nom, score FROM scoreBoard ORDER BY score DESC LIMIT 3';

  db.query(selectTop3ScoresSql, (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des trois meilleurs scores :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des trois meilleurs scores.' });
      return;
    }

    res.status(200).json(result);
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