const jwk  = require("jsonwebtoken");

function generateToken(login, pwd){
    const user = {
        login: login,
        pwd: pwd
    };
      
    const secretKey = "secret";  
    const token = jwk.sign(
        { id: user.id, login: user.login },
        secretKey,
        { expiresIn: '1h' }
      );
      
    console.log(token);
    return token;
}

module.exports = {
    generateToken,
};