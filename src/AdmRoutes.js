const express = require('express');
const bcrypt = require('bcryptjs');

const dbClient = require('./bd/bdClient');
const router = express.Router();

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

// Create a new user
router.post('/adduser', async (req, res) => {
    const { login, email, password, isadmin } = req.body;

    const user = await prisma.users.create({
      data:{
        login,
        email,
        password_hash:await bcrypt.hash(password, 10),
        isadmin
      }
    });
  
    return res.status(201).json({ message: user });

    // const db = dbClient.NovaConexao();
    // try {
    //   db.connect();
      
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   const result = await db.query(
    //     'INSERT INTO users (login, email, password_hash, isadmin) VALUES ($1, $2, $3, $4) RETURNING *',
    //     [login, email, hashedPassword, isadmin]
    //   );
  
    //   res.status(201).json(result.rows[0]);
    //   db.end();
    // } catch (err) {
    //   console.error(err);
    //   res.status(500).json({ error: 'Internal server error' });
    //   db.end();
    // }
});

// Update a user by ID
router.put('/edituser/:id', async (req, res) => {
    const { id } = req.params;
    const { login, email, password } = req.body;

    const db = dbClient.NovaConexao();
    try {
      db.connect();
      
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
      const result = await db.query(
        'UPDATE users SET login = $1, email = $2, password_hash = $3 WHERE id = $4 RETURNING *',
        [login, email, hashedPassword, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(result.rows[0]);
      db.end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      db.end();
    }
});

// Delete a user by login
router.delete('/deleteuser/:login', async (req, res) => {
    const { login } = req.params;
    const db = dbClient.NovaConexao();
    try {
      
      db.connect();
      
      const result = await db.query('DELETE FROM users WHERE login = $1', [login]);
  
      if (result.rowCount === 0) {
        db.end();
        return res.status(404).json({ error: 'User not found' }); 
      }
  
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      db.end();
    }
});

// Get all users
router.get('/getall', async (req, res) => { 
  const db = dbClient.NovaConexao();

  try {
      db.connect();
      
      const result = await db.query('SELECT * FROM users');
      res.status(200).json(result.rows);
      db.end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      db.end();
    }
});

module.exports = router;