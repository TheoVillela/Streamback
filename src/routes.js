const express = require('express');
const rtControl = require('./controlers/routesControl');
const routes = express.Router();
const auth = require('./auth');

routes.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const isValid = await rtControl.validUser(login, password);

    if(isValid){
        // if(await rtControl.isUserConnected(login)){
        //     console.log('Usuário já esta conectado.');
        //     return res.status(401).json({ message: 'Usuário já esta conectado.'});
        // }

        // const token = auth.generateToken(login, password);
        // await rtControl.salvarToken(login, token);
        
        // Set the token as an httpOnly cookie
        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production'
        // });
        
        console.log('Logged in successfully');
        return res.status(200).json({
            response: "Logged in successfully.",
            // token: token,
            adm: isValid[1]
          });
    }
    else{
        console.log('Credenciais inválidas.');
        return res.status(401).json({ message: 'Credenciais inválidas.'});
    }
});

routes.post('/getStream', (req, res) => {
    if(rtControl.validToken(req, res)){
        rtControl.startStream()
        console.log('Stream iniciada');
        return res.status(200).json('Stream iniciada');
    }
    else
        return res.status(401).json({ message: 'Error ao validar o token'});
});

// Add a logout endpoint to clear the token cookie
routes.post('/logout', (req, res) => {
    const { login } = req.body;
    rtControl.deleteToken(login);
  
    res.status(200).json({ message: 'Logged out successfully' });
  });

routes.post('/authStream', async (req, res) => {
    const { login, token } = req.body;

    if(! await rtControl.validToken(login, token))
        return res.status(401).json({ error: 'Token Error' });  
    
    
    res.status(200).json({ message: 'Valid Token' });
}); 
module.exports = routes;