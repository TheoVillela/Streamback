const express = require('express');
const rc = require('./controlers/routesControl')
const router = express.Router();

// Create a new user
router.post('/adm/adduser', async (req, res) => {
    const { login, email, password, isadmin } = req.body;

    const user = await rc.createUser(login, email, password, isadmin)
  
    return res.status(201).json({ message: user });
});

// Update a user by ID
router.put('/adm/edituser/:id', async (req, res) => {
    const { id } = req.params;
    const { login, email, password, isadmin } = req.body;

    try {
      const result = await rc.updateUser(id, login, email, password, isadmin)
  
      if (!result) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a user by login
router.delete('/adm/deleteuser/:login', async (req, res) => {
    const { login } = req.params;

    try {
      const result = await rc.deleteUser(login);
  
      if (!result) {
        return res.status(404).json({ error: 'User not found' }); 
      }
  
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all users
router.get('/adm/getall', async (req, res) => { 
  try {
      const result = await rc.obterAllUsers();
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;