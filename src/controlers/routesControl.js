const auth = require('../auth')
const client = require('../bd/bdClient');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

async function obterUsuario(login){
  const user = await prisma.users.findFirst({
    where: { 
      login:{
        equals: login,
        mode: 'insensitive'
      }
    }
  });

  return user;
}

async function CreateUser(login, email, senha){
  const user = await prisma.users.create({
    data:{
      login,
      email,
      password:await bcrypt.hash(senha, 10),
    }
  });

  return user;
}

async function validUser(login, pwd){
  // const db = client.NovaConexao();
  
  try {
    // db.connect();
    
    const result = await obterUsuario(login)
    
    // await db.query(
    //   'SELECT * FROM users WHERE login = $1',
    //   [login]
    // );

    // if (result.rows.length === 0) {
    //   db.end();
    //   console.log('User not found.');
    //   return false;
    // }

    // const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(pwd, result.password_hash);

    if (!isPasswordValid) {
      // db.end();
      return false;
    }
    
    // db.end();

    return [true, result.isadmin];
  } catch (err) {
    console.error(err);
    // db.end();
    return false;
  }
}

async function isUserConnected(login){
  const db = client.NovaConexao();
  
  try {
    db.connect();
    
    const result = await db.query(
      'SELECT * FROM usertoken WHERE login = $1',
      [login]
    );

    if (result.rows.length === 0) {
      console.log('User not connected');
      return false
    }
  
    console.log('User CONNECTED.');    
    db.end();
    return true;
  } catch (err) {
    console.error(err);
    db.end();
    return false;
  }
}

async function validToken(login, token){
  const db = client.NovaConexao();
  
  try {
    db.connect();
    
    const result = await db.query(
      'SELECT * FROM usertoken WHERE login = $1 and token = $2',
      [login, token]
    );

    if (result.rows.length === 0) {
      console.log('Invalid token');
      db.end();
      return false
    }
  
    console.log('Valid token');    
    db.end();
    return true;
  } catch (err) {
    console.error(err);
    db.end();
    return false;
  }
}

async function deleteToken(login){
  const db = client.NovaConexao();
  try {
    db.connect();
    
    const result = await db.query('DELETE FROM usertoken WHERE login = $1', [login]);

    if (result.rowCount === 0) {
      db.end();
      console.log('Token not found')
      return false 
    }

    db.end();
    return true;
  } catch (err) {
    console.error(err);
    db.end();
  }
}

function startStream(){
    //O HLS é um protocolo de streaming de vídeo popular que é amplamente suportado por navegadores e dispositivos.
    //Para usar o HLS, o back end em Node deve usar uma biblioteca como o Hls.js.
   const fs = require('fs');
   const hls = require('hls');

   const stream = fs.createReadStream('video.mp4');

   const hlsSegmenter = new hls.Segmenter({
       output: 'stream.m3u8',
       segmentLength: 10,
   });

   hlsSegmenter.addStream(stream);

   hlsSegmenter.start();
   
   //return hlsSegmenter.start();
   //Este código irá criar um arquivo stream.m3u8 que contém uma lista de segmentos de vídeo.
}

async function salvarToken(login, token){
    const db = client.NovaConexao();

    try {
        db.connect();
      
        const result = await db.query('INSERT INTO usertoken (login, token) VALUES ($1, $2)', [login, token]);
        db.end();
    } catch (err) {
        console.error(err);
        db.end();
    }
}

module.exports = {
    validUser,
    validToken,
    deleteToken,
    startStream,
    isUserConnected,
    salvarToken
};

