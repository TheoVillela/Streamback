const express = require('express');
const rc = require('./controlers/routesControl');
const routes = express.Router();

routes.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const userResult = await rc.validUser(login, password);

    if(userResult){
        if(await rc.isUserConnected(login)){
            console.log('Usuário já esta conectado.');
            return res.status(401).json({ message: 'Usuário já esta conectado.'});
        }

        const token = rc.generateToken(login, password);
        await rc.salvarToken(login, token);
        
        // Set the token as an httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
        
        console.log('Logged in successfully');
        return res.status(200).json({
            response: "Logged in successfully.",
            token: token,
            adm: userResult.isadmin
        });
    }
    else{
        console.log('Credenciais inválidas.');
        return res.status(401).json({ message: 'Credenciais inválidas.'});
    }
});

// Add a logout endpoint to clear the token cookie
routes.post('/logout', async (req, res) => {
    const { login } = req.body;
    await rc.deleteToken(login);
  
    res.status(200).json({ message: 'Logged out successfully' });
  });

routes.post('/authStream', async (req, res) => {
    const { login, token } = req.body;

    if(! await rc.validToken(login, token))
        return res.status(401).json({ error: 'Token Error' });  
    
    
    res.status(200).json({ message: 'Valid Token' });
}); 

module.exports = routes;