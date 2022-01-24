const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'J@maicanmecrazy',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES(?,?,?,?)`;
// const params = [8, 'Montague', 'Summers', 1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result)
// })
// db.query(`DELETE FROM candidates WHERE id=?`, 1, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });
// db.query(`SELECT * FROM candidates WHERE id=8`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// })

//search all candidates
app.get('/api/candidates', (req, res) => {
   const sql = `SELECT * FROM candidates`;

    db.query(sql, (err, rows) => {
    if (err) {
        res.status(500),json({ error: err.message });
    }
    res.json({
        message: 'success',
        data: rows
    })
});
}) ;

//search candidates by id
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id=?`;
    const params = [req.params.id];

    db.query(sql, params, (err, rows) => {
        if (err) {
            res.status(400),json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        })
    });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.statusMessage(400).json({ error: res.message });
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'deleted',
          changes: result.affectedRows,
          id: req.params.id
        });
      }
    });
  });

  //create a candidate
  app.post('/api/candidate', ({ body }, res) => {
      const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
      if (errors) {
                   res.status(400).json({ errors: errors });
          return;
      }
      const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
      VALUES (?,?,?)`;
      const params = [body.first_name, body.last_name, body.industry_connected];

      db.query(sql, params, (err, result) => {
          if (err) {
              res.status(400).json({ error: err.message });
              return;
          } res.json({ 
              message: 'success',
              data: body
          });
      });
  });

app.use((req, res) => {
    res.status(404).end();
})
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});